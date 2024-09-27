/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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

angular.module('bibiscoApp').service('SequelService', function(
  BibiscoDbConnectionService, BibiscoPropertiesService,
  CollectionUtilService, FileSystemService, LoggerService, 
  ProjectDbConnectionService, UuidService
) {
  'use strict';

  return {

    createSequel: function (projectId, name) {

      // create sequel project ID
      let sequelProjectId = UuidService.generateUuid();

      // calculate paths
      let projectsDirectoryPath = BibiscoPropertiesService.getProperty('projectsDirectory');
      let sourceProjectDirectoryPath = FileSystemService.concatPath(projectsDirectoryPath,projectId);
      let sequelProjectDirectoryPath = FileSystemService.concatPath(projectsDirectoryPath, sequelProjectId);
      let sequelProjectTempFilePath = FileSystemService.concatPath(sequelProjectDirectoryPath, projectId) + '.json';
      let sequelProjectFilePath = FileSystemService.concatPath(sequelProjectDirectoryPath, sequelProjectId) + '.json';
      
      // copy source project and rename project file
      FileSystemService.copyDirectory(sourceProjectDirectoryPath, sequelProjectDirectoryPath);
      FileSystemService.rename(sequelProjectTempFilePath,sequelProjectFilePath);

      // update sequel project with specific project info
      this.updateSequelProject(sequelProjectId, name);

      // add project to bibisco db
      BibiscoDbConnectionService.getBibiscoDb().getCollection('projects')
        .insert({
          id: sequelProjectId,
          name: name
        });

      // save bibisco database
      BibiscoDbConnectionService.saveDatabase();

      LoggerService.info('Created sequel project ' + sequelProjectId + 
      ' (' +  name  + ') of project ' + projectId);

      return sequelProjectId;
    },

    updateSequelProject: function (sequelProjectId, sequelProjectName) {
      
      // load sequel project
      ProjectDbConnectionService.load(sequelProjectId);
      let projectdb = ProjectDbConnectionService.getProjectDb();

      // update project info
      let projectCollection = projectdb.getCollection('project');
      let projectInfo = projectCollection.get(1);
      projectInfo.id = sequelProjectId;
      projectInfo.name = sequelProjectName;
      projectInfo.bibiscoVersion = BibiscoPropertiesService.getProperty('version').split('-')[0];
      projectInfo.wordCountMode = 'hyphenated-contracted-possessive-1-word';
      projectInfo.lastScenetimeTag = '';
      projectInfo.wordsGoal = null;
      projectInfo.wordsPerDayGoal = null;
      projectInfo.deadline = null;
      CollectionUtilService.updateWithoutCommit(projectCollection, projectInfo);

      // update architecture
      this.cleanCollection(projectdb, 'architecture');
      let architectureCollection = projectdb.getCollection('architecture');
      CollectionUtilService.insertWithoutCommit(architectureCollection, {
        type: 'premise',
        text: ''
      });
      CollectionUtilService.insertWithoutCommit(architectureCollection, {
        type: 'fabula',
        text: ''
      });
      CollectionUtilService.insertWithoutCommit(architectureCollection, {
        type: 'setting',
        text: ''
      });
      CollectionUtilService.insertWithoutCommit(architectureCollection, {
        type: 'globalnotes',
        text: ''
      });

      // update strands, parts, chapters, scenes, wordswrittenperday, notes, backups
      this.cleanCollection(projectdb, 'strands');
      this.cleanCollection(projectdb, 'parts');
      this.cleanCollection(projectdb, 'chapters');
      this.cleanCollection(projectdb, 'scenes');
      this.cleanCollection(projectdb, 'wordswrittenperday');
      this.cleanCollection(projectdb, 'notes');
      this.cleanCollection(projectdb, 'backups');

      // save project database
      ProjectDbConnectionService.saveDatabase();
    },

    cleanCollection: function (projectdb, collectionName) {
      projectdb.removeCollection(collectionName);
      projectdb.addCollection(collectionName);
    }
  };
});

