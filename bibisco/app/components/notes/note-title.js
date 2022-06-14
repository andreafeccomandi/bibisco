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
  component('notetitle', {
    templateUrl: 'components/notes/note-title.html',
    controller: NoteTitleController
  });

function NoteTitleController($routeParams, NoteService) {

  var self = this;

  self.$onInit = function() {

    // common bradcrumb root
    self.breadcrumbnotes = [];

    if ($routeParams.id !== undefined) {
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

      // edit breadcrumb notes
      self.breadcrumbnotes.push({
        label: note.name,
        href: '/notes/' + note.$loki + '/view'
      });
      self.breadcrumbnotes.push({
        label: 'note_change_name_title'
      });

      self.name = note.name;
      self.pageheadertitle = 'note_change_name_title';
      
    } else {

      self.breadcrumbnotes.push({
        label: 'common_notes_title',
        href: '/notes'
      });

      // create breadcrumb notes
      self.breadcrumbnotes.push({
        label: 'note_create_title'
      });
      self.name = null;
      self.pageheadertitle =
        'note_create_title';
    }
  };

  self.save = function(title) {
    if ($routeParams.id !== undefined) {
      let note = NoteService.getNote(parseInt($routeParams.id));
      note.name = title;
      NoteService.update(note);
    } else {
      NoteService.insert({
        description: '',
        name: title
      });
    }
  };
}
