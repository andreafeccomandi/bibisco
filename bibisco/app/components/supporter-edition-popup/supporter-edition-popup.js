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
  component('supportereditionpopup', {
    templateUrl: 'components/supporter-edition-popup/supporter-edition-popup.html',
    controller: SupporterEditionPopupController,
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '<'
    },
  });

function SupporterEditionPopupController() {
   
  var self = this;
  self.$onInit = function () {
    
  };

  self.getIt = function () {
    self.close({
      $value: 'ok'
    });
  };

  self.cancel = function () {
    self.dismiss({
      $value: 'cancel'
    });
  };
}