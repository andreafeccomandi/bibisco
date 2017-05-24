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

angular.module('bibiscoApp').service('CollectionUtilService', function(
  LoggerService, ProjectDbConnectionService
) {
  'use strict';

  return {

    insert: function(collection, element) {
      element.position = collection.count() + 1;
      element.status = 'todo';
      collection.insert(element);
      ProjectDbConnectionService.saveDatabase();
    },

    move: function(collection, sourceId, targetId, returnFn) {

      let source = collection.get(sourceId);
      let sourcePosition = source.position;
      let target = collection.get(targetId);
      let targetPosition = target.position;

      // shift down
      if (sourcePosition < targetPosition) {
        let elementsToShift = collection.find({
          position: {
            '$between': [sourcePosition + 1,
              targetPosition
            ]
          }
        });
        for (let i = 0; i < elementsToShift.length; i++) {
          elementsToShift[i].position = elementsToShift[i].position - 1;
        }
      }
      // shift up
      else {
        let elementsToShift = collection.find({
          position: {
            '$between': [targetPosition, sourcePosition -
              1
            ]
          }
        });
        for (let i = 0; i < elementsToShift.length; i++) {
          elementsToShift[i].position = elementsToShift[i].position + 1;
        }
      }

      source.position = targetPosition;
      collection.update(source);
      ProjectDbConnectionService.saveDatabase();

      return returnFn();
    }
  }
});
