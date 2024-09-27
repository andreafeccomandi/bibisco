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

angular.module('bibiscoApp').service('ContextService', function(FileSystemService) {
  'use strict';

  const ipc = require('electron').ipcRenderer;
  const path = require('path');
  let contextInfo = ipc.sendSync('getcontextinfo');
  let appPath = contextInfo.appPath; 
  let documentsPath = contextInfo.documentsPath;
  let downloadsPath = contextInfo.downloadsPath;
  let userDataPath = contextInfo.userDataPath;

  let os = contextInfo.os;
  let lastError;

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
    getDocumentsDirectoryPath() {
      return documentsPath;
    },
    getDownloadsDirectoryPath() {
      return downloadsPath;
    },
    getTempDirectoryPath() {
      return path.join(userDataPath, 'temp');
    },
    setLastError: function(error) {
      lastError = error;
    }
  };
});
