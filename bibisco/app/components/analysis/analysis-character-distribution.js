/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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
  component('analysischaracterdistribution', {
    templateUrl: 'components/analysis/analysis-character-distribution.html',
    controller: AnalysisCharacterDistributionController
  });

function AnalysisCharacterDistributionController(AnalysisService) {

  var self = this;

  self.$onInit = function () {
    let characterChapterDistribution = AnalysisService.getCharacterChapterDistribution();
    self.chapterscount = characterChapterDistribution.chapterscount;
    self.chapterspositions = characterChapterDistribution.chapterspositions;
    self.items = characterChapterDistribution.items;
  };
}