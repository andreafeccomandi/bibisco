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
  component('noteimages', {
    templateUrl: 'components/notes/note-images.html',
    controller: NoteImagesController
  });

function NoteImagesController($location, $routeParams, $window, NoteService) {

  var self = this;

  self.$onInit = function() {
    
    self.breadcrumbnotes = [];
    let note = NoteService.getNote(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!note) {
      $window.history.back();
      return;
    }

    self.breadcrumbnotes.push({
      label: 'common_notes_title',
      href: '/notes/params/focus=notes_' + note.$loki
    });
    self.breadcrumbnotes.push({
      label: note.name,
      href: '/notes/' + note.$loki + '/view'
    });
    self.breadcrumbnotes.push({
      label: 'jsp.projectFromScene.select.location.images'
    });

    self.images = note.images;
    self.lastsave = note.lastsave;
    self.pageheadertitle = note.name;
  };

  self.delete = function(filename) {
    let note = NoteService.deleteImage(parseInt($routeParams.id), filename);
    self.images = note.images;
  };

  self.insert = function() {
    $location.path('/notes/' + $routeParams.id + '/images/new');
  };
}
