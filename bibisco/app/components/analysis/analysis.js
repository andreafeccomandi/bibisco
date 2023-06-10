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
  component('analysis', {
    templateUrl: 'components/analysis/analysis.html',
    controller: AnalysisController
  });

function AnalysisController($injector, $rootScope, $timeout, AnalysisService, SupporterEditionChecker) {

  var self = this;

  self.$onInit = function () {
    // show menu item
    $rootScope.$emit('SHOW_PAGE', {
      item: 'analysis'
    });

    // supporters or trial check
    self.showSupporterEditionItems = SupporterEditionChecker.isSupporterOrTrial();
    
    self.loading = true;
    $timeout(function () {
      AnalysisService.init();
      self.loading = false;
    }, 250);
  };
}