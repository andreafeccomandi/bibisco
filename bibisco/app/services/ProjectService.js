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
  FileSystemService, LoggerService, ProjectDbConnectionService, UuidService,
  ZipService
) {
  'use strict';

  return {
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
      BibiscoDbConnectionService.getBibiscoDb().getCollection('projects')
        .insert({
          id: projectId,
          name: name
        });

      // save bibisco database
      BibiscoDbConnectionService.saveDatabase();

      LoggerService.debug('End ProjectService.create...');
    },
    delete: function(id) {
      BibiscoDbConnectionService.getBibiscoDb().getCollection('projects')
        .findAndRemove({
          id: id
        });
      let projectPath = ProjectDbConnectionService.calculateProjectPath(
        id);
      FileSystemService.deleteDirectory(projectPath);
    },
    import: function() {
      LoggerService.debug('***** Start ProjectService.import...');
      let projectId = '757daa90-101f-11e7-bba8-070c674f3395';

      ZipService.unzip('/Users/andreafeccomandi/Documents/export/' +
        projectId + '.zip', '/Users/andreafeccomandi/Documents/export/' +
        projectId
      );
      LoggerService.debug('***** End ProjectService.import...');
    },
    export: function() {
      LoggerService.debug('***** Start ProjectService.export...');
      let projectId = '757daa90-101f-11e7-bba8-070c674f3395';
      let projectPath = ProjectDbConnectionService.calculateProjectPath(
        projectId);
      ZipService.zipFolder(projectPath,
        '/Users/andreafeccomandi/Documents/export/' + projectId +
        '.zip');
      LoggerService.debug('***** End ProjectService.export...');
    },
    getProjectsCount: function() {
      return BibiscoDbConnectionService.getBibiscoDb().getCollection(
        'projects').count();
    },
    getProjectInfo: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'project').get(
        1);
    },
    getProjects: function() {
      return BibiscoDbConnectionService.getBibiscoDb().getCollection(
        'projects').addDynamicView(
        'all_projects').applySimpleSort('name').data();
    }
  };
});
