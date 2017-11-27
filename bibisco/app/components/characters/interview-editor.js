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
  component('intervieweditor', {
    templateUrl: 'components/characters/interview-editor.html',
    controller: InterviewEditorController,
    bindings: {
      autosaveenabled: '=',
      content: '=',
      dirty: '=',
      maincharacter: '=',
      questionselected: '=',
      type: '<'
    }
  });


function InterviewEditorController(MainCharacterService, RichTextEditorPreferencesService) {

  var self = this;

  self.$onInit = function() {
    self.questionselected = 0;
    self.fontclass = RichTextEditorPreferencesService.getFontClass();
    self.indentclass = RichTextEditorPreferencesService.getIndentClass();
  };
}
