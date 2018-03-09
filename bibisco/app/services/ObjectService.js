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

angular.module('bibiscoApp').service('ObjectService', function(
  CollectionUtilService, ImageService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  return {
    addImage: function (id, name, path) {
      let filename = ImageService.addImageToProject(path);
      LoggerService.info('Added image file: ' + filename + ' for element with $loki='
        + id + ' in objects');

      let object = this.getObject(id);
      let images = object.images;
      images.push({
        name: name,
        filename: filename
      });
      object.images = images;
      CollectionUtilService.update(this.getCollection(), object);
    },
    deleteImage: function (id, filename) {

      // delete image file
      ImageService.deleteImage(filename);
      LoggerService.info('Deleted image file: ' + filename + ' for element with $loki='
        + id + ' in objects');

      // delete reference
      let object = this.getObject(id);
      let images = object.images;
      let imageToRemovePosition;
      for (let i = 0; i < images.length; i++) {
        if (images[i].filename === filename) {
          imageToRemovePosition = i;
          break;
        }
      }
      images.splice(imageToRemovePosition, 1);
      object.images = images;
      CollectionUtilService.update(this.getCollection(), object);

      return object;
    },
    getCollection: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'objects');
    },
    getDynamicView: function() {
      return CollectionUtilService.getDynamicViewSortedByPosition(
        this.getCollection(), 'all_objects');
    },
    getObject: function(id) {
      return this.getCollection().get(id);
    },
    getObjectsCount: function() {
      return this.getCollection().count();
    },
    getObjects: function() {
      return this.getDynamicView().data();
    },
    insert: function(object) {
      let images = [];
      object.images = images;
      CollectionUtilService.insert(this.getCollection(), object);
    },
    move: function(sourceId, targetId) {
      return CollectionUtilService.move(this.getCollection(), sourceId, targetId,
        this.getDynamicView());
    },
    remove: function(id) {
      CollectionUtilService.remove(this.getCollection(), id);
    },
    update: function(object) {
      CollectionUtilService.update(this.getCollection(), object);
    }
  };
});
