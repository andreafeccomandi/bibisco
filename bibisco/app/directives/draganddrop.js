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


// Draggable directive
angular.module('bibiscoApp').directive('draggable', function() {
  return function(scope, element) {
    // this gives us the native JS object
    var el = element[0];

    el.draggable = true;

    el.addEventListener(
      'dragstart',
      function(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('cardid', this.attributes.cardid.nodeValue);
        e.dataTransfer.setData('family', this.getAttribute('family'));
        this.classList.add('drag');
        return false;
      },
      false
    );

    el.addEventListener(
      'dragend',
      function() {
        this.classList.remove('drag');
        return false;
      },
      false
    );
  };
})

// Droppable directive
  .directive('droppable', function() {
    return {
      scope: {
        dropfunction: '&'
      },
      link: function(scope, element) {
      // again we need the native object
        var el = element[0];

        el.addEventListener(
          'dragover',
          function(e) {
            e.dataTransfer.dropEffect = 'move';
            // allows us to drop
            if (e.preventDefault) e.preventDefault();
            this.classList.add('over');
            return false;
          },
          false
        );

        el.addEventListener(
          'dragenter',
          function() {
            this.classList.add('over');
            return false;
          },
          false
        );

        el.addEventListener(
          'dragleave',
          function() {
            this.classList.remove('over');
            return false;
          },
          false
        );

        el.addEventListener(
          'drop',
          function(e) {
          // stops some browsers from redirecting.
            if (e.stopPropagation) e.stopPropagation();
            // remove over class
            this.classList.remove('over');

            // call the passed drop function
            if (this.getAttribute('family') === e.dataTransfer.getData(
              'family')) {
              scope.dropfunction({
                draggedObjectId: e.dataTransfer.getData('cardid'),
                destinationObjectId: this.attributes.cardid.nodeValue
              });
            }

            return false;
          },
          false
        );
      }
    };
  });
