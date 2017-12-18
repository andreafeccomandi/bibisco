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
  component('locationimages', {
    templateUrl: 'components/locations/location-images.html',
    controller: ImagesViewerController
  });

function ImagesViewerController($location, $rootScope, $routeParams,
  LocationService) {

  var self = this;

  self.$onInit = function() {
    
    let location = LocationService.getLocation($routeParams.id);
    let locationName = LocationService.calculateLocationName(location);
    
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_locations'
    });
    self.breadcrumbitems.push({
      label: locationName
    });
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.select.location.images'
    });

    self.lastsave = location.lastsave;
    self.pageheadertitle = locationName;
  };

  self.delete = function(id) {
    
  };

  self.insert = function(id) {

  };

  self.back = function() {
    $location.path('/locations/' + $routeParams.id);
  };
}
