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

angular.module('bibiscoApp').service('ImageService', function (BibiscoPropertiesService,
  FileSystemService, LoggerService, ProjectService, UuidService) {
  'use strict';

  return {
    addImageToProject: function (imagepath, callback) {

      let originalfilename = FileSystemService.basename(imagepath);
      let fileext = FileSystemService.extname(imagepath);
      let projectImagesDirectoryPath = this.getProjectImagesDirectoryPath();
      let uuid = UuidService.generateUuid();
      FileSystemService.copyFileToDirectory(imagepath, projectImagesDirectoryPath);
      
      let oldpath = FileSystemService.concatPath(projectImagesDirectoryPath, originalfilename);
      let newfilename = uuid + fileext;
      let newpath = FileSystemService.concatPath(projectImagesDirectoryPath, newfilename);

      FileSystemService.rename(oldpath, newpath);
      if (callback) {
        callback(newfilename);
      }

      return newfilename;
    },

    calculateImageStyle: function(position, widthperc) {
      let style = 'display: block; ';
      style += 'width: ' + widthperc + '%; ';
      if (position && position === 'left') {
        style += 'margin: 0 auto 0 0;';
      } else if (position && position === 'right') {
        style += 'margin: 0 0 0 auto;';
      } else {
        style += 'margin: 0 auto;';
      }
  
      return style;
    },

    deleteImage: function (filename) {
      let imagepath = FileSystemService.concatPath(this.getProjectImagesDirectoryPath(), filename);
      try {
        FileSystemService.deleteFile(imagepath);
      } catch (error) {
        LoggerService.error('Error deleting filename: ' + error);
      }
    },

    getProjectImagesDirectoryPath: function () {
      let projectId = ProjectService.getProjectInfo().id;
      let projectPath = FileSystemService.concatPath(BibiscoPropertiesService.getProperty(
        'projectsDirectory'), projectId);
      let projectImagesDirectoryPath = FileSystemService.concatPath(projectPath, 'images');

      return projectImagesDirectoryPath;
    },

    getImageFullPath: function (filename) {
      return FileSystemService.concatPath(this.getProjectImagesDirectoryPath(), filename);
    },

    getImageFromUrl: function (imageURL, callback) {
      let img = new Image();
      img.onload = function () {
        try {
          callback(img);
        } catch (error) {
          LoggerService.error('ImageService > getImageFromUrl: error creating image file: ' + error);
        }
      };
      img.onerror = function () { LoggerService.error('image load failed: '+imageURL); };
      img.crossOrigin = 'anonymous';
      img.src = imageURL;
    },

    getImagesFromHtml: function(inputHtml, callback) {

      let result = [];
      let imagesAttrsFromHtml = [];

      // create a temporary element to parse the HTML code
      let tempElement = document.createElement('div');
      tempElement.innerHTML = inputHtml;
  
      // select all <img> elements with a "filename" attribute set
      let images = tempElement.querySelectorAll('img[filename]');
      if (images.length === 0) {
        callback(result);
      } else {
        for (let i = 0; i < images.length; i++) {
          // check if the image has a "filename" attribute
          let filename = images[i].getAttribute('filename');
          if (filename && filename !== 'IMG_PLACEHOLDER') {
          
            // width percent
            let widthpercent = 100;
            try {
              widthpercent = parseInt(images[i].getAttribute('widthperc'));
            } catch (error) {
              LoggerService.error('Error getting image widthperc for image ' + filename); 
            }
          
            // widthheight ratio attribute
            let widthheightratioattr;
            try {
              widthheightratioattr = parseFloat(images[i].getAttribute('widthheightratio'));
            } catch (error) {
              LoggerService.error('Error getting image widthheightratio for image ' + filename); 
            }

            // alignment
            let alignment = images[i].getAttribute('position');
            if (!alignment) {
              alignment = 'center';
            }

            imagesAttrsFromHtml.push({
              alignment: alignment,
              filename: filename,
              fullpath: this.getImageFullPath(filename),
              widthheightratio: widthheightratioattr,
              widthpercent: widthpercent
            });
          }
        }
      }

      let imagesToLoad = imagesAttrsFromHtml.length;
      for (let i = 0; i < imagesAttrsFromHtml.length; i++) {
        let img = new Image();
        img.src = imagesAttrsFromHtml[i].fullpath;
        img.crossOrigin = 'anonymous';
        img.onload = function() {

          let widthheightratio;
          if (imagesAttrsFromHtml[i].widthheightratio) {
            widthheightratio = imagesAttrsFromHtml[i].widthheightratio;
          } else {
            try {
              widthheightratio = parseFloat(img.width / img.height);
            } catch (error) {
              LoggerService.error('Error getting image widthheightratio for image ' + filename + '. Set widthheightratio to 1'); 
              widthheightratio = 1;
            }
          }           
          
          result[imagesAttrsFromHtml[i].filename] = {
            alignment: imagesAttrsFromHtml[i].alignment,
            img: img, 
            widthpercent: imagesAttrsFromHtml[i].widthpercent,
            widthheightratio: widthheightratio
          };
          imagesToLoad--;
          if (imagesToLoad <= 0) {
            callback(result);
          } 
        };
        img.onerror = function() { 
          LoggerService.error('Error loading image: ' + imagesSrcs[i].fullpath); 
        }; 
      }
    },

    textContainsImages: function(inputHtml) {
      // create a temporary element to parse the HTML code
      let tempElement = document.createElement('div');
      tempElement.innerHTML = inputHtml;

      // select all <img> elements with a "filename" attribute set
      let images = tempElement.querySelectorAll('img[filename]');

      if (images.length > 0) {
        return true;
      } else {
        return false;
      }
    },

    updateAllImageSrcToLocalPath: function(inputHtml) {

      // create a temporary element to parse the HTML code
      let tempElement = document.createElement('div');
      tempElement.innerHTML = inputHtml;
  
      // select all <img> elements with a "filename" attribute set
      let images = tempElement.querySelectorAll('img[filename]');
  
      // modify the "src" attributes of the images
      for (let i = 0; i < images.length; i++) {
        // check if the image has a "filename" attribute
        let filename = images[i].getAttribute('filename');
        if (filename && filename !== 'IMG_PLACEHOLDER') {
          // update src to local path
          images[i].src = this.getImageFullPath(filename);
        }
      }
  
      // Return the modified HTML code
      return tempElement.innerHTML;
    }
  };
});
