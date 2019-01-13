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

// contenteditable directive
angular.module('bibiscoApp').directive('contenteditable', function() {
  return {
    require: '?ngModel',
    scope: {},
    link: function(scope, element, attrs, ctrl) {

      scope.setViewValue = function() {
        var phase = scope.$root.$$phase;
        if (phase === '$apply' || phase === '$digest') {
          ctrl.$setViewValue(element.html());
        } else {
          scope.$apply(function () {
            ctrl.$setViewValue(element.html());
          });
        }
      };

      // view -> model (when div gets blur update the view value of the model)
      element.bind('keyup', function() {
        if (!element.html() || element.html() === '') {
          document.execCommand('insertHTML', false,
            '<p><br></p>'); // This is necessary to start editing inside a <p>
        }
        scope.setViewValue();
      });
      element.bind('blur', function() {
        scope.setViewValue();
      });

      // model -> view
      ctrl.$render = function() {
        if (!ctrl.$viewValue) {
          document.execCommand('insertHTML', false,
            '<p><br></p>'); // This is necessary to start editing inside a <p>
        } else {
          element.html(ctrl.$viewValue);
        }
      };

      // load init value from DOM
      ctrl.$render();

      // remove the attached events to element when destroying the scope
      scope.$on('$destroy', function() {
        element.unbind('blur');
        element.unbind('keyup');
        element.unbind('paste');
        element.unbind('focus');
      });
    }
  };
});
