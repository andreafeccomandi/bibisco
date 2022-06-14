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
  component('modalwaiting', {
    templateUrl: 'components/common/uielements/modal/modal-waiting/modal-waiting.html',
    controller: ModalWaitingController,
    bindings: {
      close: '&',
      dismiss: '&',
      mode: '@',
      resolve: '<'
    },
  });

function ModalWaitingController($rootScope, $translate) {

  var self = this;

  self.$onInit = function() {

    self.message = $translate.instant(self.resolve.message);
    $rootScope.$on(self.resolve.closeEvent, function () {
      self.cancel();
    });
  };


  self.cancel = function() {
    self.dismiss({
      $value: 'cancel'
    });
  };
}
