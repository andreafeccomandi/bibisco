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
  component('textinputfield', {
    templateUrl: 'components/common/forms/text-input-field/text-input-field.html',
    controller: TextInputFieldController,
    bindings: {
      model: '=',
      field: '<',
      textinputfieldid: '@',
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


function TextInputFieldController() {

  var self = this;

  // show errors
  self.hasError = function() {
    return self.field.$$parentForm.$submitted && self.field.$invalid;
  };
}
