/*
 * Copyright (C) 2014-2019 Andrea Feccomandi
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
  component('questionbuttonbar', {
    templateUrl: 'components/characters/question-buttonbar.html',
    controller: QuestionButtonbarController,
    bindings: {
      questioncount: '<',
      questionselected: '='
    }
  });

function QuestionButtonbarController($scope, ContextService, hotkeys) {

  var self = this;

  self.$onInit = function() {

    if (ContextService.getOs() === 'darwin') {
      self.os = '_mac';
    } else {
      self.os = '';
    }

    hotkeys.bindTo($scope)
      .add({
        combo: ['alt+left', 'alt+left'],
        description: 'previousQuestion',
        callback: function () {
          self.previousQuestion();
        }
      })
      .add({
        combo: ['alt+right', 'alt+right'],
        description: 'nextQuestion',
        callback: function () {
          self.nextQuestion();
        }
      });
  };

  self.previousQuestion = function() {
    if (self.questionselected > 0) {
      self.questionselected = self.questionselected - 1;
    }
  };

  self.nextQuestion = function () {
    if (self.questionselected < self.questioncount - 1) {
      self.questionselected = self.questionselected + 1;
    }
  };
}
