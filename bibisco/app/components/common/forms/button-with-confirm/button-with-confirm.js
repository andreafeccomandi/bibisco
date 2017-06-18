/*
 * Copyright (C) 2014-2017 Andrea Feccomandi
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
component('buttonwithconfirm', {
  templateUrl: 'components/common/forms/button-with-confirm/button-with-confirm.html',
  controller: ButtonWithConfirmController,
  bindings: {
    buttonfunction: '&',
    buttonlabel: '@',
    buttonstyle: '@',
    confirmmessage: '@',
    enableconfirm: '<'
  }
});


function ButtonWithConfirmController($uibModal, LoggerService) {

  LoggerService.debug('Start ButtonWithConfirmController...');

  var self = this;

  self.click = function() {
    if (self.enableconfirm) {
      self.openComponentModal();
    } else {
      self.buttonfunction();
    }
  }

  self.openComponentModal = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'modalconfirm',
      resolve: {
        message: function() {
          return self.confirmmessage;
        }
      }
    });

    modalInstance.result.then(function(selectedItem) {
      self.buttonfunction();
    }, function() {
      // cancel
    });
  };

  LoggerService.debug('End ButtonWithConfirmController...');
}
