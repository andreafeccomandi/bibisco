/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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

function LocationTitleController($rootScope, $routeParams, $scope, $window, hotkeys, 
  LocationService, PopupBoxesService) {
  
  let self = this;

  self.$onInit = function() {

    // hide menu
    $rootScope.$emit('SHOW_ELEMENT_TITLE');

    // common breadcrumb root
    self.breadcrumbitems = [];

    let location = LocationService.getLocation(parseInt($routeParams.id));
  
    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!location) {
      $window.history.back();
      return;
    }

    let locationName = LocationService.calculateLocationName(location);

    self.breadcrumbitems.push({
      label: 'common_locations',
      href: '/locations'
    });

    // edit breadcrumb items
    self.breadcrumbitems.push({
      label: locationName,
      href: '/locations/' + location.$loki + '/default'
    });
    self.breadcrumbitems.push({
      label: 'jsp.locations.dialog.title.changeThumbnailTitle'
    });

    self.nation = location.nation;
    self.state = location.state;
    self.city = location.city;
    self.location = location.location;

    self.pageheadertitle = 'jsp.locations.dialog.title.changeThumbnailTitle';

    self.profileimageenabled = true;
    self.profileimage = location.profileimage;

    self.usednations = LocationService.getUsedNations();
    self.usedstates = LocationService.getUsedStates();
    self.usedcities = LocationService.getUsedCities();

    self.checkExit = {
      active: true
    };

    hotkeys.bindTo($scope)
      .add({
        combo: ['enter', 'enter'],
        description: 'enter',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'],
        callback: function ($event) {
          $event.preventDefault();
          $scope.locationTitleForm.$submitted = true;
          self.save($scope.locationTitleForm.$valid);
        }
      });
  };

  self.save = function(isValid) {
    if (isValid) {
      let location = LocationService.getLocation(parseInt($routeParams.id));
      location.nation = self.nation;
      location.state = self.state;
      location.city = self.city;
      location.location = self.location;
      LocationService.update(location);

      self.checkExit = {
        active: false
      };
      $window.history.back();
    }
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.locationTitleForm.$dirty, self.checkExit);
  });
}
