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

// contenteditable directive
angular.module('bibiscoApp').directive('contenteditable', function() {
  return {
    require: '?ngModel',
    scope: {},
    link: function(scope, element, attrs, ctrl) {
      // view -> model (when div gets blur update the view value of the model)
      element.bind('keyup', function() {
        if (!element.html() || element.html() == '') {
          document.execCommand('insertHTML', false,
            '<p><br/></p>'); // This is necessary to start editing inside a <p>
        }
        scope.$apply(function() {
          ctrl.$setViewValue(element.html());
        });
      });
      element.bind('blur', function() {
        scope.$apply(function() {
          ctrl.$setViewValue(element.html());
        });
      });

      // model -> view
      ctrl.$render = function() {
        if (!ctrl.$viewValue) {
          document.execCommand('insertHTML', false,
            '<p><br/></p>'); // This is necessary to start editing inside a <p>
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

// Move caret to a specific point in a DOM element
function setCaretPosition(el, pos) {

  // Loop through all child nodes
  for (var node of el.childNodes) {
    if (node.parentNode && (node.parentNode.nodeName == 'P' || node.parentNode.nodeName ==
        'p') && node.nodeType == 3) { // we have a text node
      if (node.length >= pos) {
        // finally add our range
        var range = document.createRange(),
          sel = window.getSelection();
        range.setStart(node, pos);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        return -1; // we are done
      } else {
        pos -= node.length;
      }
    } else {
      pos = setCaretPosition(node, pos);
      if (pos == -1) {
        return -1; // no need to finish the for loop
      }
    }
  }
  return pos; // needed because of recursion stuff
}
