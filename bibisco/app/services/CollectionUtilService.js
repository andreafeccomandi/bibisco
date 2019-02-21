/*
 * Copyright (C) 2014-2019 Andrea Feccomandi
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

angular.module('bibiscoApp').service('CollectionUtilService', function(
  LoggerService, ProjectDbConnectionService
) {
  'use strict';

  return {

    getDynamicViewSortedByPosition: function(collection,
      dynamicViewName, filter) {
      let dynamicView = collection.getDynamicView(dynamicViewName);
      if (!dynamicView) {
        LoggerService.debug('Created ' + dynamicViewName + ' dynamicView');
        dynamicView = collection.addDynamicView(dynamicViewName);
        if (filter) {
          dynamicView.applyFind(filter);
        }
        dynamicView.applySimpleSort('position');
      } else {
        LoggerService.debug('Loaded ' + dynamicViewName + ' dynamicView');
      }

      return dynamicView;
    },

    insert: function(collection, element, filter) {
      element = this.executeInsert(collection, element, filter);
      ProjectDbConnectionService.saveDatabase();
      return element;
    },

    insertWithoutCommit: function(collection, element, filter) {
      return this.executeInsert(collection, element, filter);
    },

    executeInsert: function(collection, element, filter) {
      let position;
      if (filter) {
        position = collection.find(filter).length + 1;
      } else {
        position = collection.count() + 1;
      }

      element.characters = 0;
      element.lastsave = (new Date()).toJSON();
      element.position = position;
      element.status = 'todo';
      element.words = 0;
      element = collection.insert(element);

      LoggerService.info('Insert element with $loki=' + element.$loki +
        ' in ' + collection.name);

      return element;
    },

    update: function(collection, element) {
      element = this.executeUpdate(collection, element);
      ProjectDbConnectionService.saveDatabase();
      return element;
    },

    updateWithoutCommit: function(collection, element, filter) {
      return this.executeUpdate(collection, element, filter);
    },

    executeUpdate: function(collection, element) {
      element.lastsave = (new Date()).toJSON();
      collection.update(element);
      LoggerService.info('Update element with $loki=' + element.$loki +
        ' in ' + collection.name);
      return element;
    },

    remove: function(collection, id, filter) {
      this.executeRemove(collection, id, filter);
      ProjectDbConnectionService.saveDatabase();
    },

    removeWithoutCommit: function(collection, id, filter) {
      this.executeRemove(collection, id, filter);
    },

    executeRemove: function(collection, id, filter) {
      let element = collection.get(id);
      let elementPosition = element.position;
      let endPosition;

      if (filter) {
        endPosition = collection.count(filter);
      } else {
        endPosition = collection.count();
      }

      this.shiftDown(collection, elementPosition + 1, endPosition, filter);
      collection.remove(element);
      LoggerService.info('Removed element with $loki=' + id + ' from ' +
        collection.name);
    },

    move: function(collection, sourceId, targetId, dynamicView, filter) {

      let source = collection.get(sourceId);
      let sourcePosition = source.position;
      let target = collection.get(targetId);
      let targetPosition = target.position;

      // shift down
      if (sourcePosition < targetPosition) {
        this.shiftDown(collection, sourcePosition + 1, targetPosition,
          filter);
      }
      // shift up
      else {
        this.shiftUp(collection, targetPosition, sourcePosition - 1,
          filter);
      }

      source.position = targetPosition;
      collection.update(source);
      ProjectDbConnectionService.saveDatabase();
      LoggerService.info('Moved element of collection ' + collection.name +
        ' with $loki=' + sourceId + ' at position ' + sourcePosition +
        ' to element with $loki=' + targetId + ' at position ' +
        targetPosition);

      return dynamicView.data();
    },

    shiftDown: function(collection, startPosition, endPosition, filter) {
      let elementsToShift = this.getElementsToShift(collection,
        startPosition, endPosition, filter);
      for (let i = 0; i < elementsToShift.length; i++) {
        elementsToShift[i].position = elementsToShift[i].position - 1;
      }
    },

    shiftUp: function(collection, startPosition, endPosition, filter) {
      let elementsToShift = this.getElementsToShift(collection,
        startPosition, endPosition, filter);
      for (let i = 0; i < elementsToShift.length; i++) {
        elementsToShift[i].position = elementsToShift[i].position + 1;
      }
    },

    getElementsToShift: function(collection, startPosition,
      endPosition, filter) {
      let filterquery = {};
      if (filter) {
        filterquery = filter;
      }
      filterquery.position = {
        '$between': [startPosition, endPosition]
      };
      return collection.find(filterquery);
    }
  };
});
