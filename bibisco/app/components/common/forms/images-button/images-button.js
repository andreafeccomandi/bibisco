/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  component('imagesbutton', {
    templateUrl: 'components/common/forms/images-button/images-button.html',
    controller: ImagesButtonController,
    bindings: {
      showimagesfunction: '&',
      showimageslabel: '@',
      visible: '<'
    }
  });

function ImagesButtonController($translate) {

  var self = this;

  self.$onInit = function () {
    self.tooltip = $translate.instant(self.showimageslabel);
  };
}
