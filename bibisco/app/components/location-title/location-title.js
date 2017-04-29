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
  templateUrl: 'components/location-title/location-title.html',
  controller: LocationTitleController
});

function LocationTitleController($location, $rootScope, $routeParams,
  LoggerService) {
  LoggerService.debug('Start LocationTitleController...');

  var self = this;
  self.nation = null;
  self.state = null;

  // hide menu
  $rootScope.$emit('SHOW_LOCATION_TITLE');

  if ($routeParams.operation == 'edit') {

  }

  self.save = function(isValid) {
    if (isValid) {
      alert('Nation=' + self.nation + ' State=' + self.state);
      $location.path('/project/locations');
    }
  }

  self.back = function() {
    $location.path('/project/locations');
  }

  LoggerService.debug('End LocationTitleController...');
}
