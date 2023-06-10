/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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

function LocationsController($injector, $location, $rootScope, $scope, BibiscoPropertiesService, 
  LocationService, SupporterEditionChecker, UtilService) {

  let self = this;
  let GroupService = null;

  self.$onInit = function() {
    
    // show menu item
    $rootScope.$emit('SHOW_PAGE', {
      item: 'locations'
    });
    
    self.zoomLevel = BibiscoPropertiesService.getProperty('zoomLevel');
    self.showGroupFilter = false;
    self.cardgriditems = this.getCardGridItems();

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
        let tags = [];
        let showOnActiveFilter = false;
        if (SupporterEditionChecker.isSupporterOrTrial()) {
          let elementGroups = this.getGroupService().getElementGroups('location', locations[i].$loki);
          for (let i = 0; i < elementGroups.length; i++) {
            tags.push({label: elementGroups[i].name, color: elementGroups[i].color});
            if ($rootScope.groupFilter && elementGroups[i].$loki === $rootScope.groupFilter.key) {
              showOnActiveFilter = true;
            }
          }
          self.showGroupFilter = true;
        }
        if (!$rootScope.groupFilter || $rootScope.groupFilter.key === 'all' || showOnActiveFilter) {
          items.push({
            id: locations[i].$loki,
            image: locations[i].profileimage, 
            noimageicon: 'map-marker',
            position: locations[i].position,
            status: locations[i].status,
            tags: tags,
            text: this.locationDescription(locations[i].nation,
              locations[i].state, locations[i].city),
            title: self.getTitle(locations[i].location)
          });
        }
      }
    } 
    return items;
  };

  self.getTitle = function(title) {
    let crop;
    if (self.zoomLevel === 100) {
      crop = 40;
    } else if (self.zoomLevel === 115) {
      crop = 40;
    } else if (self.zoomLevel === 130) {
      crop = 30;
    }
    return UtilService.string.truncate(title, crop);
  };

  self.getGroupService = function () {
    if (!GroupService) {
      GroupService = $injector.get('GroupService');
    }
    return GroupService;
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

  self.refreshCardGridItems = function() {
    self.showGroupFilter = false;
    self.cardgriditems = this.getCardGridItems();
    $scope.$apply();
  };
}
