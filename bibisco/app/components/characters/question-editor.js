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
  component('questioneditor', {
    templateUrl: 'components/characters/question-editor.html',
    controller: QuestionEditorController,
    bindings: {
      autosaveenabled: '=',
      characters: '=',
      dirty: '=',
      maincharacter: '=',
      questionselected: '<',
      type: '<',
      words: '='
    }
  });

function QuestionEditorController() {

  var self = this;

  self.$onInit = function() {
    self.updateContent();
  };

  self.$onChanges = function (changesObj) {
    if (changesObj.questionselected) {
      let questions = self.maincharacter[self.type].questions;
      questions[changesObj.questionselected.previousValue] = self.content;
      self.maincharacter[self.type].questions = questions;
      self.updateContent();
    }
  };

  self.updateContent = function() {
    let question = self.maincharacter[self.type].questions[self.questionselected];

    if (question === '') {
      question = ' ';
    }
    self.content= question;
  };
}
