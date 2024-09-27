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
  component('locationcreate', {
    templateUrl: 'components/locations/location-create.html',
    controller: LocationCreateController
  });

function LocationCreateController($injector, $location, $rootScope, $routeParams, $scope, $window, hotkeys, 
  BibiscoPropertiesService, ChapterService, LocationService, PopupBoxesService, SupporterEditionChecker) {
  let self = this;
  let GroupService = null;

  self.$onInit = function() {

    // hide menu
    $rootScope.$emit('SHOW_ELEMENT_TITLE');

    // common breadcrumb root
    self.breadcrumbitems = [];
    self.showdetailaftercreation = false;

    // creation from locations
    self.creationFromLocations = $location.path().startsWith('/locations') ? true : false;
    if (self.creationFromLocations) {
      self.breadcrumbitems.push({
        label: 'common_locations',
        href: '/locations'
      });
      self.showdetailaftercreation = BibiscoPropertiesService.getProperty('showElementAfterInsertion') === 'true';
    }

    // creation from scene tags
    self.creationFromSceneTags = $location.path().includes('tags') ? true : false;
    if (self.creationFromSceneTags) {
      self.chapter = ChapterService.getChapter(parseInt($routeParams.chapterid));
      self.scene = ChapterService.getScene(parseInt($routeParams.sceneid));
      // If we get to the page using the back button it's possible that the scene has been deleted or moved to another chapter. Let's go back again.
      if (!self.chapter || !self.scene || self.chapter.$loki !== self.scene.chapterid) {
        $window.history.back();
        return;
      }
      self.createBreadcrumbitemsForSceneTags();
    }

    // creation from group members
    self.creationFromGroupMembers = $location.path().startsWith('/groups') ? true : false;
    if (self.creationFromGroupMembers) {
      self.group = self.getGroupService().getGroup($routeParams.id);
      // If we get to the page using the back button it's possible that the scene has been deleted or moved to another chapter. Let's go back again.
      if (!self.group) {
        $window.history.back();
        return;
      }
      self.createBreadcrumbitemsForGroupMembers(); 
    }

    // create breadcrumb items
    self.breadcrumbitems.push({
      label: 'jsp.locations.dialog.title.createLocation'
    });

    self.nation = null;
    self.state = null;
    self.city = null;
    self.location = null;
      
    // groups
    self.groupsmembership = null;
    if (SupporterEditionChecker.isSupporterOrTrial()) {
      self.initGroupsMembership();
    }

    self.pageheadertitle = 'jsp.locations.dialog.title.createLocation';
    self.profileimageenabled = false;
    
    self.usednations = LocationService.getUsedNations();
    self.usedstates = LocationService.getUsedStates();
    self.usedcities = LocationService.getUsedCities();

    self.deregisterInsertElementListener = $rootScope.$on('INSERT_ELEMENT', function (event, args) {
      if (self.showdetailaftercreation) {
        $location.path('/locations/' + args.id + '/default').replace();
      } else {
        $window.history.back();
      }     
    });

    self.checkExit = {
      active: true
    };

    hotkeys.bindTo($scope)
      .add({
        combo: ['enter', 'enter'],
        description: 'enter',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'],
        callback: function ($event) {
          $event.preventDefault();
          $scope.locationCreateForm.$submitted = true;
          self.save($scope.locationCreateForm.$valid);
        }
      });
  };

  self.createBreadcrumbitemsForSceneTags = function() {
    self.breadcrumbitems.push({
      label: 'common_chapters',
      href: '/chapters'
    });
  
    self.breadcrumbitems.push({
      label: ChapterService.getChapterPositionDescription(self.chapter.position) + ' ' + self.chapter.title,
      href: '/chapters/' + self.chapter.$loki
    });
    self.breadcrumbitems.push({
      label: self.scene.title,
      href: '/chapters/' + self.chapter.$loki + '/scenes/' + self.scene.$loki + '/default'
    });
    self.breadcrumbitems.push({
      label: 'jsp.scene.title.tags'
    });
  };

  self.createBreadcrumbitemsForGroupMembers = function() {
    self.breadcrumbitems.push({
      label: 'groups',
      href: '/groups'
    });
    self.breadcrumbitems.push({
      label: self.group.name,
      href: '/groups/' + self.group.$loki + '/default'
    });
    self.breadcrumbitems.push({
      label: 'group_members_title',
      href: '/groups/' + self.group.$loki + '/members'
    });
  };

  self.initGroupsMembership = function() {
    
    self.groupsmembership = [];
    let groups = self.getGroupService().getGroups();
    for (let i = 0; i < groups.length; i++) {
      let selected = (self.group && self.group.$loki === groups[i].$loki) ? true : false;
      self.groupsmembership.push({
        id: groups[i].$loki,
        name: groups[i].name,
        selected: selected
      });
    }
    
    // sort by name
    self.groupsmembership.sort(function(a, b) {
      return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
    });
  };

  self.toggleGroup = function(id) {
    for (let i = 0; i < self.groupsmembership.length; i++) {
      if (self.groupsmembership[i].id ===  id) {
        self.groupsmembership[i].selected = !self.groupsmembership[i].selected;
        break;
      }
    }
  };

  self.getGroupService = function () {
    if (!GroupService) {
      GroupService = $injector.get('GroupService');
    }
    return GroupService;
  },

  self.save = function(isValid) {
    if (isValid) {

      let location = LocationService.insert({
        city: self.city,
        description: '',
        location: self.location,
        nation: self.nation,
        state: self.state,
      });
      if (SupporterEditionChecker.isSupporterOrTrial()) {
        let selectedgroups = [];
        if (self.groupsmembership && self.groupsmembership.length > 0) {
          for (let i = 0; i < self.groupsmembership.length; i++) {
            if(self.groupsmembership[i].selected) {
              selectedgroups.push(self.groupsmembership[i].id);
            }
          }
        }
        self.getGroupService().addElementToGroups('location', location.$loki, selectedgroups);
      }
      if (self.creationFromSceneTags) {
        self.scene.revisions[self.scene.revision].locationid = location.$loki;
        ChapterService.updateScene(self.scene);
      }
      
      self.checkExit = {
        active: false
      };
    }
  };

  self.$onDestroy = function () {
    self.deregisterInsertElementListener();
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.locationCreateForm.$dirty, self.checkExit);
  });
}
