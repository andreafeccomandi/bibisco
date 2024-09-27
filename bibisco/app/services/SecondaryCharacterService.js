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

angular.module('bibiscoApp').service('SecondaryCharacterService', function($injector, $rootScope, $timeout,
  ChapterService, CollectionUtilService, ImageService, LoggerService,  ProjectDbConnectionService) {
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
    insertWithoutCommit: function(secondarycharacter) {
      let images = [];
      secondarycharacter.images = images;
      CollectionUtilService.insertWithoutCommit(this.getCollection(), secondarycharacter);

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
      this.executeRemoveWithoutCommit(id);
      ProjectDbConnectionService.saveDatabase(); 
      // emit remove event
      $rootScope.$emit('DELETE_ELEMENT', {
        id: id,
        collection: 'secondarycharacters'
      });
    },
    executeRemoveWithoutCommit: function(id) {
      CollectionUtilService.removeWithoutCommit(this.getCollection(), id);
      $injector.get('GroupService').removeElementFromGroupsWithoutCommit('secondarycharacter', id);
    },
    setProfileImage: function (id, filename) {
      LoggerService.info('Set profile image file: ' + filename + ' for element with $loki='
        + id + ' in secondarycharacters');

      let secondarycharacter = this.getSecondaryCharacter(id);
      secondarycharacter.profileimage = filename;
      CollectionUtilService.update(this.getCollection(), secondarycharacter);
    },
    transformIntoMain: function(id) {
      let secondarycharacter = this.getSecondaryCharacter(id);

      // load MainCharacterService via $injector to avoid circular dependency
      let MainCharacterService = $injector.get('MainCharacterService');

      // create the cloned maincharacter
      let maincharacter = MainCharacterService.insertWithoutCommit({
        description: '',
        name: secondarycharacter.name
      });

      // populate maincharacter notes with secondarycharacter description
      maincharacter.notes.text = secondarycharacter.description;
      maincharacter.notes.words = secondarycharacter.words;
      maincharacter.notes.characters = secondarycharacter.characters;

      // populate maincharacter events and images
      maincharacter.events = secondarycharacter.events;
      maincharacter.images = secondarycharacter.images;
      maincharacter.profileimage = secondarycharacter.profileimage;
      MainCharacterService.updateWithoutCommit(maincharacter);

      // populate groups
      let GroupService = $injector.get('GroupService');
      let elementGroups = GroupService.getElementGroups('secondarycharacter', id);
      let groupids = [];
      for (let i = 0; i < elementGroups.length; i++) {
        groupids.push(elementGroups[i].$loki);        
      }
      GroupService.addElementToGroupsWithoutCommit('maincharacter', maincharacter.$loki, groupids);

      // update scene tags
      ChapterService.replaceCharacterInSceneTagsWithoutCommit('s_'+id, 'm_'+maincharacter.$loki);

      // remove secondary character
      this.executeRemoveWithoutCommit(id);

      // save database
      ProjectDbConnectionService.saveDatabase(); 
      
      // emit TRANSFORM SECONDARY CHARACTER event
      $rootScope.$emit('TRANSFORM_SECONDARY_CHARACTER', {
        secondarycharacterid: id,
        maincharacterid: maincharacter.$loki
      });
      
      LoggerService.info('Transformed secondary character with $loki='
        + id + ' into main character with $loki=' + maincharacter.$loki);

      return maincharacter;
    },
    update: function(secondarycharacter) {
      CollectionUtilService.update(this.getCollection(), secondarycharacter);
      // emit update event
      $rootScope.$emit('UPDATE_ELEMENT', {
        id: secondarycharacter.$loki,
        collection: 'secondarycharacters'
      });
    },
    updateLastSave: function(id, lastsave) {
      let secondarycharacter = this.getSecondaryCharacter(id);
      secondarycharacter.lastsave = lastsave;
      this.update(secondarycharacter);
    },
    updateWithoutCommit: function(secondarycharacter) {
      CollectionUtilService.updateWithoutCommit(this.getCollection(), secondarycharacter);
    }
  };
});
