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

angular.module('bibiscoApp').service('StrandService', function(
  CollectionUtilService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  var collection = ProjectDbConnectionService.getProjectDb().getCollection(
    'strands');
  var dynamicView = CollectionUtilService.getDynamicViewSortedByPosition(
    collection, 'all_strands');

  return {
    getStrand: function(id) {
      return collection.get(id);
    },
    getStrandsCount: function() {
      return collection.count();
    },
    getStrands: function() {
      return dynamicView.data();
    },
    insert: function(strand) {
      CollectionUtilService.insert(collection, strand);
    },
    move: function(sourceId, targetId) {
      return CollectionUtilService.move(collection, sourceId, targetId,
        dynamicView);
    },
    remove: function(id) {
      CollectionUtilService.remove(collection, id);
    },
    update: function(strand) {
      CollectionUtilService.update(collection, strand);
    }
  };
});
