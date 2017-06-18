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
component('buttonwithalert', {
  templateUrl: 'components/common/forms/button-with-alert/button-with-alert.html',
  controller: ButtonWithAlertController,
  bindings: {
    alertmessage: '@',
    buttonfunction: '&',
    buttonlabel: '@',
    buttonstyle: '@',
    enablealert: '<'
  }
});


function ButtonWithAlertController($uibModal, LoggerService) {

  LoggerService.debug('Start ButtonWithAlertController...');

  var self = this;

  self.click = function() {
    if (self.enablealert) {
      self.openComponentModal();
    } else {
      self.buttonfunction();
    }
  }

  self.openComponentModal = function() {
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'modalalert',
      resolve: {
        message: function() {
          return self.alertmessage;
        }
      }
    });

    modalInstance.result.then(function(selectedItem) {
      // ok: unreachable code: we're in alert!
    }, function() {
      // cancel
    });
  };

  LoggerService.debug('End ButtonWithAlertController...');
}
