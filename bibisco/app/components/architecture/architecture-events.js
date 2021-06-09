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
  component('architectureevents', {
    templateUrl: 'components/architecture/architecture-events.html',
    controller: ArchitectureEventsController
  });

function ArchitectureEventsController($location, $routeParams,
  ArchitectureService) {

  var self = this;

  self.$onInit = function() {
    
    let architectureitem = ArchitectureService.getArchitectureItem($routeParams.id);
    self.backpath = '/architectureitems/' + $routeParams.id + '/view';

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_architecture',
      href: '/architecture/params/focus=architecture_' + $routeParams.id
    });
    self.breadcrumbitems.push({
      label: architectureitem.title,
      href: self.backpath
    });
    self.breadcrumbitems.push({
      label: 'common_events'
    });

    self.id=$routeParams.id;
    self.lastsave = architectureitem.lastsave;
    self.pageheadercustomtitle = 'common_events';
  };

  self.edit = function(eventid) {
    $location.path('/architectureitems/' + $routeParams.id + '/events/' + eventid);
  };

  self.insert = function() {
    $location.path('/architectureitems/' + $routeParams.id + '/events/new');
  };
}
