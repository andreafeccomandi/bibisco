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

angular.module('bibiscoApp').service('FileSystemService', function(
  LoggerService) {
  'use strict';

  var remote = require('electron').remote;
  var fs = require('fs-extra');
  var path = require('path');
  var walkSync = require('walk-sync');
  var zip;

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
    concatPath: function(a, b) {
      return path.join(a, b);
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
      fs.unlinkSync(path);
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
    getZip: function() {
      if(!zip) {
        zip = remote.getGlobal('getzip')();
      }
      return zip;
    },
    isDirectory: function(path) {
      return fs.lstatSync(path).isDirectory();
    },
    rename: function(oldPath, newPath) {
      fs.renameSync(oldPath, newPath);
    },
    unzip: function(zippedFilePath, destinationFolder, callback) {
      return this.getZip().unzip(zippedFilePath, destinationFolder, callback);
    },
    writeFileSync: function(path, buffer) {
      fs.writeFileSync(path, buffer);
    },
    zipFolder: function(folderToZip, zippedFilePath, callback) {
      return this.getZip().zipFolder(folderToZip, zippedFilePath, callback);
    }
  };
});
