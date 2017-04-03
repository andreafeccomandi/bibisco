/*
 * Copyright (C) 2014-2017 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */

angular.module('bibiscoApp').service('ProjectService', function(
  BibiscoDbConnectionService, BibiscoPropertiesService, ContextService,
  FileSystemService, LoggerService, ProjectDbConnectionService, UuidService
) {
  'use strict';

  return {

    addProjectToBibiscoDb: function(projectId, name) {
      // add project to bibisco db
      BibiscoDbConnectionService.getBibiscoDb().getCollection('projects')
        .insert({
          id: projectId,
          name: name
        });

      // save bibisco database
      BibiscoDbConnectionService.saveDatabase();
    },

    create: function(name, language) {
      LoggerService.debug('Start ProjectService.create...');

      let projectId = UuidService.generateUuid();
      ProjectDbConnectionService.create(projectId);
      let projectdb = ProjectDbConnectionService.getProjectDb();

      // add collections
      projectdb.addCollection('project').insert({
        id: projectId,
        name: name,
        language: language,
        bibiscoVersion: BibiscoPropertiesService.getProperty(
          'version')
      });
      projectdb.addCollection('premise');
      projectdb.addCollection('fabula');
      projectdb.addCollection('setting');
      projectdb.addCollection('strands');
      projectdb.addCollection('chapters');
      projectdb.addCollection('scenes');
      projectdb.addCollection('characters');
      projectdb.addCollection('locations');

      // save project database
      ProjectDbConnectionService.saveDatabase();

      // add project to bibisco db
      this.addProjectToBibiscoDb(projectId, name);

      LoggerService.debug('End ProjectService.create...');
    },
    delete: function(id) {
      BibiscoDbConnectionService.getBibiscoDb().getCollection('projects')
        .findAndRemove({
          id: id
        });
      BibiscoDbConnectionService.saveDatabase();
      let projectPath = ProjectDbConnectionService.calculateProjectPath(
        id);
      FileSystemService.deleteDirectory(projectPath);
    },
    getProjectsCount: function() {
      return BibiscoDbConnectionService.getBibiscoDb().getCollection(
        'projects').count();
    },
    getProjectInfo: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'project').get(1);
    },
    getProjects: function() {
      return BibiscoDbConnectionService.getBibiscoDb().getCollection(
        'projects').addDynamicView(
        'all_projects').applySimpleSort('name').data();
    },
    import: function(projectId, projectName, callback) {
      LoggerService.debug('Start ProjectService.import');

      // move project to projects directory
      this.moveImportedProjectToProjectsDirectory(projectId);

      // add project to bibisco db
      this.addProjectToBibiscoDb(projectId, projectName);

      // load project
      ProjectDbConnectionService.load(projectId);

      // callback
      callback();

      LoggerService.debug('End ProjectService.import');
    },
    importProjectArchiveFile: function(archiveFilePath, callback) {

      // get temp directory
      let tempDirectoryPath = ContextService.getTempDirectoryPath();

      // delete temp directory content
      FileSystemService.deleteDirectory(tempDirectoryPath);
      FileSystemService.createDirectory(tempDirectoryPath)

      // unzip archive file to temp directory
      FileSystemService.unzip(archiveFilePath, tempDirectoryPath,
        function() {

          let checkArchiveResult = checkArchive(
            tempDirectoryPath, BibiscoDbConnectionService,
            FileSystemService,
            LoggerService, ProjectDbConnectionService);

          callback(checkArchiveResult);
        });
    },
    moveImportedProjectToProjectsDirectory: function(projectId) {

      let projectsDirectoryPath = BibiscoPropertiesService.getProperty(
        'projectsDirectory');
      let tempProjectPath = FileSystemService.concatPath(ContextService.getTempDirectoryPath(),
        projectId);

      FileSystemService.copyFileToDirectory(tempProjectPath,
        projectsDirectoryPath);
    },
    export: function(callback) {
      LoggerService.debug('***** Start ProjectService.export...');
      let projectId = '55c41472-aa6d-41bc-930e-29c0014e9351';
      let projectPath = ProjectDbConnectionService.calculateProjectPath(
        projectId);
      FileSystemService.zipFolder(projectPath,
        '/Users/andreafeccomandi/Documents/export/' + projectId +
        '.bibisco2', callback);
      LoggerService.debug('***** End ProjectService.export...');
    }
  };
});

function checkArchive(tempDirectoryPath, BibiscoDbConnectionService,
  FileSystemService, LoggerService, ProjectDbConnectionService) {

  LoggerService.debug('Start checkArchive()');

  let isValidArchive = false;
  let isAlreadyPresent = false;
  let projectId;
  let projectName;

  try {
    // get json loki file
    let fileList = FileSystemService.getFilesInDirectory(tempDirectoryPath, {
      directories: false,
      globs: ['**/*.json']
    })

    if (!fileList || fileList.length != 1) {
      throw "Invalid archive";
    }

    // calculate project id from file name
    // example: 55c41472-aa6d-41bc-930e-29c0014e9351/55c41472-aa6d-41bc-930e-29c0014e9351.json
    let calculatedProjectId = (fileList[0].split('/')[0]).split('.')[0];
    LoggerService.debug('calculatedProjectId=' + calculatedProjectId);

    // check if calculate project id is in UUID format
    let isUUID = validator.isUUID(calculatedProjectId, 4)
    if (!isUUID) {
      throw "Invalid archive: not UUID v4 file";
    }

    // open imported archive db to get id and name
    let projectdb = ProjectDbConnectionService.open(calculatedProjectId,
      FileSystemService.concatPath(tempDirectoryPath, calculatedProjectId));
    let projectInfo = projectdb.getCollection('project').get(1);
    LoggerService.debug(projectInfo);
    projectId = projectInfo.id;
    projectName = projectInfo.name;
    projectdb.close();

    // check if project already exists in the installation of bibisco
    let projectNumber = BibiscoDbConnectionService.getBibiscoDb().getCollection(
      'projects').addDynamicView(
      'project_by_id').applyFind({
      id: projectId
    }).count();

    if (projectNumber == 1) {
      isAlreadyPresent = true;
    }
    isValidArchive = true;

  } catch (err) {
    LoggerService.error(err);
  }

  let result = {
    isValidArchive: isValidArchive,
    isAlreadyPresent: isAlreadyPresent,
    projectId: projectId,
    projectName: projectName
  }

  LoggerService.debug('End checkArchive() : ' + JSON.stringify(result));

  return result;
}
