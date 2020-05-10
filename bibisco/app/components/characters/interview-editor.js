/*
 * Copyright (C) 2014-2020 Andrea Feccomandi
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
  component('intervieweditor', {
    templateUrl: 'components/characters/interview-editor.html',
    controller: InterviewEditorController,
    bindings: {
      autosaveenabled: '=',
      characters: '=',
      content: '=',
      maincharacter: '=',
      questionselected: '=',
      type: '<',
      words: '='
    }
  });


function InterviewEditorController(MainCharacterService, RichTextEditorPreferencesService) {

  var self = this;

  self.$onInit = function() {
    self.fontclass = RichTextEditorPreferencesService.getFontClass();
    self.indentclass = RichTextEditorPreferencesService.getIndentClass();
  };
}
