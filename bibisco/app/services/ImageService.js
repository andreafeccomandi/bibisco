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

angular.module('bibiscoApp').service('ImageService', function (BibiscoPropertiesService,
  FileSystemService, LoggerService, ProjectService, UuidService) {
  'use strict';

  return {
    addImageToProject: function(imagepath) {
      
      let originalfilename = FileSystemService.basename(imagepath);
      let fileext = FileSystemService.extname(imagepath);
      let projectImagesDirectoryPath = this.getProjectImagesDirectoryPath();
      let uuid = UuidService.generateUuid();
      FileSystemService.copyFileToDirectory(imagepath, projectImagesDirectoryPath);

      let oldpath = FileSystemService.concatPath(projectImagesDirectoryPath, originalfilename);
      let newfilename = uuid + fileext;
      let newpath = FileSystemService.concatPath(projectImagesDirectoryPath, newfilename);
      
      FileSystemService.rename(oldpath, newpath);

      return newfilename;
    },

    deleteImage: function (filename) {
      let imagepath = FileSystemService.concatPath(this.getProjectImagesDirectoryPath(), filename);
      try {
        FileSystemService.deleteFile(imagepath);
      } catch(error) {
        LoggerService.error('Error deleting filename: ' + error);
      }
    },

    getProjectImagesDirectoryPath: function() {
      let projectId = ProjectService.getProjectInfo().id;
      let projectPath = FileSystemService.concatPath(BibiscoPropertiesService.getProperty(
        'projectsDirectory'), projectId);
      let projectImagesDirectoryPath = FileSystemService.concatPath(projectPath, 'images');

      return projectImagesDirectoryPath;
    },

    getImageFullPath: function (filename) {
      return FileSystemService.concatPath(this.getProjectImagesDirectoryPath(), filename);
    }
  };
});
