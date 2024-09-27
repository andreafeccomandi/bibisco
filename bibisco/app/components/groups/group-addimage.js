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
  component('groupaddimage', {
    templateUrl: 'components/groups/group-addimage.html',
    controller: GroupAddImageController
  });

function GroupAddImageController($location, $routeParams, $window,
  BibiscoPropertiesService, GroupService, PopupBoxesService) {

  var self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    let group = GroupService.getGroup(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!group) {
      $window.history.back();
      return;
    }

    // addprofile mode
    self.addprofile = $location.path().includes('addprofile');

    // breadcrumb
    self.breadcrumbitems.push({
      label: 'groups',
      href: '/groups'
    });
    self.breadcrumbitems.push({
      label: group.name,
      href: '/groups/' + group.$loki + '/default'
    });

    if (self.addprofile) {
      self.breadcrumbitems.push({
        label: 'add_profile_image_title'
      });
  
      self.customtitle = 'add_profile_image_title';
    }
    else {
      self.breadcrumbitems.push({
        label: 'common_images',
        href: '/groups/' + group.$loki + '/images'
      });
      self.breadcrumbitems.push({
        label: 'add_image'
      });

      self.customtitle = null;
    }

  };

  self.save = function(name, path) {
    let filename = GroupService.addImage(parseInt($routeParams.id), name, path);
    if (self.addprofile) {
      GroupService.setProfileImage(parseInt($routeParams.id), filename);
      if (BibiscoPropertiesService.getProperty('addProfileImageTip') === 'true') {
        PopupBoxesService.showTip('addProfileImageTip');
      }
    }
  };
}
