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
  component('noteaddimage', {
    templateUrl: 'components/notes/note-addimage.html',
    controller: NoteAddImageController
  });

function NoteAddImageController($routeParams, NoteService) {

  var self = this;

  self.$onInit = function() {

    let note = NoteService.getNote($routeParams.id);

    // breadcrumb
    self.breadcrumbnotes = [];
    self.breadcrumbnotes.push({
      label: 'notes',
      href: '/notes/params/focus=notes_' + note.$loki
    });
    self.breadcrumbnotes.push({
      label: note.name,
      href: '/notes/' + note.$loki + '/view'
    });
    self.breadcrumbnotes.push({
      label: 'jsp.projectFromScene.select.location.images',
      href: '/notes/' + note.$loki + '/images'
    });
    self.breadcrumbnotes.push({
      label: 'jsp.addImageForm.dialog.title'
    });

    self.exitpath = '/notes/' + note.$loki + '/images';
  };

  self.save = function(name, path) {
    NoteService.addImage($routeParams.id, name, path);
  };
}
