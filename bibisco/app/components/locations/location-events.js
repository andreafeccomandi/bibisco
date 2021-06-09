/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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
  component('locationevents', {
    templateUrl: 'components/locations/location-events.html',
    controller: LocationEventsController
  });

function LocationEventsController($location, $routeParams,
  LocationService) {

  var self = this;

  self.$onInit = function() {
    
    let location = LocationService.getLocation($routeParams.id);
    let locationName = LocationService.calculateLocationName(location);
    self.backpath = '/locations/ ' + location.$loki + '/view';

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_locations',
      href: '/locations/params/focus=locations_' + location.$loki
    });
    self.breadcrumbitems.push({
      label: locationName,
      href: self.backpath
    });
    self.breadcrumbitems.push({
      label: 'common_events'
    });

    self.id = location.$loki;
    self.lastsave = location.lastsave;
    self.pageheadertitle = locationName;
    self.profileimage = location.profileimage;
  };

  self.edit = function(eventid) {
    $location.path('/locations/' + $routeParams.id + '/events/' + eventid);
  };

  self.insert = function() {
    $location.path('/locations/' + $routeParams.id + '/events/new');
  };
}
