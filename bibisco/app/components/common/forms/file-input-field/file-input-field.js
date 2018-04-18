/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  component('fileinputfield', {
    templateUrl: 'components/common/forms/file-input-field/file-input-field.html',
    controller: FileInputFieldController,
    bindings: {
      autofocus: '@',
      field: '<',
      filefilter: '<',
      inputcols: '@',
      label: '@',
      labelcols: '@',
      model: '=',
      name: '@',
      placeholder: '@',
      required: '@'
    }
  });


function FileInputFieldController($scope) {

  var self = this;

  // show errors
  self.hasError = function() {
    return self.field.$$parentForm.$submitted && self.field.$invalid;
  };

  self.selectFile = function (file) {
    self.model = file;
    $scope.$apply();
  };
}
