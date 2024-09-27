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

angular.module('bibiscoApp').service('NoteService', function($rootScope,
  CollectionUtilService, ImageService, LoggerService, ProjectDbConnectionService) {
  'use strict';

  return {
    addImage: function (id, name, path) {
      let filename = ImageService.addImageToProject(path);
      LoggerService.info('Added image file: ' + filename + ' for element with $loki='
        + id + ' in notes');

      let note = this.getNote(id);
      let images = note.images;
      images.push({
        name: name,
        filename: filename
      });
      note.images = images;
      CollectionUtilService.update(this.getCollection(), note);
    },
    deleteImage: function (id, filename) {

      // delete image file
      ImageService.deleteImage(filename);
      LoggerService.info('Deleted image file: ' + filename + ' for element with $loki='
        + id + ' in notes');

      // delete reference
      let note = this.getNote(id);
      let images = note.images;
      let imageToRemovePosition;
      for (let i = 0; i < images.length; i++) {
        if (images[i].filename === filename) {
          imageToRemovePosition = i;
          break;
        }
      }
      images.splice(imageToRemovePosition, 1);
      note.images = images;
      CollectionUtilService.update(this.getCollection(), note);

      return note;
    },
    getCollection: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'notes');
    },
    getNote: function(id) {
      return this.getCollection().get(id);
    },
    getNotesCount: function() {
      return this.getNotes().length;
    },
    getNotes: function() {
      return CollectionUtilService.getDataSortedByPosition(this.getCollection());
    },
    insert: function(note) {
      let images = [];
      note.images = images;
      CollectionUtilService.insert(this.getCollection(), note);

      // emit insert event
      $rootScope.$emit('INSERT_ELEMENT', {
        id: note.$loki,
        collection: 'notes'
      });
    },
    move: function(sourceId, targetId) {
      CollectionUtilService.move(this.getCollection(), sourceId, targetId);
      // emit move event
      $rootScope.$emit('MOVE_ELEMENT', {
        id: sourceId,
        collection: 'notes'
      });
    },
    remove: function(id) {
      CollectionUtilService.remove(this.getCollection(), id);
      // emit remove event
      $rootScope.$emit('DELETE_ELEMENT', {
        id: id,
        collection: 'notes'
      });
    },
    update: function(note) {
      CollectionUtilService.update(this.getCollection(), note);
      // emit update event
      $rootScope.$emit('UPDATE_ELEMENT', {
        id: note.$loki,
        collection: 'notes'
      });
    },
    updateWithoutCommit: function(note) {
      CollectionUtilService.updateWithoutCommit(this.getCollection(), note);
    }
  };
});
