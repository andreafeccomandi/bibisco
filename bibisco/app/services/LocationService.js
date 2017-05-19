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

angular.module('bibiscoApp').service('LocationService', function(
  CollectionUtilService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  var collection = ProjectDbConnectionService.getProjectDb().getCollection(
    'locations');
  var dynamicView = collection.addDynamicView(
    'all_locations').applySimpleSort('position');

  return {
    getLocation: function(id) {
      return collection.get(id);
    },
    getLocationsCount: function() {
      return collection.count();
    },
    getLocations: function() {
      return dynamicView.data();
    },
    insert: function(location) {
      collection.insert(location);
      ProjectDbConnectionService.saveDatabase();
    },
    move: function(sourceId, targetId) {
      return CollectionUtilService.move(collection, sourceId, targetId,
        this.getLocations);
    }
  }
});
