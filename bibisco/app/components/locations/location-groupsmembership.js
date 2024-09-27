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
  component('locationgroupsmembership', {
    templateUrl: 'components/locations/location-groupsmembership.html',
    controller: LocationGroupsmembershipController
  });

function LocationGroupsmembershipController($routeParams, $window, LocationService) {

  let self = this;

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
      href: '/locations'
    });
    self.breadcrumbitems.push({
      label: locationName,
      href: '/locations/ ' + location.$loki + '/default'
    });
    self.breadcrumbitems.push({
      label: 'groups_membership'
    });

    self.id = location.$loki;
    self.pageheadertitle = locationName;
    self.profileimage = location.profileimage;
  };
}
