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
  component('stranddetail', {
    templateUrl: 'components/strands/strand-detail.html',
    controller: StrandDetailController
  });

function StrandDetailController($injector, $location, $routeParams, $scope, $window, hotkeys,
  ChapterService, StrandService, SupporterEditionChecker, UtilService) {

  let self = this;
  let GroupService = null;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    self.strand = self.getStrand(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!self.strand) {
      $window.history.back();
      return;
    }
    
    self.mode = $routeParams.mode;
    self.breadcrumbitems.push({
      label: 'common_architecture',
      href: '/architecture'
    });
    self.breadcrumbitems.push({
      label: self.strand.name
    });

    self.deleteforbidden = self.isDeleteForbidden();

    // tags
    self.tags = [];
    if (SupporterEditionChecker.isSupporterOrTrial()) {
      let elementGroups = self.getGroupService().getElementGroups('strand', self.strand.$loki);
      for (let i = 0; i < elementGroups.length; i++) {
        let group = elementGroups[i];
        self.tags.push({label: group.name, color: group.color});
      }
    }
  };

  self.changeStatus = function(status) {
    self.strand.status = status;
    StrandService.update(self.strand);
  };

  self.changeTitle = function() {
    $location.path('/strands/' + self.strand.$loki + '/title');
  };

  self.delete = function() {
    StrandService.remove(self.strand.$loki);
    $window.history.back();
  };

  self.edit = function () {
    $location.path('/strands/ ' + self.strand.$loki + '/edit');
  };

  self.getGroupService = function () {
    if (!GroupService) {
      GroupService = $injector.get('GroupService');
    }
    return GroupService;
  };

  self.getStrand = function(id) {
    return StrandService.getStrand(id);
  };

  self.savefunction = function() {
    StrandService.update(self.strand);
  };

  self.isDeleteForbidden = function () {

    let deleteForbidden = false;
    let id = self.strand.$loki;
    let chapters = ChapterService.getChaptersWithPrologueAndEpilogue();
    for (let i = 0; i < chapters.length && !deleteForbidden; i++) {
      let scenes = ChapterService.getScenes(chapters[i].$loki);
      for (let j = 0; j < scenes.length && !deleteForbidden; j++) {
        let revisions = scenes[j].revisions;
        for (let h = 0; h < revisions.length && !deleteForbidden; h++) {
          if (UtilService.array.contains(revisions[h].scenestrands, id)) {
            deleteForbidden = true;
          }
        }
      }
    }

    return deleteForbidden;
  };

  hotkeys.bindTo($scope)
    .add({
      combo: ['ctrl+m', 'command+m'],
      description: 'groupsmembership',
      callback: function () {
        self.managegroupsmembership();
      }
    });

  self.managegroupsmembership = function() {
    SupporterEditionChecker.filterAction(function () {
      $location.path('/strands/' + self.strand.$loki + '/groupsmembership');
    });
  };
}
