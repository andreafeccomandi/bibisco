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
component('backbuttonwithconfirm', {
  templateUrl: 'components/common/forms/back-button-with-confirm/back-button-with-confirm.html',
  controller: BackButtonConfirmController,
  bindings: {
    dirty: '<',
    backfunction: '&'
  }
});


function BackButtonConfirmController(LoggerService) {

  LoggerService.debug('Start BackButtonConfirmController...');

  var self = this;

  self.backWithoutConfirm = function() {
    if (!self.dirty) {
      self.backfunction();
    }
  }

  self.backWithConfirm = function() {
    self.backfunction();
  }

  LoggerService.debug('End BackButtonConfirmController...');
}
