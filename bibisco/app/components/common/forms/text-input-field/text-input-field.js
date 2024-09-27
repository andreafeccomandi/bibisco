/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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
      addon: '@',
      autofocus: '@',
      field: '<',
      inputcols: '@',
      label: '@',
      labelcols: '@',
      maxlength: '@',
      minlength: '@',
      model: '=',
      name: '@',
      placeholder: '@',
      required: '@',
      textinputfieldid: '@',
      typeheadsource: '<'
    }
  });


function TextInputFieldController() {

  let self = this;

  // show errors
  self.hasError = function() {
    return self.field.$$parentForm.$submitted && self.field.$invalid;
  };
}
