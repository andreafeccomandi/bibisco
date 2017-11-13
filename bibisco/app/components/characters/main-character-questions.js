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
  component('maincharacterquestions', {
    templateUrl: 'components/characters/main-character-questions.html',
    controller: MaincharacterQuestionsController,
    bindings: {
      autosaveenabled: '=',
      content: '=',
      dirty: '=',
      editmode: '=',
      freetext: '=',
      maincharacterid: '<',
      type: '<'
    }
  });


function MaincharacterQuestionsController(MainCharacterService, RichTextEditorPreferencesService) {

  var self = this;

  self.$onInit = function() {
    let maincharacter = MainCharacterService.getMainCharacter(self.maincharacterid);
    self.questions = maincharacter[self.type].questions;
    self.fontclass = RichTextEditorPreferencesService.getFontClass();
    self.indentclass = RichTextEditorPreferencesService.getIndentClass();
  };

  self.enableeditmode = function() {
    self.editmode = true;
  };
}
