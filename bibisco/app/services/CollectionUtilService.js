/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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

    getData: function(collection) {
      return collection.chain().data();
    },

    getDataSortedByPosition: function(collection, filter) {

      // get only positions greater than zero; we use negative position for special records
      let positionfilter = {'$gt': 0};
      if (filter) {
        filter.position = positionfilter;
      } else {
        filter = {'position': positionfilter};
      }

      let data = this.getDataSortedByField(collection, 'position', filter);

      // check collection position integrity
      let check = this.checkCollectionPositions(data);
      if (!check) {
        this.fixCollectionPositions(data, collection.name, filter);
      }

      return data;
    },

    getDataSortedByField: function(collection, field, filter) {

      let data = filter? collection.chain().find(filter).simplesort(field).data() : 
        collection.chain().simplesort(field).data();

      return data;
    },

    checkCollectionPositions: function (data) {
      let result = true;
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].position !== (i + 1)) {
            result = false;
            break;
          }
        }
      }
      return result;
    },

    fixCollectionPositions: function (data, collectionName, filter) {

      LoggerService.info('Fixing collection ' + collectionName + ' ' +
        JSON.stringify(filter ? filter : '') + '... ');
      
      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          LoggerService.info('$loki: ' + data[i].$loki + ' position: ' + data[i].position + ' type: ' + typeof(data[i].position));
          // update position
          data[i].position = (i + 1);
        }

        // save database
        ProjectDbConnectionService.saveDatabase();

        if (filter) {
          LoggerService.info('Fixed collection ' + collectionName + ' ' +
            JSON.stringify(filter) + '!');
        } else {
          LoggerService.info('Fixed collection ' + collectionName + '!');
        }
      }
    },

    fixCollectionIntegrity: function(collection) {

      if (collection.maxId !== collection.count()) {
        LoggerService.info('Collection ' + collection.name + ' needs to be repaired! - Max ID = ' + collection.maxId  + ' elements=' + collection.count());
        let results = collection.find();
        collection.clear({removeIndices:true});
        for (let i = 0; i < results.length; i++) {
          const element = JSON.parse(JSON.stringify(results[i]));
          delete element['$loki'];
          delete element['meta'];
          collection.insert(element);
        }
        ProjectDbConnectionService.saveDatabase();
        LoggerService.info('Collection ' + collection.name + ' repaired!');
      } else {
        LoggerService.info('Collection ' + collection.name + ' integrity is ok!');
      }
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
      let positionfilter = {'$gt': 0};
      if (filter) {
        filter.position = positionfilter;
      } else {
        filter = {'position': positionfilter};
      }
      position = collection.find(filter).length + 1;

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
      
      // if position > 0 shift down elements
      if (elementPosition > 0) {
        let endPosition;
        if (filter) {
          endPosition = collection.count(filter);
        } else {
          endPosition = collection.count();
        }
        this.shiftDown(collection, elementPosition + 1, endPosition, filter);
      }
      
      collection.remove(element);

      LoggerService.info('Removed element with $loki=' + id + ' from ' +
        collection.name);
    },

    move: function (collection, sourceId, targetId, filter) {
      this.executeMove(collection, sourceId, targetId, filter);
      ProjectDbConnectionService.saveDatabase();
    },

    moveWithoutCommit: function (collection, sourceId, targetId, filter) {
      this.executeMove(collection, sourceId, targetId, filter);
    },

    executeMove: function(collection, sourceId, targetId, filter) {

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
     
      LoggerService.info('Moved element of collection ' + collection.name +
        ' with $loki=' + sourceId + ' at position ' + sourcePosition +
        ' to element with $loki=' + targetId + ' at position ' +
        targetPosition);
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
