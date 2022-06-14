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

angular.module('bibiscoApp').service('FileSystemService', function(
  LoggerService, MainProcessCallbackExecutorService) {
  'use strict';

  const ipc = require('electron').ipcRenderer;
  const fs = require('fs-extra');
  const path = require('path');
  const walkSync = require('walk-sync');

  return {
    basename: function(filepath) {
      return path.basename(filepath);
    },
    canWriteDirectory: function (directoryPath) {
      if (!directoryPath) {
        return false;
      }
      let tempDirectoryPath = path.join(directoryPath, 'temp__' + Date.now());
      let result = this.createDirectory(tempDirectoryPath);
      if (result) {
        this.deleteDirectory(tempDirectoryPath);
      }
      return result;
    },
    cleanDirectory: function(directoryPath) {
      this.deleteDirectory(directoryPath);
      this.createDirectory(directoryPath);
    },
    concatPath: function(a, b) {
      return path.join(a, b);
    },
    copyDirectory: function (sourceDirectoryPath, targetDirectoryPath) {
      fs.copySync(sourceDirectoryPath, targetDirectoryPath);
    },
    copyFileToDirectory: function(filePath, directoryPath) {
      let filename = path.basename(filePath);
      fs.copySync(filePath, path.join(directoryPath, filename));
    },
    createDirectory: function(path) {
      var result = true;
      // if the directory not exists I try to create it
      if (!fs.existsSync(path)) {
        try {
          fs.mkdirSync(path);
        } catch (err) {
          LoggerService.error('Error creating directory: ' + path + ' - ' +
            err);
          result = false;
        }
      }
      return result;
    },
    createStream: function() {
      fs.createStream();
    },
    deleteDirectory: function(path) {
      fs.removeSync(path);
    },
    deleteFile: function(path) {
      try {
        fs.unlinkSync(path);
        LoggerService.info('Deleted file: ' + path);
      } catch (err) {
        LoggerService.error('Error deleting file: ' + path + ' - ' + err);
      }
    },
    dirname: function (filepath) {
      return path.dirname(filepath);
    },
    exists: function(path) {
      return fs.existsSync(path);
    },
    extname: function (filepath) {
      return path.extname(filepath);
    },
    getFilesInDirectory: function(path) {
      return fs.readdirSync(path);
    },
    getFilesInDirectoryRecursively: function(path, filter) {
      return walkSync(path, filter);
    },
    getPathSeparator: function() {
      return path.sep;
    },
    isDirectory: function(path) {
      return fs.lstatSync(path).isDirectory();
    },
    readFile: function(path) {
      return fs.readFileSync(path);
    },
    rename: function(oldPath, newPath) {
      fs.renameSync(oldPath, newPath);
    },
    unzip: function(zippedFilePath, destinationFolder, callback) {
      let callbackId = MainProcessCallbackExecutorService.register(callback);
      ipc.send('unzip', {
        zippedFilePath: zippedFilePath,
        destinationFolder: destinationFolder,
        callbackId: callbackId
      });
    },
    writeBase64DataToFile: function(dataURL, filePath) {
      const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');
      fs.writeFile(filePath, base64Data, 'base64', function (err) {
        console.log(err);
      });
    },
    writeFileSync: function(path, buffer) {
      fs.writeFileSync(path, buffer);
    },
    zipFolder: function(folderToZip, zippedFilePath, callback) {
      let callbackId = MainProcessCallbackExecutorService.register(callback);
      ipc.send('zipFolder', {
        folderToZip: folderToZip,
        zippedFilePath: zippedFilePath,
        callbackId: callbackId
      });
    }
  };
});
