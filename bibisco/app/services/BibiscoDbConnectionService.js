/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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

angular.module('bibiscoApp').service('BibiscoDbConnectionService', function (ContextService, FileSystemService, LoggerService) {
  'use strict';

  const {app} = require('electron');
  let path = require('path');
  let loki = require('lokijs');
  let LokiFsSyncAdapter = require('./adapters/lokijs/loki-fs-sync-adapter.js');
  let bibiscodb;

  return {
    getBibiscoDb: function() {
      if (!bibiscodb) {
        let bibiscodbconnection = this.initBibiscoDb();
        bibiscodb = bibiscodbconnection.load();
      }
      return bibiscodb;
    },
    initBibiscoDb: function() {
      let bibiscodbpath = path.join(ContextService.getUserDataPath(), 'bibisco.json');
      let bibiscoDbExists = FileSystemService.exists(bibiscodbpath);
      if (bibiscoDbExists) {
        LoggerService.debug('bibisco db exists at: ' + bibiscodbpath);
      } else {
        LoggerService.debug('Creating bibisco db at: ' + bibiscodbpath);
        let cleanbibiscodbpath = path.join(__dirname, path.join('db', 'bibisco.json'));
        FileSystemService.copyFileToDirectory(cleanbibiscodbpath, ContextService.getUserDataPath());
      }

      return {
        // add function to load bibisco db
        load: function () {
          var bibiscodb = new loki(bibiscodbpath, {
            adapter: new LokiFsSyncAdapter()
          });
          bibiscodb.loadDatabase({}, function () {
            LoggerService.debug('bibisco.json db loaded');
          });
          return bibiscodb;
        }
      };
    },
    saveDatabase: function(callback) {
      return this.getBibiscoDb().saveDatabase(callback);
    },
  };
});
