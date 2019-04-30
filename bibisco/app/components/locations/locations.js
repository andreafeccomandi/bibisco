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
angular.
  module('bibiscoApp').
  component('locations', {
    templateUrl: 'components/locations/locations.html',
    controller: LocationsController,
    bindings: {

    }
  });

function LocationsController($location, $rootScope, $routeParams, $scope,
  CardUtilService, LocationService) {

  var self = this;

  self.$onInit = function() {
    
    // show menu item
    $rootScope.$emit('SHOW_PAGE', {
      item: 'locations'
    });
    
    self.cardgriditems = this.getCardGridItems();

    // focus element
    CardUtilService.focusElementInPath($routeParams.params);

    // hotkeys
    self.hotkeys = ['ctrl+n', 'command+n'];
  };

  self.locationsPresent = function() {
    return LocationService.getLocationsCount() > 0;
  };

  self.create = function() {
    $location.path('/locations/new');
  };

  self.getCardGridItems = function() {
    let items;
    if (LocationService.getLocationsCount() > 0) {
      let locations = LocationService.getLocations();
      items = [];
      for (let i = 0; i < locations.length; i++) {
        items.push({
          id: locations[i].$loki,
          position: locations[i].position,
          status: locations[i].status,
          text: this.locationDescription(locations[i].nation,
            locations[i].state, locations[i].city),
          title: locations[i].location
        });
      }
    }
    return items;
  };

  self.move = function(draggedObjectId, destinationObjectId) {
    LocationService.move(draggedObjectId, destinationObjectId);
    self.cardgriditems = this.getCardGridItems();
    $scope.$apply();
  };

  self.select = function(id) {
    $location.path('/locations/' + id + '/view');
  };

  self.locationDescription = function(nation, state, city) {
    let useComma = false;
    let description = '';
    if (nation) {
      description = description + nation;
      useComma = true;
    }
    if (state) {
      if (useComma) {
        description = description + ', ';
      }
      description = description + state;
      useComma = true;
    }
    if (city) {
      if (useComma) {
        description = description + ', ';
      }
      description = description + city;
    }

    return description;
  };
}
