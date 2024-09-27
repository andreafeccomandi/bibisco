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
angular.
  module('bibiscoApp').
  component('notes', {
    templateUrl: 'components/notes/notes.html',
    controller: NotesController,
    bindings: {

    }
  });

function NotesController($location, $rootScope, $routeParams, $scope,
  CardUtilService, NoteService, SupporterEditionChecker) {

  var self = this;

  self.$onInit = function() {
    
    // show menu note
    $rootScope.$emit('SHOW_PAGE', {
      note: 'notes'
    });
    
    self.cardgriditems = this.getCardGridItems();
    
    // hotkeys
    self.hotkeys = ['ctrl+n', 'command+n'];
  };

  self.notesPresent = function() {
    return NoteService.getNotesCount() > 0;
  };

  self.create = function() {
    SupporterEditionChecker.filterAction(function () {
      $location.path('/notes/new');
    });
  };

  self.getCardGridItems = function () {
    let cardgriditems = null;
    if (NoteService.getNotesCount() > 0) {
      let notes = NoteService.getNotes();
      cardgriditems = [];
      for (let i = 0; i < notes.length; i++) {
        cardgriditems.push({
          id: notes[i].$loki,
          noimageicon: 'thumb-tack',
          position: notes[i].position,
          status: notes[i].status,
          title: notes[i].name
        });
      }
    }
    return cardgriditems;
  };

  self.move = function(draggedObjectId, destinationObjectId) {
    NoteService.move(draggedObjectId, destinationObjectId);
    self.cardgriditems = this.getCardGridItems();
    $scope.$apply();
  };

  self.select = function(id) {
    SupporterEditionChecker.filterAction(function() {
      $location.path('/notes/' + id + '/default');
    });
  };
}
