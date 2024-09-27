/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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
  component('questionselect', {
    templateUrl: 'components/characters/question-select.html',
    controller: QuestionSelectController,
    bindings: {
      questioncount: '<',
      questionselected: '=',
      questionselectedchanged: '<',
      type: '<'
    }
  });

function QuestionSelectController($injector, $translate) {

  let self = this;

  self.$onInit = function() {
    self.selectedItem;
    self.selectItems = [];

    if (self.type === 'custom') {
      let CustomQuestionService = $injector.get('CustomQuestionService');
      self.customQuestions = CustomQuestionService.getCustomQuestions();
    }

    for (let i = 0; i < self.questioncount; i++) {
      let questionItem = self.createQuestionItem(i);
      self.selectItems.push(questionItem);
      if (i === self.questionselected) {
        self.selectedItem = questionItem;
      }
    }
  };

  self.$onChanges = function () {
    if (self.selectItems && self.questionselected !== null) {
      self.selectedItem = self.selectItems[self.questionselected];
    }
  };

  self.selectQuestion = function() {
    self.questionselected = self.selectedItem.key;
  };

  self.createQuestionItem = function (item) {
    let description;

    if (self.type === 'custom') {
      description = ' (' + (item+1)  + '/' + self.questioncount
      + '): ' + self.customQuestions[item].question;
    } else {
      description = $translate.instant('jsp.characterInfo.question') 
      + ' (' + (item+1)  + '/' + self.questioncount
      + '): ' + $translate.instant('characterInfo_question_' + self.type + '_' + item);
    }
    
    return {
      key: item,
      description: description
    };
  };
}
