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

angular.module('bibiscoApp').service('ProjectDbConnectionService', function(
  BibiscoPropertiesService, ContextService, FileSystemService,
  LoggerService) {
  'use strict';

  var remote = require('electron').remote;
  var projectdbconnection = remote.getGlobal('projectdbconnection');
  var projectdb;

  return {
    calculateProjectPath: function(id) {
      return FileSystemService.concatPath(BibiscoPropertiesService.getProperty(
        'projectsDirectory'), id);
    },
    close: function(callback) {
      return projectdb.close(callback);
    },
    create: function(id) {
      var projectPath = this.calculateProjectPath(id);
      projectdb = projectdbconnection.create(id, projectPath);
      LoggerService.debug('Created ' + projectdb);
    },
    load: function(id) {
      var projectPath = this.calculateProjectPath(id);
      projectdb = projectdbconnection.load(id, projectPath);
      LoggerService.debug('Loaded ' + projectdb);
    },
    open: function(dbName, dbPath) {
      return projectdbconnection.load(dbName, dbPath);
    },
    saveDatabase: function(callback) {
      return projectdb.saveDatabase(callback);
    },
    getProjectDb: function() {
      return projectdb;
    }
  };
});
