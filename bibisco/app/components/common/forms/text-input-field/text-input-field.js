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
component('textinputfield', {
  templateUrl: 'components/common/forms/text-input-field/text-input-field.html',
  controller: TextInputFieldController,
  bindings: {
    model: '=',
    field: '<',
    label: '@',
    placeholder: '@',
    name: '@',
    required: '@',
    minlength: '@',
    maxlength: '@',
    autofocus: '@',
    typeheadsource: '<',
    labelcols: '@',
    inputcols: '@'
  }
});


function TextInputFieldController(LoggerService) {

  LoggerService.debug('Start TextInputFieldController...');

  var self = this;

  // show errors
  self.hasError = function() {
    return self.field.$$parentForm.$submitted && self.field.$invalid;
  }

  LoggerService.debug('End TextInputFieldController...');
}
