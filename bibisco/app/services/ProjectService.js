/*
 * Copyright (C) 2014-2020 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */

angular.module('bibiscoApp').service('ProjectService', function($injector,
  BibiscoDbConnectionService, BibiscoPropertiesService, CollectionUtilService, 
  ContextService, FileSystemService, LoggerService,
  UtilService, ProjectDbConnectionService, UuidService
) {
  'use strict';

  let dateFormat = require('dateformat');

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

    needToUpdate: function(projectversion, actualversion) {

      let needToUpdate = false;
      projectversion = projectversion.split('.');
      actualversion = actualversion.split('.');

      for(let i=0;i<3;i++){  
        if(Number(projectversion[i])<Number(actualversion[i])){
          needToUpdate=true;
          break;
        } else if(Number(projectversion[i])>Number(actualversion[i])){
          break;
        }
      }
      return needToUpdate;
    },

    checkProjectDbVersion: function() {

      let projectInfo = this.getProjectInfo();
      let projectversion = projectInfo.bibiscoVersion.split('-')[0];
      let actualversion = BibiscoPropertiesService.getProperty('version').split('-')[0];
      let needToUpdate = this.needToUpdate(projectversion, actualversion);
  
      LoggerService.info('*** Project ' + projectInfo.name + ' version: ' + projectInfo.bibiscoVersion + 
        ' - Is it necessary to update the project DB? '+ needToUpdate);

      if (needToUpdate) {
      
        let projectdb = ProjectDbConnectionService.getProjectDb();

        // VERSION 2.2
  
        // relationsnode
        if (!projectdb.getCollection('relationsnodes')) { 
          projectdb.addCollection('relationsnodes');
          LoggerService.info('Added collection relationsnodes');
        }
  
        // relationsedge
        if (!projectdb.getCollection('relationsedges')) {
          projectdb.addCollection('relationsedges');
          LoggerService.info('Added collection relationsedges');
        }
  
        // wordswrittenperday
        if (!projectdb.getCollection('wordswrittenperday')) {
          projectdb.addCollection('wordswrittenperday');
          LoggerService.info('Added collection wordswrittenperday');
        }
  
        // clear location dynamic view for nations, states, cities
        let locationCollection = projectdb.getCollection('locations');
        for (let i = 0; i < 2; i++) { // do it twice because removeDynamicView function expects to remove only one dynamic view a time
          locationCollection.removeDynamicView('nations');
          locationCollection.removeDynamicView('states');
          locationCollection.removeDynamicView('cities');
        }
        LoggerService.info('Removed dynamicViews nations, states, cities');

        // update project version
        projectInfo.bibiscoVersion = actualversion;
        CollectionUtilService.updateWithoutCommit(ProjectDbConnectionService.getProjectDb()
          .getCollection('project'), projectInfo);
        LoggerService.info('Updated project version to ' + actualversion);

        // save project database
        ProjectDbConnectionService.saveDatabase();
      }

    },

    create: function(name, language, author) {
      LoggerService.debug('Start ProjectService.create...');

      let projectId = UuidService.generateUuid();
      ProjectDbConnectionService.create(projectId);
      let projectdb = ProjectDbConnectionService.getProjectDb();

      // add collections
      projectdb.addCollection('project').insert({
        id: projectId,
        name: name,
        language: language,
        author: author,
        bibiscoVersion: BibiscoPropertiesService.getProperty(
          'version').split('-')[0],
        lastScenetimeTag: ''
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
      CollectionUtilService.insert(architectureCollection, {
        type: 'globalnotes',
        text: ''
      });
      projectdb.addCollection('strands');
      projectdb.addCollection('chapters');
      projectdb.addCollection('scenes');
      projectdb.addCollection('maincharacters');
      projectdb.addCollection('secondarycharacters');
      projectdb.addCollection('locations');
      projectdb.addCollection('objects');
      projectdb.addCollection('relationsnodes');
      projectdb.addCollection('relationsedges');
      projectdb.addCollection('wordswrittenperday');

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
        '_internal_bibisco2_projects_db_')) {
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
      LoggerService.info('Deleted project with id='+id);
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

      LoggerService.debug('Start ProjectService.import ' + projectName);

      // move project to projects directory
      this.moveImportedProjectToProjectsDirectory(projectId);

      // add project to bibisco db
      this.addProjectToBibiscoDb(projectId, projectName);

      // load project
      this.load(projectId);

      // callback
      callback();

      LoggerService.debug('End ProjectService.import');
    },

    importExistingProject: function(projectId, projectName, callback) {

      LoggerService.debug('Start ProjectService.importExistingProject');

      // move project to projects directory
      this.moveImportedProjectToProjectsDirectory(projectId);

      // load project
      this.load(projectId);

      // callback
      callback();

      LoggerService.debug('End ProjectService.importExistingProject');
    },

    importProjectArchiveFile: function(archiveFilePath, callback) {

      // get temp directory
      let tempDirectoryPath = ContextService.getTempDirectoryPath();

      // delete temp directory content
      FileSystemService.deleteDirectory(tempDirectoryPath);
      FileSystemService.createDirectory(tempDirectoryPath);

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

    export: function (exportPath, callback) {
      let projectId = this.getProjectInfo().id;
      this.exportProject(projectId, exportPath, callback);
    },

    exportProject: function (projectId, exportPath, callback) {
      let projectPath = ProjectDbConnectionService.calculateProjectPath(projectId);
      FileSystemService.zipFolder(projectPath, exportPath + '.bibisco2', callback);
    },

    load: function (id) {
      ProjectDbConnectionService.load(id);
      this.checkProjectDbVersion();
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'project').get(1);
    },

    syncProjectDirectoryWithBibiscoDb: function() {
      LoggerService.info('Start syncProjectDirectoryWithBibiscoDb');

      let projectsDirectory = BibiscoPropertiesService.getProperty(
        'projectsDirectory');
      let backupPath = FileSystemService.concatPath(BibiscoPropertiesService.getProperty(
        'projectsDirectory'), 'backup');

      // create backup directory if not exists
      if (!FileSystemService.exists(backupPath)) {
        FileSystemService.createDirectory(backupPath);
      }

      // cycle projects in project directories
      let projectsInProjectDirectories = [];
      let projectsInProjectDirectoriesMap = new Map();
      let filesInProjectDirectories = FileSystemService.getFilesInDirectory(
        projectsDirectory);
      if (filesInProjectDirectories && filesInProjectDirectories.length >
        0) {
        for (let i = 0; i < filesInProjectDirectories.length; i++) {
          let projectDirectoryName = filesInProjectDirectories[i];
          if (projectDirectoryName === 'backup' || projectDirectoryName === 'backup.1') {
            continue;
          }
          LoggerService.info('-----------------------------------');
          LoggerService.info('Processing ' + projectDirectoryName);
          try {
            let projectInfo = checkProjectValidity(projectDirectoryName,
              projectsDirectory,
              FileSystemService, ProjectDbConnectionService);
            projectsInProjectDirectories.push(projectInfo.id);
            projectsInProjectDirectoriesMap.set(projectInfo.id,
              projectInfo.name);
            LoggerService.info(projectDirectoryName + ' is valid.');
            
            // delete previous backup
            this.deletePreviousBackup(projectInfo.id, backupPath);  

            // execute backup
            this.executeBackup(projectInfo.id, projectInfo.name, backupPath);
            
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
    },

    getProjectBackupPath: function (projectId) {
      let projectPath = FileSystemService.concatPath(BibiscoPropertiesService.getProperty(
        'projectsDirectory'), projectId);
      return FileSystemService.concatPath(projectPath, 'backup');
    },

    deletePreviousBackup: function (projectId, backupPath) {
      let filesInBackupDirectory = FileSystemService.getFilesInDirectory(backupPath);
      if (filesInBackupDirectory && filesInBackupDirectory.length > 0) {
        for (let i = 0; i < filesInBackupDirectory.length; i++) {
          let filename = FileSystemService.concatPath(backupPath, filesInBackupDirectory[i]);
          if (UtilService.string.contains(filename, projectId)) {
            try {
              FileSystemService.deleteFile(filename);
              LoggerService.info('Delete previous backup: ' + filename + ' done');
            } catch (err) {
              LoggerService.error('Delete previous backup: ' + filename + ' failed: ' + err);
            }
            
          }
        }
      }
    },

    executeBackup: function (projectId, projectName, backupPath) {
    
      let timestampFormatted = dateFormat(new Date(), 'yyyy_mm_dd_HH_MM_ss');
      let name = UtilService.string.slugify(projectName, '_');
      let filename = name + '_' + projectId + '_' + timestampFormatted;
      let completeBackupFilename = FileSystemService.concatPath(backupPath, filename);

      try {
        this.exportProject(projectId, completeBackupFilename, function(){
          LoggerService.info(projectId + ' backup done.');
        });
      } catch (err) {
        LoggerService.error(projectId + ' backup failed: ' + err);
      }
    },

    updateLastScenetimeTagWithoutCommit: function(time) {
      let projectInfo = this.getProjectInfo();
      projectInfo.lastScenetimeTag = time;
      CollectionUtilService.updateWithoutCommit(ProjectDbConnectionService.getProjectDb()
        .getCollection('project'), projectInfo);
    },

    updateLastRelationsSaveWithoutCommit: function(time) {
      let projectInfo = this.getProjectInfo();
      projectInfo.lastRelationsSave = time;
      CollectionUtilService.updateWithoutCommit(ProjectDbConnectionService.getProjectDb()
        .getCollection('project'), projectInfo);
    },

    updateGoals: function(goals) {
      let projectInfo = this.getProjectInfo();

      projectInfo.wordsGoal = goals.wordsGoal;
      projectInfo.wordsPerDayGoal = goals.wordsPerDayGoal;
      projectInfo.deadline = goals.deadline;

      LoggerService.info('Update project goals');
      CollectionUtilService.update(ProjectDbConnectionService.getProjectDb()
        .getCollection('project'), projectInfo);
    },

    updateEpubMetadata: function(epubMetadata) {
      let projectInfo = this.getProjectInfo();

      projectInfo.author = epubMetadata.author;
      projectInfo.publisher = epubMetadata.publisher;
      projectInfo.copyright = epubMetadata.copyright;
      projectInfo.rights = epubMetadata.rights;
      projectInfo.isbn = epubMetadata.isbn;
      projectInfo.website = epubMetadata.website;

      LoggerService.info('Update epub metadata');
      CollectionUtilService.update(ProjectDbConnectionService.getProjectDb()
        .getCollection('project'), projectInfo);
    },

    updateProjectName: function (name) {
      let projectInfo = this.getProjectInfo();
      projectInfo.name = name;
      CollectionUtilService.update(ProjectDbConnectionService.getProjectDb()
        .getCollection('project'), projectInfo);

      // update project in bibisco db
      let project = BibiscoDbConnectionService.getBibiscoDb().getCollection('projects')
        .find({
          id: projectInfo.id
        })[0];
      project.name = name;
      BibiscoDbConnectionService.getBibiscoDb().getCollection('projects')
        .update(project);
      LoggerService.info('Update element with $loki=' + project.$loki +
        ' in projects (bibiscodb)');
      BibiscoDbConnectionService.saveDatabase();
    },

    updateProjectAuthor: function (author) {
      let projectInfo = this.getProjectInfo();
      projectInfo.author = author;
      CollectionUtilService.update(ProjectDbConnectionService.getProjectDb()
        .getCollection('project'), projectInfo);
    },

    selectCoverImage: function (filename) {
      let projectInfo = this.getProjectInfo();
      projectInfo.coverImage = filename;

      CollectionUtilService.update(ProjectDbConnectionService.getProjectDb()
        .getCollection('project'), projectInfo);
    },

    getSelectedCoverImageName: function () {
      
      let selectedCoverImageName = null;
      let projectInfo = this.getProjectInfo();
      if (projectInfo.coverImage) {
        let images = projectInfo.coverImages;
        for (let i = 0; i < images.length; i++) {
          if (images[i].filename === projectInfo.coverImage) {
            selectedCoverImageName = images[i].name;
            break;
          }
        }
      }
      return selectedCoverImageName;
    },

    addCoverImage: function (name, path) {
      let ImageService = $injector.get('ImageService');
      let filename = ImageService.addImageToProject(path);
      LoggerService.info('Added cover image file: ' + filename);

      let projectInfo = this.getProjectInfo();
      let images = projectInfo.coverImages;
      if (!images) {
        images = [];
      }
      images.push({
        name: name,
        filename: filename
      });

      projectInfo.coverImages = images;
      CollectionUtilService.update(ProjectDbConnectionService.getProjectDb()
        .getCollection('project'), projectInfo);
    },

    deleteCoverImage: function (filename) {
      let ImageService = $injector.get('ImageService');
      // delete image file
      ImageService.deleteImage(filename);
      LoggerService.info('Deleted cover image file: ' + filename);

      // delete reference
      let projectInfo = this.getProjectInfo();
      let images = projectInfo.coverImages;
      let imageToRemovePosition;
      for (let i = 0; i < images.length; i++) {
        if (images[i].filename === filename) {
          imageToRemovePosition = i;
          break;
        }
      }
      images.splice(imageToRemovePosition, 1);
      projectInfo.coverImages = images;

      // clear selected cover image if it's the deleted image
      if (projectInfo.coverImage === filename) {
        projectInfo.coverImage = null;
      }


      CollectionUtilService.update(ProjectDbConnectionService.getProjectDb()
        .getCollection('project'), projectInfo);

      return projectInfo.coverImages;
    },
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
      });

    if (!fileList || fileList.length !== 1) {
      throw 'Invalid archive';
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
    if (projects.count() === 1) {
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
  };

  LoggerService.debug('End checkArchive() : ' + JSON.stringify(result));

  return result;
}


function checkProjectValidity(projectDirectoryName, projectsDirectory,
  FileSystemService, ProjectDbConnectionService) {

  // check if project directory name is in UUID format
  if (!validator.isUUID(projectDirectoryName, 4)) {
    throw 'Invalid archive: not UUID v4 file';
  }

  // open imported archive db to get id and name
  let projectdb = ProjectDbConnectionService.open(
    projectDirectoryName,
    FileSystemService.concatPath(projectsDirectory,
      projectDirectoryName));
  let projectInfo = projectdb.getCollection('project').get(1);

  // check if projects directory name is equals to project id
  if (projectDirectoryName !== projectInfo.id) {
    throw 'Project directory is not equals to project id: project directory = ' +
    projectDirectoryName + ' - id = ' + projectInfo.id;
  }

  projectdb.close();

  return projectInfo;
}
