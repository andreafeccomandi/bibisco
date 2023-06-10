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
  component('groupimages', {
    templateUrl: 'components/groups/group-images.html',
    controller: GroupImagesController
  });

function GroupImagesController($location, $routeParams, $window, GroupService) {

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
      href: '/groups/' + group.$loki + '/view'
    });
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.select.location.images'
    });

    self.images = group.images;
    self.selectedimage = group.profileimage;
    self.lastsave = group.lastsave;
    self.pageheadertitle = group.name;
  };

  self.delete = function(filename) {
    let group = GroupService.deleteImage(parseInt($routeParams.id), filename);
    self.images = group.images;
    self.selectedimage = group.profileimage;
  };

  self.insert = function() {
    $location.path('/groups/' + $routeParams.id + '/images/new');
  };

  self.select = function(filename) {
    GroupService.setProfileImage(parseInt($routeParams.id), filename);
    self.selectedimage = filename;
  };
}
