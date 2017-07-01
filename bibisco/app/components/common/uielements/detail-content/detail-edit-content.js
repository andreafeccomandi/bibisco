/*
 * Copyright (C) 2014-2017 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */
angular.
module('bibiscoApp').
component('detaileditcontent', {
  templateUrl: 'components/common/uielements/detail-content/detail-edit-content.html',
  controller: DetailEditContentController,
  bindings: {
    content: '@',
    contentstyle: '@'
  }
});


function DetailEditContentController($document, LoggerService) {

  LoggerService.debug('Start DetailEditContentController...');

  var self = this;
  self.editor = null;

  self.editorCreated = function(editor) {
    console.log('Editor creato!');
    self.editor = editor;
  }

  self.undo = function() {
    self.editor.history.undo();
  }

  self.redo = function() {
    self.editor.history.redo();
  }

  self.copy = function() {
    $document[0].execCommand('copy');
  }

  self.cut = function() {
    $document[0].execCommand('cut');
  }

  self.paste = function() {
    $document[0].execCommand('paste');
  }

  self.leftguillemet = function() {
    $document[0].execCommand('insertText', false, '«');
  }

  self.rightguillemet = function() {
    $document[0].execCommand('insertText', false, '»');
  }

  self.emdash = function() {
    $document[0].execCommand('insertText', false, '—');
  }

  LoggerService.debug('End DetailEditContentController...');
}
