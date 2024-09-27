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
  component('groupevents', {
    templateUrl: 'components/groups/group-events.html',
    controller: GroupEventsController
  });

function GroupEventsController($location, $routeParams, $window,
  GroupService) {

  var self = this;

  self.$onInit = function() {
    
    self.breadcrumbitems = [];
    let group = GroupService.getGroup(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!group) {
      $window.history.back();
      return;
    }

    self.breadcrumbitems.push({
      label: 'groups',
      href: '/groups'
    });
    self.breadcrumbitems.push({
      label: group.name,
      href: '/groups/ ' + group.$loki + '/default'
    });
    self.breadcrumbitems.push({
      label: 'common_events'
    });

    self.id = group.$loki;
    self.lastsave = group.lastsave;
    self.pageheadertitle = group.name;
    self.profileimage = group.profileimage;
  };

  self.edit = function(eventid) {
    $location.path('/groups/' + $routeParams.id + '/events/' + eventid);
  };

  self.insert = function() {
    $location.path('/groups/' + $routeParams.id + '/events/new');
  };
}
