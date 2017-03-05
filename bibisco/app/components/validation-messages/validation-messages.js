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
component('validationmessages', {
  templateUrl: 'components/validation-messages/validation-messages.html',
  controller: ValidationMessagesController,
  bindings: {
    field: '<'
  }
});

function ValidationMessagesController(LoggerService) {

  LoggerService.debug('Start ValidationMessagesController...');

  // get errors
  this.getError = function() {
    return this.field.$error;
  }

  // show errors
  this.showError = function() {
    return this.field.$$parentForm.$submitted && this.field.$invalid;
  }

  // maxlength
  this.getMaxLength = function() {
    return angular.element(document.querySelector('#' + this.field.$name))
      .attr('maxlength');
  }

  // minlength
  this.getMinLength = function() {
    return angular.element(document.querySelector('#' + this.field.$name))
      .attr('minlength');
  }

  LoggerService.debug('End ValidationMessagesController...');
}
