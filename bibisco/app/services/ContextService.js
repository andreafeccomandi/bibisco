/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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

angular.module('bibiscoApp').service('ContextService', function() {
  'use strict';

  const ipc = require('electron').ipcRenderer;
  let contextInfo = ipc.sendSync('getcontextinfo');
  var appPath = contextInfo.appPath; 
  let userDataPath = contextInfo.userDataPath;
  var os = contextInfo.os;
  var path = require('path');
  var lastError;

  return {
    getAppPath: function() {
      return appPath;
    },
    getUserDataPath: function() {
      return userDataPath;
    },
    getLastError() {
      return lastError;
    },
    getOs: function() {
      return os;
    },
    getDictionaryDirectoryPath() {
      return path.join(userDataPath, 'bibiscoDictionaries');
    },
    getTempDirectoryPath() {
      return path.join(userDataPath, 'temp');
    },
    setLastError: function(error) {
      lastError = error;
    }
  };
});
