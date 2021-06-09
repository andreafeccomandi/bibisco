/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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

function NoteImagesController($location, $routeParams, NoteService) {

  var self = this;

  self.$onInit = function() {
    
    let note = NoteService.getNote($routeParams.id);
    self.backpath = '/notes/' + note.$loki + '/view';

    self.breadcrumbnotes = [];
    self.breadcrumbnotes.push({
      label: 'common_notes_title',
      href: '/notes/params/focus=notes_' + note.$loki
    });
    self.breadcrumbnotes.push({
      label: note.name,
      href: self.backpath
    });
    self.breadcrumbnotes.push({
      label: 'jsp.projectFromScene.select.location.images'
    });

    self.images = note.images;
    self.lastsave = note.lastsave;
    self.pageheadertitle = note.name;
  };

  self.delete = function(filename) {
    let note = NoteService.deleteImage($routeParams.id, filename);
    self.images = note.images;
  };

  self.insert = function() {
    $location.path('/notes/' + $routeParams.id + '/images/new');
  };
}
