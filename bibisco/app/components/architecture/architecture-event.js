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
  component('architectureevent', {
    templateUrl: 'components/architecture/architecture-event.html',
    controller: ArchitectureEventController
  });

function ArchitectureEventController($routeParams, ArchitectureService) {

  var self = this;

  self.$onInit = function() {

    self.edit = $routeParams.eventid !== undefined ? true : false;
      
    let architectureitem = ArchitectureService.getArchitectureItem($routeParams.id);

    // breadcrumb
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_architecture',
      href: '/architecture/params/focus=architecture_' + $routeParams.id
    });
    self.breadcrumbitems.push({
      label: architectureitem.title,
      href: '/architectureitems/' + $routeParams.id + '/view'
    });
    self.breadcrumbitems.push({
      label: 'common_events',
      href: '/architectureitems/' + $routeParams.id + '/events'
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

    self.id=$routeParams.id;
    self.eventid=$routeParams.eventid;
    self.exitpath = '/architectureitems/' + $routeParams.id + '/events';
  };
}
