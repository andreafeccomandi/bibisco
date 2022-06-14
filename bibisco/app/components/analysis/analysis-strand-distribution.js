/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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
  component('analysisstranddistribution', {
    templateUrl: 'components/analysis/analysis-strand-distribution.html',
    controller: AnalysisStrandDistributionController
  });

function AnalysisStrandDistributionController(AnalysisService) {

  var self = this;

  self.$onInit = function () {
    let strandChapterDistribution = AnalysisService.getStrandChapterDistribution();
    self.chapterscount = strandChapterDistribution.chapterscount;
    self.chapterspositions = strandChapterDistribution.chapterspositions;
    self.items = strandChapterDistribution.items;
  };
}