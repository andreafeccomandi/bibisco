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
  component('locationaddimage', {
    templateUrl: 'components/locations/location-addimage.html',
    controller: LocationAddImageController
  });

function LocationAddImageController($routeParams, LocationService) {

  var self = this;

  self.$onInit = function() {

    let location = LocationService.getLocation($routeParams.id);
    let locationName = LocationService.calculateLocationName(location);

    // breadcrumb
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
    self.breadcrumbitems.push({
      label: 'jsp.addImageForm.dialog.title'
    });

    self.exitpath = '/locations/' + $routeParams.id + '/images';
  };

  self.save = function(name, path) {
    LocationService.addImage($routeParams.id, name, path);
  };
}
