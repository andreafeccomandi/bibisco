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
  component('wordsgoalcounter', {
    templateUrl: 'components/common/uielements/words-goal-counter/words-goal-counter.html',
    controller: WordsGoalCounterController,
    bindings: {
    }
  });


function WordsGoalCounterController(ChapterService, ProjectService) {

  var self = this;

  self.$onInit = function () {
    
    let totalWordsAndCharacters = ChapterService.getTotalWordsAndCharacters();
    self.wordsTotal = totalWordsAndCharacters.words;
    
    let projectInfo = ProjectService.getProjectInfo();
    self.wordsGoal = projectInfo.wordsGoal;

    if (self.wordsGoal) {
      self.wordsGoalPerc = Math.round((self.wordsTotal / self.wordsGoal * 100 + Number.EPSILON));
    }
  };
}
