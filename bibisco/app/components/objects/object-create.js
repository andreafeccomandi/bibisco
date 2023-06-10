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
  component('objectcreate', {
    templateUrl: 'components/objects/object-create.html',
    controller: ObjectCreateController
  });

function ObjectCreateController ($location, $routeParams, $window, ChapterService, GroupService, ObjectService) {
  let self = this;

  self.$onInit = function() {

    // common breadcrumb root
    self.breadcrumbitems = [];

    self.groupids = [];

    // creation from objects
    self.creationFromObjects = $location.path().startsWith('/objects') ? true : false;
    if (self.creationFromObjects) {
      self.breadcrumbitems.push({
        label: 'objects',
        href: '/objects'
      });
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
      self.group = GroupService.getGroup($routeParams.id);
      // If we get to the page using the back button it's possible that the scene has been deleted or moved to another chapter. Let's go back again.
      if (!self.group) {
        $window.history.back();
        return;
      }
      self.groupids.push(self.group.$loki);
      self.createBreadcrumbitemsForGroupMembers();
    }

    // create breadcrumb objects
    self.breadcrumbitems.push({
      label: 'object_create_title'
    });

    self.profileimageenabled = false;
    self.name = null;
    self.pageheadertitle = 'object_create_title';
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
      href: '/chapters/' + self.chapter.$loki + '/scenes/' + self.scene.$loki + '/view'
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
      href: '/groups/' + self.group.$loki + '/view'
    });
    self.breadcrumbitems.push({
      label: 'group_members_title',
      href: '/groups/' + self.group.$loki + '/members'
    });
  };

  self.save = function(title, groupids) {
    let object = ObjectService.insert({
      description: '',
      name: title
    });
    if (groupids) {
      GroupService.addElementToGroups('object', object.$loki, groupids);
    }
    if (self.creationFromSceneTags) {
      self.scene.revisions[self.scene.revision].sceneobjects.push(object.$loki);
      ChapterService.updateScene(self.scene);
    }
  };
}