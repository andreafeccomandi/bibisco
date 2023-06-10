/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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

angular.module('bibiscoApp').service('SecondaryCharacterService', function($injector, $rootScope,
  CollectionUtilService, ImageService, LoggerService, ProjectDbConnectionService) {
  'use strict';

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
      CollectionUtilService.update(this.getCollection(), secondarycharacter);
      return filename;
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

      // delete profile image reference
      if (secondarycharacter.profileimage === filename) {
        secondarycharacter.profileimage = null;
      }

      CollectionUtilService.update(this.getCollection(), secondarycharacter);

      return secondarycharacter;
    },
    getCollection: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'secondarycharacters');
    },
    getSecondaryCharacter: function(id) {
      return this.getCollection().get(id);
    },
    getSecondaryCharactersCount: function() {
      return this.getSecondaryCharacters().length;
    },
    getSecondaryCharacters: function() {
      return CollectionUtilService.getDataSortedByPosition(this.getCollection());
    },
    insert: function(secondarycharacter) {
      let images = [];
      secondarycharacter.images = images;
      CollectionUtilService.insert(this.getCollection(), secondarycharacter);

      // emit insert event
      $rootScope.$emit('INSERT_ELEMENT', {
        id: secondarycharacter.$loki,
        collection: 'secondarycharacters'
      });

      return secondarycharacter;
    },
    move: function(sourceId, targetId) {
      CollectionUtilService.move(this.getCollection(), sourceId, targetId);
      // emit move event
      $rootScope.$emit('MOVE_ELEMENT', {
        id: sourceId,
        collection: 'secondarycharacters'
      });
    },
    remove: function(id) {
      CollectionUtilService.removeWithoutCommit(this.getCollection(), id);
      $injector.get('GroupService').removeElementFromGroupsWithoutCommit('secondarycharacter', id);
      ProjectDbConnectionService.saveDatabase(); 
      // emit remove event
      $rootScope.$emit('DELETE_ELEMENT', {
        id: id,
        collection: 'secondarycharacters'
      });
    },
    setProfileImage: function (id, filename) {
      LoggerService.info('Set profile image file: ' + filename + ' for element with $loki='
        + id + ' in secondarycharacters');

      let secondarycharacter = this.getSecondaryCharacter(id);
      secondarycharacter.profileimage = filename;
      CollectionUtilService.update(this.getCollection(), secondarycharacter);
    },
    update: function(secondarycharacter) {
      CollectionUtilService.update(this.getCollection(), secondarycharacter);
      // emit update event
      $rootScope.$emit('UPDATE_ELEMENT', {
        id: secondarycharacter.$loki,
        collection: 'secondarycharacters'
      });
    }
  };
});
