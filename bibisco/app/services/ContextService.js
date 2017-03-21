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

angular.module('bibiscoApp').service('ContextService', function() {
  'use strict';

  var remote = require('electron').remote;
  var os = remote.getGlobal('os');
  var lastError;

  return {
    getOs: function() {
      return os;
    },
    getFileSeparator: function() {
      if (os == 'win32') {
        return '\\';
      } else {
        return '/';
      }
    },
    getLastError() {
      return lastError;
    },
    setLastError: function(error) {
      lastError = error;
    }
  }
});
