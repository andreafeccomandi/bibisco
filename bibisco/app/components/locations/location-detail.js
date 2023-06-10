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
  component('locationdetail', {
    templateUrl: 'components/locations/location-detail.html',
    controller: LocationDetailController
  });

function LocationDetailController($injector, $location, $routeParams, $scope, $window, hotkeys,
  ChapterService, LocationService, SupporterEditionChecker) {

  let self = this;
  let GroupService = null;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    self.location = self.getLocation(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!self.location) {
      $window.history.back();
      return;
    }

    self.mode = $routeParams.mode;
    self.name = LocationService.calculateLocationName(self.location);
    
    self.breadcrumbitems.push({
      label: 'common_locations',
      href: '/locations'
    });
    self.breadcrumbitems.push({
      label: self.name
    });
  
    self.deleteforbidden = self.isDeleteForbidden();

    // tags
    self.tags = [];
    if (SupporterEditionChecker.isSupporterOrTrial()) {
      let elementGroups = self.getGroupService().getElementGroups('location', self.location.$loki);
      for (let i = 0; i < elementGroups.length; i++) {
        let group = elementGroups[i];
        self.tags.push({label: group.name, color: group.color});
      }
    }

    hotkeys.bindTo($scope)
      .add({
        combo: ['ctrl+m', 'command+m'],
        description: 'groupsmembership',
        callback: function () {
          self.managegroupsmembership();
        }
      });
  };

  self.changeStatus = function(status) {
    self.location.status = status;
    LocationService.update(self.location);
  };

  self.changeTitle = function() {
    $location.path('/locations/' + self.location.$loki + '/title');
  };

  self.delete = function() {
    LocationService.remove(self.location.$loki);
    $window.history.back();
  };

  self.edit = function () {
    $location.path('/locations/ ' + self.location.$loki + '/edit');
  };

  self.getGroupService = function () {
    if (!GroupService) {
      GroupService = $injector.get('GroupService');
    }
    return GroupService;
  };

  self.getLocation = function(id) {
    return LocationService.getLocation(id);
  };

  self.savefunction = function() {
    LocationService.update(self.location);
  };

  self.showeventsfunction = function() {
    $location.path('/locations/' + self.location.$loki + '/events');
  };

  self.showimagesfunction = function() {
    $location.path('/locations/' + self.location.$loki + '/images');
  };

  self.isDeleteForbidden = function () {

    let deleteForbidden = false;
    let id = self.location.$loki;
    let chapters = ChapterService.getChaptersWithPrologueAndEpilogue();
    for (let i = 0; i < chapters.length && !deleteForbidden; i++) {
      let scenes = ChapterService.getScenes(chapters[i].$loki);
      for (let j = 0; j < scenes.length && !deleteForbidden; j++) {
        let revisions = scenes[j].revisions;
        for (let h = 0; h < revisions.length && !deleteForbidden; h++) {
          if (revisions[h].locationid === id) {
            deleteForbidden = true;
          }
        }
      }
    }

    return deleteForbidden;
  };
  self.addprofileimage = function() {
    $location.path('/locations/' + self.location.$loki + '/images/addprofile');
  };


  self.managegroupsmembership = function() {
    SupporterEditionChecker.filterAction(function () {
      $location.path('/locations/' + self.location.$loki + '/groupsmembership');
    });
  };
}
