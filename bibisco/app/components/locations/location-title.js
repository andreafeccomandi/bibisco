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
component('locationtitle', {
  templateUrl: 'components/locations/location-title.html',
  controller: LocationTitleController
});

function LocationTitleController($location, $rootScope, $routeParams,
  LocationService, LoggerService) {
  LoggerService.debug('Start LocationTitleController...');

  var self = this;

  self.$onInit = function() {

    // hide menu
    $rootScope.$emit('SHOW_ELEMENT_TITLE');

    // common breadcrumb root
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.locations'
    });

    if ($routeParams.id != null) {
      let location = LocationService.getLocation(
        $routeParams.id);
      let locationName = LocationService.calculateLocationName(location);

      // edit breadcrumb items
      self.breadcrumbitems.push({
        labelvalue: locationName
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
      self.exitpath = "/locations/" + $routeParams.id;

    } else {
      // create breadcrumb items
      self.breadcrumbitems.push({
        label: 'jsp.locations.dialog.title.createLocation'
      });

      self.nation = null;
      self.state = null;
      self.city = null;
      self.location = null;

      self.pageheadertitle = 'jsp.locations.dialog.title.createLocation';
      self.exitpath = '/project/locations';
    }

    self.usednations = LocationService.getUsedNations();
    self.usedstates = LocationService.getUsedStates();
    self.usedcities = LocationService.getUsedCities();
  }

  self.save = function(isValid) {
    if (isValid) {

      if ($routeParams.id != null) {
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
          state: self.state
        });
      }
      $location.path(self.exitpath);
    }
  }

  self.back = function() {
    $location.path(self.exitpath);
  }

  LoggerService.debug('End LocationTitleController...');
}
