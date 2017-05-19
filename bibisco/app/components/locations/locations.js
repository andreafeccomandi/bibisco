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
angular.
module('bibiscoApp').
component('locations', {
  templateUrl: 'components/locations/locations.html',
  controller: LocationsController,
  bindings: {

  }
});

function LocationsController($location, $rootScope, $scope, LocationService,
  LoggerService) {

  LoggerService.debug('Start LocationsController...');
  var self = this;

  self.locations = LocationService.getLocations();

  self.locationsPresent = function() {
    return LocationService.getLocationsCount() > 0;
  }

  self.createLocation = function() {
    $location.path('/locationtitle/new/0');
  }

  self.move = function(draggedObjectId, destinationObjectId) {
    self.locations = LocationService.move(draggedObjectId,
      destinationObjectId);
    $scope.$apply();
  }

  self.locationDescription = function(nation, state, city) {
    let useComma = false;
    let description = '';
    if (nation) {
      description = description + nation;
      useComma = true;
    }
    if (state) {
      if (useComma) {
        description = description + ", ";
      }
      description = description + state;
      useComma = true;
    }
    if (city) {
      if (useComma) {
        description = description + ", ";
      }
      description = description + city;
    }

    return description;
  }

  LoggerService.debug('End LocationsController...');
}
