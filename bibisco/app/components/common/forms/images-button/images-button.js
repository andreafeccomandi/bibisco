/*
 * Copyright (C) 2014-2020 Andrea Feccomandi
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
  component('imagesbutton', {
    templateUrl: 'components/common/forms/images-button/images-button.html',
    controller: ImagesButtonController,
    bindings: {
      showimagesfunction: '&',
      showimageslabel: '@',
      visible: '<'
    }
  });

function ImagesButtonController($scope, $translate, hotkeys) {

  var self = this;

  self.$onInit = function () {
    self.tooltip = $translate.instant(self.showimageslabel);
  };

  hotkeys.bindTo($scope)
    .add({
      combo: ['ctrl+j', 'command+j'],
      description: 'showimages',
      callback: function () {
        self.showimagesfunction();
      }
    });
}
