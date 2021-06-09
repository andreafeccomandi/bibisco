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
  component('locationevent', {
    templateUrl: 'components/locations/location-event.html',
    controller: LocationEventController
  });

function LocationEventController($routeParams, LocationService) {

  var self = this;

  self.$onInit = function() {
    
    self.edit = $routeParams.eventid !== undefined ? true : false;
      
    let location = LocationService.getLocation($routeParams.id);
    let locationName = LocationService.calculateLocationName(location);

    // breadcrumb
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_locations',
      href: '/locations/params/focus=locations_' + location.$loki
    });
    self.breadcrumbitems.push({
      label: locationName,
      href: '/locations/ ' + location.$loki + '/view'
    });
    self.breadcrumbitems.push({
      label: 'common_events',
      href: '/locations/ ' + location.$loki + '/events'
    });
    
    if (self.edit) {
      self.breadcrumbitems.push({
        label: 'events_edit_event_title'
      });
    } else {
      self.breadcrumbitems.push({
        label: 'events_add_event_title'
      });
    }

    self.profileimage = location.profileimage;
    self.id=$routeParams.id;
    self.eventid=$routeParams.eventid;
    self.exitpath = '/locations/' + $routeParams.id + '/events';
  };
}
