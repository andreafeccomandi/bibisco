/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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
  component('interviewviewer', {
    templateUrl: 'components/characters/interview-viewer.html',
    controller: InterviewViewerController,
    bindings: {
      characters: '=',
      maincharacter: '<',
      nextelementlabel: '@',
      nextelementlink: '<',
      nextelementtooltip: '@?',
      previouselementlabel: '@',
      previouselementlink: '<',
      previouselementtooltip: '@?',
      type: '<',
      words: '='
    }
  });


function InterviewViewerController($injector, $location, RichTextEditorPreferencesService) {

  let self = this;

  self.$onInit = function() {
    self.fontclass = RichTextEditorPreferencesService.getFontClass();
    self.indentclass = RichTextEditorPreferencesService.getIndentClass();
    self.linespacingclass = RichTextEditorPreferencesService.getLinespacingClass();
    self.paragraphspacingclass = RichTextEditorPreferencesService.getParagraphspacingClass();

    let questions = self.maincharacter[self.type].questions;
    let characters = 0;
    let words = 0;
    for (let i = 0; i < questions.length; i++) {
      characters = characters + questions[i].characters;
      words = words + questions[i].words;
    }

    self.characters = characters;
    self.words = words;

    if (self.type === 'custom') {
      let CustomQuestionService = $injector.get('CustomQuestionService');
      self.customQuestions = CustomQuestionService.getCustomQuestions();
    }
  };
}
