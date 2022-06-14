/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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
  component('notedetail', {
    templateUrl: 'components/notes/note-detail.html',
    controller: NoteDetailController
  });

function NoteDetailController($location, $routeParams, $window, NoteService) {

  var self = this;

  self.$onInit = function () {

    self.breadcrumbitems = [];
    self.note = self.getNote(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!self.note) {
      $window.history.back();
      return;
    }
    
    self.mode = $routeParams.mode;
    self.breadcrumbitems.push({
      label: 'common_notes_title',
      href: '/notes/params/focus=notes_' + self.note.$loki
    });
    self.breadcrumbitems.push({
      label: self.note.name
    });

    self.deleteforbidden = false;
  };

  self.changeStatus = function (status) {
    self.note.status = status;
    NoteService.update(self.note);
  };

  self.changeTitle = function () {
    $location.path('/notes/' + self.note.$loki + '/title');
  };

  self.delete = function () {
    NoteService.remove(self.note.$loki);
    $window.history.back();
  };

  self.edit = function () {
    $location.path('/notes/ ' + self.note.$loki + '/edit');
  };

  self.getNote = function (id) {
    return NoteService.getNote(id);
  };

  self.savefunction = function () {
    NoteService.update(self.note);
  };

  self.showimagesfunction = function () {
    $location.path('/notes/' + self.note.$loki + '/images');
  };

}
