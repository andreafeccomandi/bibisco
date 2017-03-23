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
  BibiscoDbService, BibiscoPropertiesService, ContextService,
  LoggerService, UuidService) {
  'use strict';

  var remote = require('electron').remote;
  var projectdbconnection = remote.getGlobal('projectdbconnection');
  var projectdb;

  return {
    create: function(name, language) {

      LoggerService.debug('Start ProjectService.create...');

      var projectId = UuidService.generateUuid();
      var projectPath = BibiscoPropertiesService.getProperty(
          'projectsDirectory') + ContextService.getFileSeparator() +
        projectId;
      projectdb = projectdbconnection.create(projectId, projectPath);

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
      projectdb.saveDatabase();

      // add project to bibisco db
      BibiscoDbService.getBibiscoDb().getCollection('projects').insert({
        id: projectId,
        name: name
      });

      // save bibisco database
      BibiscoDbService.saveDatabase();

      LoggerService.debug('End ProjectService.create...');
    },
    getProjectsCount: function() {
      return BibiscoDbService.getBibiscoDb().getCollection('projects').count();
    },
    getProjectInfo: function() {
      return projectdb.getCollection('project').get(1);
    },
    getProjects: function() {
      return BibiscoDbService.getBibiscoDb().getCollection('projects').addDynamicView(
        'all_projects').applySimpleSort('name').data();
    },
    load: function(id) {
      var projectPath = BibiscoPropertiesService.getProperty(
        'projectsDirectory') + ContextService.getFileSeparator() + id;
      projectdb = projectdbconnection.load(id, projectPath);
      LoggerService.debug('Loaded ' + projectdb);
    },
    saveDatabase: function(callback) {
      return projectdb.saveDatabase(callback);
    },
    getProjectDb: function() {
      return projectdb;
    }
  };
});
