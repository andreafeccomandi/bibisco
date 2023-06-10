/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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

angular.module('bibiscoApp').service('ProjectService', function($injector, $interval, $rootScope, $timeout, 
  BibiscoDbConnectionService, BackupService, BibiscoPropertiesService, CollectionUtilService, 
  ContextService, FileSystemService, LocaleService, LoggerService, PopupBoxesService,
  UtilService, ProjectDbConnectionService, UuidService
) {
  'use strict';

  const SOMETHING_CHANGED = 1000; // I consider 1 second to cover the time between updating the collection backups and updating the last save
  const NEVER = -1; 
  const THIRTY_SECONDS = 30000; // 30 seconds = 30000 ms
  const ONE_MINUTE = 60000; // 1 minute = 60000 ms
  const TWO_MINUTES = 120000; // 2 minutes = 120000 ms
  const FIVE_MINUTES = 300000; // 5 minutes = 300000 ms
  const FIFTEEN_MINUTES = 900000; // 15 minutes = 900000 ms
  const THIRTY_MINUTES = 1800000; // 30 minutes = 1800000 ms
  const ONE_HOUR = 3600000; // 1 hour = 3600000 ms
  const TWO_HOURS = 7200000; // 2 hours = 7200000 ms
  const FOUR_HOURS = 14400000; // 4 hours = 14400000 ms

  let dateFormat = require('dateformat');
  let autobackupfunctionpromise;

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

    compareVersions: function(version1, version2) {
      
      version1 = version1.split('.');
      version2 = version2.split('.');
      
      for(let i=0;i<3;i++){  
        if(Number(version1[i])<Number(version2[i])){
          return -1;
        } else if(Number(version1[i])>Number(version2[i])){
          return 1;
        }
      }
      return 0;
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

        // VERSION 2.3

        // backups
        if (!projectdb.getCollection('backups')) { 
          projectdb.addCollection('backups');
          LoggerService.info('Added collection backups');
        }
        
        // notes
        if (!projectdb.getCollection('notes')) { 
          projectdb.addCollection('notes');
          LoggerService.info('Added collection notes');
        }

        // parts
        if (!projectdb.getCollection('parts')) { 
          projectdb.addCollection('parts');
          LoggerService.info('Added collection parts');
        }

        // VERSION 2.4

        // remove all dynamic views 
        projectdb.getCollection('backups').removeDynamicView('all_backups');
        projectdb.getCollection('chapters').removeDynamicView('all_chapters');
        projectdb.getCollection('maincharacters').removeDynamicView('all_maincharacters');
        projectdb.getCollection('notes').removeDynamicView('all_notes');
        projectdb.getCollection('objects').removeDynamicView('all_objects');
        projectdb.getCollection('parts').removeDynamicView('all_parts'); 
        projectdb.getCollection('secondarycharacters').removeDynamicView('all_secondarycharacters');
        projectdb.getCollection('strands').removeDynamicView('all_strands');
        LoggerService.info('Removed dynamicViews all_backups, all_chapters, all_maincharacters, ' + 
        'all_notes, all_objects, all_parts, all_secondarycharacters all_strands');
        
        // remove all scenes dynamic views
        let scenesCollection = projectdb.getCollection('scenes');
        let scenesCollectionDynamicViewsNames = [];
        for (let i = 0; i < scenesCollection.DynamicViews.length; i++) {
          scenesCollectionDynamicViewsNames.push(scenesCollection.DynamicViews[i].name);
        }
        for (let j = 0; j < 2; j++) { // do it twice because removeDynamicView function expects to remove only one dynamic view a time
          for (let i = 0; i < scenesCollectionDynamicViewsNames.length; i++) {
            scenesCollection.removeDynamicView(scenesCollectionDynamicViewsNames[i]);
            if (j===0) { // log onluy tthe first time
              LoggerService.info('Removed dynamicView ' + scenesCollectionDynamicViewsNames[i]);
            }
          }
        }
    
        // remove all location dynamic views
        let locationCollection = projectdb.getCollection('locations');
        for (let i = 0; i < 2; i++) { // do it twice because removeDynamicView function expects to remove only one dynamic view a time
          locationCollection.removeDynamicView('all_locations');
          locationCollection.removeDynamicView('nations');
          locationCollection.removeDynamicView('states');
          locationCollection.removeDynamicView('cities');
        }
        LoggerService.info('Removed dynamicViews all_locations, nations, states, cities');

        // VERSION 3.0

        // custom questions
        if (!projectdb.getCollection('customquestions')) { 
          projectdb.addCollection('customquestions');
          LoggerService.info('Added collection custom questions');
        }

        // add questions: "what is their health status?","how is their relationship with their children?"
        // add custom questions
        let mainCharacters = projectdb.getCollection('maincharacters').chain().data();
        let emptyAnswer = {characters: 0, text: '', words: 0};
        for (let i = 0; i < mainCharacters.length; i++) {
          
          // "what is their health status?"
          if (mainCharacters[i].personaldata.questions.length === 12) {
            mainCharacters[i].personaldata.questions.push(emptyAnswer);
            LoggerService.info('Added personaldata question for main character with $loki='+mainCharacters[i].$loki);
          }
          
          // "how is their relationship with their children?"
          if (mainCharacters[i].sociology.questions.length === 10) {
            mainCharacters[i].sociology.questions.push(emptyAnswer);
            LoggerService.info('Added sociology question for main character with $loki='+mainCharacters[i].$loki);
          }

          // custom questions
          if (!mainCharacters[i].custom) {
            mainCharacters[i].custom = {
              freetextcharacters: 0,
              freetext: '',
              freetextenabled: false,
              questions: [],
              status: 'todo',
              freetextwords: 0
            };
            LoggerService.info('Added custom section for main character with $loki='+mainCharacters[i].$loki);
          }
        }
        
        // groups
        if (!projectdb.getCollection('groups')) { 
          projectdb.addCollection('groups');
          LoggerService.info('Added collection groups');
        }

        // mind maps
        if (!projectdb.getCollection('mindmaps')) { 
          projectdb.addCollection('mindmaps');
          LoggerService.info('Added collection mindmaps');

          let relationNodes = projectdb.getCollection('relationsnodes').count();
          if (relationNodes > 0) {
            let translation = JSON.parse(FileSystemService.readFile(LocaleService.getResourceFilePath(projectInfo.language)));
            let mindmap = {
              name: translation.first_mindmap,
              relationnodes: 'relationsnodes',
              relationsedges: 'relationsedges'
            };
            CollectionUtilService.insertWithoutCommit(projectdb.getCollection('mindmaps'), mindmap);
            LoggerService.info('Inserted existing relationships into the first mind map');
          } 
        }

        // maintain old type of wordcount for projects created with version <3.0.0
        if (this.compareVersions(projectInfo.bibiscoVersion, '3.0.0') < 0) {
          projectInfo.wordCountMode = 'hyphenated-contracted-possessive-2-word';
        }
        
        // update project version
        projectInfo.bibiscoVersion = actualversion;
        CollectionUtilService.updateWithoutCommit(ProjectDbConnectionService.getProjectDb()
          .getCollection('project'), projectInfo);
        LoggerService.info('Updated project version to ' + actualversion);

        // save project database
        ProjectDbConnectionService.saveDatabase();
      }
    },

    checkCollectionsIntegrity: function() {
      let projectdb = ProjectDbConnectionService.getProjectDb();
      CollectionUtilService.fixCollectionIntegrity(projectdb.getCollection('wordswrittenperday'));
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
        lastScenetimeTag: '',
        wordCountMode : 'hyphenated-contracted-possessive-1-word',
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
      projectdb.addCollection('mindmaps');
      projectdb.addCollection('notes');
      projectdb.addCollection('objects');
      projectdb.addCollection('groups');
      projectdb.addCollection('parts');
      projectdb.addCollection('relationsnodes');
      projectdb.addCollection('relationsedges');
      projectdb.addCollection('wordswrittenperday');
      projectdb.addCollection('backups');
      projectdb.addCollection('customquestions');
      
      // save project database
      ProjectDbConnectionService.saveDatabase();

      // add project to bibisco db
      this.addProjectToBibiscoDb(projectId, name);

      // start auto backup
      this.startAutoBackup();

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
      return ProjectDbConnectionService.getProjectDb() ? ProjectDbConnectionService.getProjectDb().getCollection(
        'project').get(1) : null;
    },
    getProjects: function() {
      let collection = BibiscoDbConnectionService.getBibiscoDb().getCollection('projects');
      return CollectionUtilService.getDataSortedByField(collection, 'name');
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
      callback(this.getProjectInfo());

      LoggerService.debug('End ProjectService.import');
    },

    importExistingProject: function(projectId, projectName, callback) {

      LoggerService.debug('Start ProjectService.importExistingProject');

      // move project to projects directory
      this.moveImportedProjectToProjectsDirectory(projectId);

      // load project
      this.load(projectId);

      // callback
      callback(this.getProjectInfo());

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
      this.checkCollectionsIntegrity();
      let result = ProjectDbConnectionService.getProjectDb().getCollection(
        'project').get(1);
      this.startAutoBackup();
      return result;
    },

    close: function() {

      // If there's no open project, I go out.
      if (!this.getProjectInfo()) {
        return;
      }

      let autoBackupOnExit = BibiscoPropertiesService.getProperty('autoBackupOnExit') === 'true';
      LoggerService.info('ProjectService: close project - Auto backup on exit: ' + autoBackupOnExit);
      
      // destroy actual autobackup function promise if exists
      $interval.cancel(autobackupfunctionpromise);

      // clear root properties
      $rootScope.groupFilter = null;

      // execute backup on close
      if (autoBackupOnExit && this.itsTimeToBackup(SOMETHING_CHANGED)) {
        this.executeBackup({
          showWaitingModal: true,
          callback: function() {
            // close project
            ProjectDbConnectionService.close();
          }
        });
      } else {
        // close project
        ProjectDbConnectionService.close();
      }
    },

    startAutoBackup: function() {
      LoggerService.debug('Start startAutoBackup');

      // destroy actual autobackup function promise if exists
      if (autobackupfunctionpromise) {
        $interval.cancel(autobackupfunctionpromise);
      }
      
      let self = this;
      autobackupfunctionpromise = $interval(function () {
        let autoBackupFrequency = BibiscoPropertiesService.getProperty('autoBackupFrequency');  
        let delta;
        switch(autoBackupFrequency) {
        case 'NEVER':
          delta = NEVER;
          break;
        case 'THIRTY_MINUTES':
          delta = THIRTY_MINUTES;
          break;
        case 'ONE_HOUR':
          delta = ONE_HOUR;
          break;
        case 'TWO_HOURS':
          delta = TWO_HOURS;
          break;
        case 'FOUR_HOURS':
          delta = FOUR_HOURS;
          break;
        }
        LoggerService.debug('Auto backup function - frequency=' + autoBackupFrequency + ' delta=' + delta);
        if (delta !== NEVER && self.itsTimeToBackup(delta)) {
          self.executeBackup({
            showWaitingModal: false
          });
        }
      }, FIVE_MINUTES);
    },

    syncProjectDirectoryWithBibiscoDb: function() {
      LoggerService.info('Start syncProjectDirectoryWithBibiscoDb');

      let projectsDirectory = BibiscoPropertiesService.getProperty('projectsDirectory');

      // cycle projects in project directories
      let projectsInProjectDirectories = [];
      let projectsInProjectDirectoriesMap = new Map();
      let filesInProjectDirectories = FileSystemService.getFilesInDirectory(projectsDirectory);
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

    itsTimeToBackup: function(delta) {
      let result = false;
      let difference = null;

      // last save
      let lastsave = this.getProjectInfo().lastsave;
      let lastsavedate = lastsave ? new Date(lastsave) : null;

      // last backup
      let lastbackup = BackupService.getLastBackup();
      let lastbackupdate = lastbackup ? new Date(lastbackup.timestamp) : null;

      if (lastsavedate && !lastbackupdate) {
        result = true;
      }
      // calculate difference
      else if (lastsavedate && lastbackupdate) {
        difference = lastsavedate.getTime() - lastbackupdate.getTime();
        if (difference > delta) { 
          result = true;
        }
      }
      LoggerService.debug('Last save: '+ lastsavedate + '; last backup: ' 
        + lastbackupdate+'; difference: ' + difference + '; delta: ' + delta + '; it\'s time to backup ? ' + result);

      return result;
    },

    executeBackupIfSomethingChanged: function (options) {

      try {
        if (this.itsTimeToBackup(SOMETHING_CHANGED)) {
          this.executeBackup(options);
        } else {
          if (options.callback) {
            options.callback();
          }
        }
      } catch (error) {
        LoggerService.error(error);
        if (options.callback) {
          options.callback();
        }
      }
    },

    executeBackup: function (options) {

      let backupPath = BibiscoPropertiesService.getProperty('backupDirectory');
      FileSystemService.canWriteDirectoryOrThrowException(backupPath);

      if (options.showWaitingModal) {
        PopupBoxesService.waiting('backup_in_progress', 'BACKUP_DONE');
      }

      let projectInfo = this.getProjectInfo();
      LoggerService.debug('Start executing backup for project ' + projectInfo.name + ' to directory ' + backupPath + ' ...');
      let timestamp = new Date();
      let timestampFormatted = dateFormat(timestamp, 'yyyy_mm_dd_HH_MM_ss');
      let name = UtilService.string.slugify(projectInfo.name, '_');
      let filename = name + '_' + projectInfo.id + '_' + timestampFormatted;
      let completeBackupFilename = FileSystemService.concatPath(backupPath, filename);
      let maxBackupNumber = Number(BibiscoPropertiesService.getProperty('maxBackupNumber'));

      if (maxBackupNumber===0) {
        LoggerService.debug('Max backup number set to zero. Exit.');
        if (options.callback) {
          options.callback();
          $timeout(function () {
            $rootScope.$emit('BACKUP_DONE');
          }, 1000);
        }
      } else {
        try {
          // To prevent the waiting modal from ever closing, after 10 seconds 
          // I close it regardless of the outcome of the operation
          $timeout(function () {
            $rootScope.$emit('BACKUP_DONE');
          }, 10000);

          this.exportProject(projectInfo.id, completeBackupFilename, function(){
            BackupService.insert({
              filename: filename + '.bibisco2',
              timestamp: timestamp
            });
            LoggerService.info(projectInfo.id + ' backup done.');
            let backupToDelete = BackupService.getBackupsCount() - maxBackupNumber; 
            if (backupToDelete>0) {
              for (let i = 0; i < backupToDelete; i++) {
                BackupService.removeOldestBackup();
              }
            }
            if (options.callback) {
              options.callback();
            }
            $timeout(function () {
              $rootScope.$emit('BACKUP_DONE');
            }, 1000);
          });
        } catch (err) {
          LoggerService.error(projectInfo.id + ' backup failed: ' + err);
          $timeout(function () {
            $rootScope.$emit('BACKUP_DONE');
          }, 1000);
        }
      }
    },

    updateLastScenetimeTagWithoutCommit: function(time) {
      let projectInfo = this.getProjectInfo();
      projectInfo.lastScenetimeTag = time;
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

    addWordToProjectDictionary: function (word) {
      
      let projectInfo = this.getProjectInfo();
      let projectdictionary = projectInfo.projectdictionary;
      if (!projectdictionary) {
        projectdictionary = [];
      }
      projectdictionary.push(word);
      
      projectInfo.projectdictionary = projectdictionary;
      CollectionUtilService.update(ProjectDbConnectionService.getProjectDb()
        .getCollection('project'), projectInfo);

      LoggerService.info('Added word to project dictionary: ' + word);
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

    if (!fileList) {
      throw 'Invalid archive';
    }

    let calculatedProjectId;
    for (let i = 0; i < fileList.length; i++) {
      const archiveFile = fileList[i];
      // calculate project id from file name
      // example: 55c41472-aa6d-41bc-930e-29c0014e9351/55c41472-aa6d-41bc-930e-29c0014e9351.json
      calculatedProjectId = (archiveFile.split('/')[1]).split('.')[0];
      LoggerService.debug('calculatedProjectId=' + calculatedProjectId);

      // check if project directory name is in UUID format
      if (validator.isUUID(calculatedProjectId, 4)) {
        LoggerService.debug('calculatedProjectId is valid');
        break;
      } else {
        LoggerService.debug('calculatedProjectId is not valid');
      }
    }
    if (!calculatedProjectId) {
      throw 'Invalid archive: no UUID v4 file found';
    }

    // check project validity
    let projectInfo = checkProjectValidity(calculatedProjectId,
      tempDirectoryPath,
      FileSystemService, ProjectDbConnectionService);
    projectId = projectInfo.id;
    projectName = projectInfo.name;

    // check if project already exists in the installation of bibisco
    let projects = BibiscoDbConnectionService.getBibiscoDb().getCollection(
      'projects').chain().find({
      id: projectId
    }).data();
    if (projects.length === 1) {
      isAlreadyPresent = true;
      projectName = projects[0].name;
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
