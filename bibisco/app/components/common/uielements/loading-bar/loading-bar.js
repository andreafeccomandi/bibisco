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
  component('loadingbar', {
    templateUrl: 'components/common/uielements/loading-bar/loading-bar.html',
    controller: LoadingBarController,
    bindings: {
      message: '@',
      onepercentmilliseconds: '<',
      start: '<'
    }
  });


function LoadingBarController($interval) {

  let self = this;
  self.dictionaryLoadingPerc = 0;

  self.$onInit = function () {
    $interval(function () {
      if (self.start) {
        self.dictionaryLoadingPerc += 1;
      }
    }, self.onepercentmilliseconds);
  };

}
