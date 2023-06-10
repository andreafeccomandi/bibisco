/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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
  component('grouptitle', {
    templateUrl: 'components/groups/group-title.html',
    controller: GroupTitleController
  });

function GroupTitleController($routeParams, $window, GroupService) {

  let self = this;

  self.$onInit = function() {
    
    let group = GroupService.getGroup(parseInt($routeParams.id));
  
    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!group) {
      $window.history.back();
      return;
    }

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'groups',
      href: '/groups'
    });

    // edit breadcrumb groups
    self.breadcrumbitems.push({
      label: group.name,
      href: '/groups/' + group.$loki + '/view'
    });
    self.breadcrumbitems.push({
      label: 'group_change_name_title'
    });

    self.profileimageenabled = true;
    self.profileimage = group.profileimage;
    self.name = group.name;
    self.pageheadertitle = 'group_change_name_title';
    
  };

  self.save = function(title) {
    let group = GroupService.getGroup(parseInt($routeParams.id));
    group.name = title;
    GroupService.update(group);
  };
}
