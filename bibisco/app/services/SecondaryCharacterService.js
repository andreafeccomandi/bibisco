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

angular.module('bibiscoApp').service('SecondaryCharacterService', function(
  CollectionUtilService, ImageService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  var collection = ProjectDbConnectionService.getProjectDb().getCollection(
    'secondarycharacters');
  var dynamicView = CollectionUtilService.getDynamicViewSortedByPosition(
    collection, 'all_secondarycharacters');

  return {
    addImage: function (id, name, path) {
      let filename = ImageService.addImageToProject(path);
      LoggerService.info('Added image file: ' + filename + ' for element with $loki='
        + id + ' in secondarycharacters');

      let secondarycharacter = this.getSecondaryCharacter(id);
      let images = secondarycharacter.images;
      images.push({
        name: name,
        filename: filename
      });
      secondarycharacter.images = images;
      CollectionUtilService.update(collection, secondarycharacter);
    },
    deleteImage: function (id, filename) {

      // delete image file
      ImageService.deleteImage(filename);
      LoggerService.info('Deleted image file: ' + filename + ' for element with $loki='
        + id + ' in secondarycharacters');

      // delete reference
      let secondarycharacter = this.getSecondaryCharacter(id);
      let images = secondarycharacter.images;
      let imageToRemovePosition;
      for (let i = 0; i < images.length; i++) {
        if (images[i].filename === filename) {
          imageToRemovePosition = i;
          break;
        }
      }
      images.splice(imageToRemovePosition, 1);
      secondarycharacter.images = images;
      CollectionUtilService.update(collection, secondarycharacter);

      return secondarycharacter;
    },
    getSecondaryCharacter: function(id) {
      return collection.get(id);
    },
    getSecondaryCharactersCount: function() {
      return collection.count();
    },
    getSecondaryCharacters: function() {
      return dynamicView.data();
    },
    insert: function(secondarycharacter) {
      let images = [];
      secondarycharacter.images = images;
      CollectionUtilService.insert(collection, secondarycharacter);
    },
    move: function(sourceId, targetId) {
      return CollectionUtilService.move(collection, sourceId, targetId,
        dynamicView);
    },
    remove: function(id) {
      CollectionUtilService.remove(collection, id);
    },
    update: function(secondarycharacter) {
      CollectionUtilService.update(collection, secondarycharacter);
    }
  };
});
