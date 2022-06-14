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
  component('noteaddimage', {
    templateUrl: 'components/notes/note-addimage.html',
    controller: NoteAddImageController
  });

function NoteAddImageController($routeParams, $window, NoteService) {

  var self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    let note = NoteService.getNote(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!note) {
      $window.history.back();
      return;
    }

    // breadcrumb
    self.breadcrumbitems.push({
      label: 'notes',
      href: '/notes/params/focus=notes_' + note.$loki
    });
    self.breadcrumbitems.push({
      label: note.name,
      href: '/notes/' + note.$loki + '/view'
    });
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.select.location.images',
      href: '/notes/' + note.$loki + '/images'
    });
    self.breadcrumbitems.push({
      label: 'jsp.addImageForm.dialog.title'
    });
  };

  self.save = function(name, path) {
    NoteService.addImage(parseInt($routeParams.id), name, path);
  };
}
