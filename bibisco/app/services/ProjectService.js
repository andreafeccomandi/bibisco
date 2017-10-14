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
  BibiscoDbConnectionService, BibiscoPropertiesService,
  CollectionUtilService, ContextService, FileSystemService, LoggerService,
  UtilService, ProjectDbConnectionService, UuidService
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

      let architectureCollection = projectdb.addCollection('architecture');
      CollectionUtilService.insert(architectureCollection, {
        type: 'premise',
        text: ''
      });
      CollectionUtilService.insert(architectureCollection, {
        type: 'fabula',
        text: ''
      });
      CollectionUtilService.insert(architectureCollection, {
        type: 'setting',
        text: ''
      });
      projectdb.addCollection('strands');
      projectdb.addCollection('chapters');
      projectdb.addCollection('chapter_infos');
      projectdb.addCollection('scenes');
      projectdb.addCollection('scene_revision_characters');
      projectdb.addCollection('scene_revision_strands');
      projectdb.addCollection('scene_revisions');
      projectdb.addCollection('maincharacters');
      projectdb.addCollection('maincharacters_infos_no_question');
      projectdb.addCollection('maincharacters_infos_with_question');
      projectdb.addCollection('secondarycharacters');
      projectdb.addCollection('locations');

      // save project database
      ProjectDbConnectionService.saveDatabase();

      // add project to bibisco db
      this.addProjectToBibiscoDb(projectId, name);

      LoggerService.debug('End ProjectService.create...');
    },
    createProjectsDirectory: function(selectedProjectsDirectory) {
      let projectsDirectory;
      let result = null;

      if (selectedProjectsDirectory.endsWith(
          "_internal_bibisco2_projects_db_")) {
        projectsDirectory = selectedProjectsDirectory;
      } else {
        projectsDirectory = FileSystemService.concatPath(
          selectedProjectsDirectory,
          '_internal_bibisco2_projects_db_');
      }

      if (FileSystemService.createDirectory(projectsDirectory)) {
        result = projectsDirectory;
      }
      return result;
    },
    delete: function(id) {
      this.deleteProjectFromBibiscoDb(id);
      let projectPath = ProjectDbConnectionService.calculateProjectPath(
        id);
      FileSystemService.deleteDirectory(projectPath);
    },
    deleteAllProjectsFromBibiscoDb: function() {
      BibiscoDbConnectionService.getBibiscoDb().getCollection('projects')
        .findAndRemove({});
      BibiscoDbConnectionService.saveDatabase();
    },
    deleteProjectFromBibiscoDb: function(id) {
      BibiscoDbConnectionService.getBibiscoDb().getCollection('projects')
        .findAndRemove({
          id: id
        });
      BibiscoDbConnectionService.saveDatabase();
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

    importExistingProject: function(projectId, projectName, callback) {

      LoggerService.debug('Start ProjectService.importExistingProject');

      // move project to projects directory
      this.moveImportedProjectToProjectsDirectory(projectId);

      // load project
      ProjectDbConnectionService.load(projectId);

      // callback
      callback();

      LoggerService.debug('End ProjectService.importExistingProject');
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
      let finalProjectPath = FileSystemService.concatPath(
        projectsDirectoryPath, projectId);
      let tempProjectPath = FileSystemService.concatPath(ContextService.getTempDirectoryPath(),
        projectId);

      FileSystemService.deleteDirectory(finalProjectPath);
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
    },
    syncProjectDirectoryWithBibiscoDb: function(callback) {
      LoggerService.info('Start syncProjectDirectoryWithBibiscoDb');

      let projectsDirectory = BibiscoPropertiesService.getProperty(
        'projectsDirectory');

      // populate projectsInProjectDirectories
      let projectsInProjectDirectories = [];
      let projectsInProjectDirectoriesMap = new Map();
      let filesInProjectDirectories = FileSystemService.getFilesInDirectory(
        projectsDirectory);
      if (filesInProjectDirectories && filesInProjectDirectories.length >
        0) {
        for (let i = 0; i < filesInProjectDirectories.length; i++) {
          let projectDirectoryName = filesInProjectDirectories[i];
          LoggerService.info('Processing ' + projectDirectoryName);
          try {
            let projectInfo = checkProjectValidity(projectDirectoryName,
              projectsDirectory,
              FileSystemService, ProjectDbConnectionService);
            projectsInProjectDirectories.push(projectInfo.id);
            projectsInProjectDirectoriesMap.set(projectInfo.id,
              projectInfo.name);
            LoggerService.info(projectDirectoryName + ' is valid.');
          } catch (err) {
            LoggerService.info(projectDirectoryName + ' is not valid: ' +
              err);
          }
        }
      }

      // populate projectsInBibiscoDbIds
      let projectsInBibiscoDb = this.getProjects();
      let projectsInBibiscoDbIds = [];
      if (projectsInBibiscoDb && projectsInBibiscoDb.length > 0) {
        for (let i = 0; i < projectsInBibiscoDb.length; i++) {
          projectsInBibiscoDbIds.push(projectsInBibiscoDb[i].id);
        }
      }

      LoggerService.info('projectsInBibiscoDb=' + projectsInBibiscoDbIds);
      LoggerService.info('projectsInProjectDirectories=' +
        projectsInProjectDirectories);

      let projectsToAdd = UtilService.array.difference(
        projectsInProjectDirectories,
        projectsInBibiscoDbIds);
      let projectsToDelete = UtilService.array.difference(
        projectsInBibiscoDbIds, projectsInProjectDirectories);
      LoggerService.info('projectsToAdd=' + projectsToAdd);
      LoggerService.info('projectsToDelete=' +
        projectsToDelete);

      //delete projects from bibisco db
      for (let i = 0; i < projectsToDelete.length; i++) {
        this.deleteProjectFromBibiscoDb(projectsToDelete[i]);
      }

      //add projects to bibisco db
      for (let i = 0; i < projectsToAdd.length; i++) {
        this.addProjectToBibiscoDb(projectsToAdd[i],
          projectsInProjectDirectoriesMap.get(projectsToAdd[i]));
      }

      LoggerService.info('End syncProjectDirectoryWithBibiscoDb');
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
    let fileList = FileSystemService.getFilesInDirectoryRecursively(
      tempDirectoryPath, {
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

    // check project validity
    let projectInfo = checkProjectValidity(calculatedProjectId,
      tempDirectoryPath,
      FileSystemService, ProjectDbConnectionService);
    projectId = projectInfo.id;
    projectName = projectInfo.name;

    // check if project already exists in the installation of bibisco
    let projects = BibiscoDbConnectionService.getBibiscoDb().getCollection(
      'projects').addDynamicView(
      'project_by_id').applyFind({
      id: projectId
    });
    if (projects.count() == 1) {
      isAlreadyPresent = true;
      projectName = projects.data()[0].name;
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

function checkProjectValidity(projectDirectoryName, projectsDirectory,
  FileSystemService, ProjectDbConnectionService) {

  // check if project directory name is in UUID format
  if (!validator.isUUID(projectDirectoryName, 4)) {
    throw "Invalid archive: not UUID v4 file";
  }

  // open imported archive db to get id and name
  let projectdb = ProjectDbConnectionService.open(
    projectDirectoryName,
    FileSystemService.concatPath(projectsDirectory,
      projectDirectoryName));
  let projectInfo = projectdb.getCollection('project').get(1);

  // check if projects directory name is equals to project id
  if (projectDirectoryName != projectInfo.id) {
    throw "Project directory is not equals to project id: project directory = " +
    projectDirectoryName + " - id = " + projectInfo.id;
  }

  projectdb.close();

  return projectInfo;
}
