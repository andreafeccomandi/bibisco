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

angular.module('bibiscoApp').directive('urlvalidator', function () {

  const URL_REGEXP = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function (scope, element, attrs, ctrl) {
      ctrl.$validators.url = function(modelValue, viewValue) {
        if (ctrl.$isEmpty(modelValue)) {
          return true;
        }
        if (URL_REGEXP.test(viewValue)) {
          return true;
        }
        return false;
      };
    }
  };
});