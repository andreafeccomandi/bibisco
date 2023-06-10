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
  component('maincharactercreate', {
    templateUrl: 'components/characters/main-character-create.html',
    controller: MainCharacterCreateController
  });

function MainCharacterCreateController($injector, $location, $routeParams, $window, 
  ChapterService, MainCharacterService, SupporterEditionChecker) {
  let self = this;
  let GroupService = null;

  self.$onInit = function() {

    // common breadcrumb root
    self.breadcrumbitems = [];

    self.groupids = [];

    // creation from characters
    self.creationFromCharacters = $location.path().startsWith('/maincharacters') ? true : false;
    if (self.creationFromCharacters) {
      self.breadcrumbitems.push({
        label: 'common_characters',
        href: '/characters'
      });
    }

    // creation from scene tags
    self.creationFromSceneTags = $location.path().startsWith('/chapters') ? true : false;
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

    // create breadcrumb items
    self.breadcrumbitems.push({
      label: 'jsp.characters.dialog.title.createMainCharacter'
    });

    self.profileimageenabled = false;
    self.name = null;
    self.pageheadertitle = 'jsp.characters.dialog.title.createMainCharacter';
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
      href: '/groups/' + self.group.$loki + '/view'
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
    let maincharacter = MainCharacterService.insert({
      description: '',
      name: title
    });
    if (SupporterEditionChecker.isSupporterOrTrial() && groupids) {
      self.getGroupService().addElementToGroups('maincharacter', maincharacter.$loki, groupids);
    }
    if (self.creationFromSceneTags) {
      if ($location.path().includes('scenecharacters')) {
        self.scene.revisions[self.scene.revision].scenecharacters.push('m_' + maincharacter.$loki);
      } else if ($location.path().includes('povcharacter')) {
        self.scene.revisions[self.scene.revision].povcharacterid = 'm_' + maincharacter.$loki;
      }
      ChapterService.updateScene(self.scene);
    }
  };
}
