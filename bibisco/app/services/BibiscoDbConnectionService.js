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

angular.module('bibiscoApp').service('BibiscoDbConnectionService', function(LoggerService) {
  'use strict';

  var remote = require('electron').remote;
  var bibiscodbconnection = remote.getGlobal('bibiscodbconnection');
  var bibiscodb = bibiscodbconnection.load();

  return {
    saveDatabase: function(callback) {
      return bibiscodb.saveDatabase(callback);
    },
    getBibiscoDb: function() {
      return bibiscodb;
    }
  };
});
