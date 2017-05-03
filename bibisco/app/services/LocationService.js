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
  LoggerService, ProjectDbConnectionService
) {
  'use strict';

  var locations = null;
  var locationsCount = null;

  return {
    getLocation: function(id) {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'projects').addDynamicView(
        'all_locations').applySimpleSort('name').data();
    },
    getLocationsCount: function() {
      if (locationsCount == null) {
        this.loadLocations();
      }
      return locationsCount;
    },
    getLocations: function() {
      if (locations == null) {
        this.loadLocations();
      }
      return locations;
    },
    insert: function(location) {
      ProjectDbConnectionService.getProjectDb().getCollection(
        'locations').insert(location);
      ProjectDbConnectionService.saveDatabase();
      loadLocations();
    },
    loadLocations: function() {
      locations = ProjectDbConnectionService.getProjectDb().getCollection(
        'locations').addDynamicView(
        'all_locations').applySimpleSort('name').data();
      locationsCount = ProjectDbConnectionService.getProjectDb().getCollection(
        'locations').count();
    }
  };
});
