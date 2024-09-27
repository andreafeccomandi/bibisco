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
  component('strandcreate', {
    templateUrl: 'components/strands/strand-create.html',
    controller: StrandCreateController
  });

function StrandCreateController($injector, $location, $routeParams, $window, 
  BibiscoPropertiesService, ChapterService, StrandService) {

  let self = this;
  let GroupService = null;

  self.$onInit = function() {

    // common bradcrumb root
    self.breadcrumbitems = [];

    self.groupids = [];
    self.showdetailaftercreation = false;
    self.elementbasepath = null;

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
      self.groupids.push(self.group.$loki);
      self.createBreadcrumbitemsForGroupMembers();
    }

    // creation from architecture
    self.creationFromArchitecture = $location.path().startsWith('/strands') ? true : false;
    if (self.creationFromArchitecture) {
      self.breadcrumbitems.push({
        label: 'common_architecture',
        href: '/architecture'
      });

      self.showdetailaftercreation = BibiscoPropertiesService.getProperty('showElementAfterInsertion') === 'true';
      self.elementbasepath = '/strands/';
    }

    // create breadcrumb items
    self.breadcrumbitems.push({
      label: 'jsp.architecture.strand.dialog.title.createStrand'
    });
    self.name = null;
    self.pageheadertitle = 'jsp.architecture.strand.dialog.title.createStrand';
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
      label: 'jsp.scene.title.tags',
      href: '/chapters/' + self.chapter.$loki + '/scenes/' + self.scene.$loki + '/tags'
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

  self.getGroupService = function () {
    if (!GroupService) {
      GroupService = $injector.get('GroupService');
    }
    return GroupService;
  },

  self.save = function(title, groupids) {
    let strand = StrandService.insert({
      description: '',
      name: title
    });
    if (groupids) {
      self.getGroupService().addElementToGroups('strand', strand.$loki, groupids);
    }
    if (self.creationFromSceneTags) {
      self.scene.revisions[self.scene.revision].scenestrands.push(strand.$loki);
      ChapterService.updateScene(self.scene);
    }
  };
}
