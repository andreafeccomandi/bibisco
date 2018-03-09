/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  component('buttongroupfield', {
    templateUrl: 'components/common/forms/button-group-field/button-group-field.html',
    controller: ButtonGroupField,
    bindings: {
      group: '<',
      inputcols: '@',
      label: '@',
      labelcols: '@',
      model: '='
    }
  });


function ButtonGroupField() {

  var self = this;

  self.change = function(value) {
    self.model = value;
  };
}
