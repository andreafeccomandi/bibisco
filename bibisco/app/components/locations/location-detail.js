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
  component('locationdetail', {
    templateUrl: 'components/locations/location-detail.html',
    controller: LocationDetailController
  });

function LocationDetailController($location, $routeParams, LocationService) {

  var self = this;

  self.$onInit = function() {

    self.location = self.getLocation($routeParams.id);
    self.name = LocationService.calculateLocationName(self.location);

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.locations',
      href: '/project/locations'
    });
    self.breadcrumbitems.push({
      label: self.name
    });

    self.editmode = false;
    self.showprojectexplorer = true;

  };

  self.back = function() {
    $location.path('/project/locations');
  };

  self.changeStatus = function(status) {
    self.location.status = status;
    LocationService.update(self.location);
  };

  self.changeTitle = function() {
    $location.path('/locations/' + self.location.$loki + '/title');
  };

  self.delete = function() {
    LocationService.remove(self.location
      .$loki);
    $location.path('/project/locations');
  };

  self.getLocation = function(id) {
    return LocationService.getLocation(id);
  };

  self.savefunction = function() {
    LocationService.update(self.location);
  };

  self.showimagesfunction = function() {
    alert('Qui si visualizzeranno le immagini per id=' + self.location
      .$loki);
  };
}
