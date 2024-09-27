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

angular.module('bibiscoApp').service('ObjectService', function($rootScope,
  CollectionUtilService, GroupService, ImageService, LoggerService, ProjectDbConnectionService) {
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
      
      return filename;
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

      // delete profile image reference
      if (object.profileimage === filename) {
        object.profileimage = null;
      }

      CollectionUtilService.update(this.getCollection(), object);

      return object;
    },
    getCollection: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'objects');
    },
    getObject: function(id) {
      return this.getCollection().get(id);
    },
    getObjectsCount: function() {
      return this.getObjects().length;
    },
    getObjects: function() {
      return CollectionUtilService.getDataSortedByPosition(this.getCollection());
    },
    insert: function(object) {
      let images = [];
      object.images = images;
      CollectionUtilService.insert(this.getCollection(), object);

      // emit insert event
      $rootScope.$emit('INSERT_ELEMENT', {
        id: object.$loki,
        collection: 'objects'
      });

      return object;
    },
    move: function(sourceId, targetId) {
      CollectionUtilService.move(this.getCollection(), sourceId, targetId);
      // emit move event
      $rootScope.$emit('MOVE_ELEMENT', {
        id: sourceId,
        collection: 'objects'
      });
    },
    remove: function(id) {
      CollectionUtilService.removeWithoutCommit(this.getCollection(), id);
      GroupService.removeElementFromGroupsWithoutCommit('object', id);
      ProjectDbConnectionService.saveDatabase(); 
      // emit remove event
      $rootScope.$emit('DELETE_ELEMENT', {
        id: id,
        collection: 'objects'
      });
    },
    setProfileImage: function (id, filename) {
      LoggerService.info('Set profile image file: ' + filename + ' for element with $loki='
        + id + ' in objects');

      let object = this.getObject(id);
      object.profileimage = filename;
      CollectionUtilService.update(this.getCollection(), object);
    },
    update: function(object) {
      CollectionUtilService.update(this.getCollection(), object);
      // emit update event
      $rootScope.$emit('UPDATE_ELEMENT', {
        id: object.$loki,
        collection: 'objects'
      });
    },
    updateLastSave: function(id, lastsave) {
      let object = this.getObject(id);
      object.lastsave = lastsave;
      this.update(object);
    },
    updateWithoutCommit: function(object) {
      CollectionUtilService.updateWithoutCommit(this.getCollection(), object);
    }
  };
});
