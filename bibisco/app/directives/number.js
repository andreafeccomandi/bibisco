/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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


angular.module('bibiscoApp').directive('number', function () {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attrs, ctrl) {
      ctrl.$parsers.push(function (input) {
        if (input === undefined) return '';
        let inputNumber = input.toString().replace(/[^0-9]/g, '');
        if (inputNumber !== input) {
          ctrl.$setViewValue(inputNumber);
          ctrl.$render();
        }
        return inputNumber;
      });
    }
  };
});