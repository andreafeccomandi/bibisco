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

angular.module('bibiscoApp').service('ItemService', function(
  CollectionUtilService, ImageService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  return {
    addImage: function (id, name, path) {
      let filename = ImageService.addImageToProject(path);
      LoggerService.info('Added image file: ' + filename + ' for element with $loki='
        + id + ' in items');

      let item = this.getItem(id);
      let images = item.images;
      images.push({
        name: name,
        filename: filename
      });
      item.images = images;
      CollectionUtilService.update(this.getCollection(), item);
    },
    deleteImage: function (id, filename) {

      // delete image file
      ImageService.deleteImage(filename);
      LoggerService.info('Deleted image file: ' + filename + ' for element with $loki='
        + id + ' in items');

      // delete reference
      let item = this.getItem(id);
      let images = item.images;
      let imageToRemovePosition;
      for (let i = 0; i < images.length; i++) {
        if (images[i].filename === filename) {
          imageToRemovePosition = i;
          break;
        }
      }
      images.splice(imageToRemovePosition, 1);
      item.images = images;
      CollectionUtilService.update(this.getCollection(), item);

      return item;
    },
    getCollection: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'items');
    },
    getDynamicView: function() {
      return CollectionUtilService.getDynamicViewSortedByPosition(
        this.getCollection(), 'all_items');
    },
    getItem: function(id) {
      return this.getCollection().get(id);
    },
    getItemsCount: function() {
      return this.getCollection().count();
    },
    getItems: function() {
      return this.getDynamicView().data();
    },
    insert: function(item) {
      let images = [];
      item.images = images;
      CollectionUtilService.insert(this.getCollection(), item);
    },
    move: function(sourceId, targetId) {
      return CollectionUtilService.move(this.getCollection(), sourceId, targetId,
        this.getDynamicView());
    },
    remove: function(id) {
      CollectionUtilService.remove(this.getCollection(), id);
    },
    update: function(item) {
      CollectionUtilService.update(this.getCollection(), item);
    }
  };
});
