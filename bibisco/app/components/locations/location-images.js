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
angular.
  module('bibiscoApp').
  component('locationimages', {
    templateUrl: 'components/locations/location-images.html',
    controller: LocationImagesController
  });

function LocationImagesController($location, $rootScope, $routeParams, $window,
  LocationService) {

  var self = this;

  self.$onInit = function() {

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
      href: '/locations/params/focus=locations_' + location.$loki
    });
    self.breadcrumbitems.push({
      label: locationName,
      href: '/locations/ ' + location.$loki + '/view'
    });
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.select.location.images'
    });

    self.images = location.images;
    self.selectedimage = location.profileimage;
    self.lastsave = location.lastsave;
    self.pageheadertitle = locationName;
  };

  self.delete = function(filename) {
    let location = LocationService.deleteImage(parseInt($routeParams.id), filename);
    self.images = location.images;
    self.selectedimage = location.profileimage;
  };

  self.insert = function() {
    $location.path('/locations/' + $routeParams.id + '/images/new');
  };

  self.select = function(filename) {
    LocationService.setProfileImage(parseInt($routeParams.id), filename);
    self.selectedimage = filename;
  };
}

