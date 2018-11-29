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
angular.
  module('bibiscoApp').
  component('locationtitle', {
    templateUrl: 'components/locations/location-title.html',
    controller: LocationTitleController
  });

function LocationTitleController($location, $rootScope, $routeParams, $scope,
  $timeout, LocationService, PopupBoxesService) {

  var self = this;

  self.$onInit = function() {

    // hide menu
    $rootScope.$emit('SHOW_ELEMENT_TITLE');

    // common breadcrumb root
    self.breadcrumbitems = [];

    if ($routeParams.id !== undefined) {
      let location = LocationService.getLocation($routeParams.id);
      let locationName = LocationService.calculateLocationName(location);

      self.breadcrumbitems.push({
        label: 'common_locations',
        href: '/locations/params/focus=locations_' + location.$loki
      });

      // edit breadcrumb items
      self.breadcrumbitems.push({
        label: locationName,
        href: '/locations/' + location.$loki + '/view'
      });
      self.breadcrumbitems.push({
        label: 'jsp.locations.dialog.title.changeThumbnailTitle'
      });

      self.nation = location.nation;
      self.state = location.state;
      self.city = location.city;
      self.location = location.location;

      self.pageheadertitle =
        'jsp.locations.dialog.title.changeThumbnailTitle';
      self.exitpath = '/locations/' + location.$loki + '/view';

    } else {

      self.breadcrumbitems.push({
        label: 'common_locations',
        href: '/locations'
      });

      // create breadcrumb items
      self.breadcrumbitems.push({
        label: 'jsp.locations.dialog.title.createLocation'
      });

      self.nation = null;
      self.state = null;
      self.city = null;
      self.location = null;

      self.pageheadertitle = 'jsp.locations.dialog.title.createLocation';
      self.exitpath = '/locations';
    }

    self.usednations = LocationService.getUsedNations();
    self.usedstates = LocationService.getUsedStates();
    self.usedcities = LocationService.getUsedCities();

    self.checkExitActive = true;
  };

  self.save = function(isValid) {
    if (isValid) {

      if ($routeParams.id !== undefined) {
        let location = LocationService.getLocation(
          $routeParams.id);
        location.nation = self.nation;
        location.state = self.state;
        location.city = self.city;
        location.location = self.location;
        LocationService.update(location);

      } else {
        LocationService.insert({
          city: self.city,
          description: '',
          location: self.location,
          nation: self.nation,
          state: self.state,
        });
      }
      
      self.checkExitActive = false;
      $location.path(self.exitpath);
    }
  };

  self.back = function() {
    $location.path(self.exitpath);
  };

  $scope.$on('$locationChangeStart', function (event) {

    if (self.checkExitActive && $scope.locationTitleForm.$dirty) {
      event.preventDefault();
      let wannaGoPath = $location.path();
      self.checkExitActive = false;

      PopupBoxesService.confirm(function () {
        $timeout(function () {
          $location.path(wannaGoPath);
        }, 0);
      },
      'js.common.message.confirmExitWithoutSave',
      function () {
        self.checkExitActive = true;
      });
    }
  });
}
