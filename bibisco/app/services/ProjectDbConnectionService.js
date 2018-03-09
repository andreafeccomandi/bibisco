/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  var projectdbconnection;
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
      projectdb = this.getProjectDbConnection().create(id, projectPath);
      LoggerService.debug('Created ' + projectdb);
    },
    getProjectDbConnection: function() {
      if (!projectdbconnection) {
        projectdbconnection = remote.getGlobal('getprojectdbconnection')();
      }
      return projectdbconnection;
    },
    load: function(id) {
      var projectPath = this.calculateProjectPath(id);
      projectdb = this.getProjectDbConnection().load(id, projectPath);
      LoggerService.debug('Loaded ' + projectdb);
    },
    open: function(dbName, dbPath) {
      return this.getProjectDbConnection().load(dbName, dbPath);
    },
    saveDatabase: function(callback) {
      return projectdb.saveDatabase(callback);
    },
    getProjectDb: function() {
      return projectdb;
    }
  };
});
