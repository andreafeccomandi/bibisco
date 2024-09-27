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
  component('groupevent', {
    templateUrl: 'components/groups/group-event.html',
    controller: GroupEventController
  });

function GroupEventController($routeParams, $window, GroupService) {

  var self = this;

  self.$onInit = function() {
    
    self.edit = $routeParams.eventid !== undefined ? true : false;
      
    self.breadcrumbitems = [];
    let group = GroupService.getGroup(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!group) {
      $window.history.back();
      return;
    }

    // breadcrumb
    self.breadcrumbitems.push({
      label: 'groups',
      href: '/groups'
    });
    self.breadcrumbitems.push({
      label: group.name,
      href: '/groups/' + group.$loki + '/default'
    });
    self.breadcrumbitems.push({
      label: 'common_events',
      href: '/groups/' + group.$loki + '/events'
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

    self.profileimage = group.profileimage;
    self.id=parseInt($routeParams.id);
    self.eventid=$routeParams.eventid;
  };
}
