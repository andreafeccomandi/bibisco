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
  component('maincharacterdetail', {
    templateUrl: 'components/characters/main-character-detail.html',
    controller: MainCharacterDetailController
  });

function MainCharacterDetailController($injector, $location, $rootScope, $routeParams, $scope, $window, hotkeys,
  ChapterService, MainCharacterService, PopupBoxesService, SupporterEditionChecker, UtilService) {

  let self = this;
  let GroupService = null;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    self.maincharacter = self.getMainCharacter(parseInt($routeParams.id.split('?')[0]));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!self.maincharacter) {
      $window.history.back();
      return;
    }

    $rootScope.$emit('SHOW_ELEMENT_DETAIL');
    
    self.deleteforbidden = self.isDeleteForbidden();
    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters'
    });
    self.breadcrumbitems.push({
      label: self.maincharacter.name
    });

    // action items
    self.actionitems = [];
    self.actionitems.push({
      label: 'jsp.character.button.updateTitle',
      itemfunction: self.changeTitle
    });
    self.actionitems.push({
      label: 'jsp.common.button.delete',
      itemfunction: function () {
        if (self.deleteforbidden) {
          PopupBoxesService.alert('jsp.characters.delete.ko');
        } else {
          PopupBoxesService.confirm(self.delete, 'jsp.characters.delete.confirm');
        }
      }
    });

    // tags
    self.tags = [];
    if (SupporterEditionChecker.isSupporterOrTrial()) {
      let elementGroups = self.getGroupService().getElementGroups('maincharacter', self.maincharacter.$loki);
      for (let i = 0; i < elementGroups.length; i++) {
        let group = elementGroups[i];
        self.tags.push({label: group.name, color: group.color});
      }
    }
    
    self.editmode = false;
  };

  self.changeStatus = function(status) {
    self.maincharacter.status = status;
    MainCharacterService.update(self.maincharacter);
  };

  self.changeTitle = function() {
    $location.path('/maincharacters/' + self.maincharacter.$loki + '/title');
  };

  self.delete = function() {
    MainCharacterService.remove(self.maincharacter.$loki);
    $window.history.back();
  };

  self.getGroupService = function () {
    if (!GroupService) {
      GroupService = $injector.get('GroupService');
    }
    return GroupService;
  };

  self.getMainCharacter = function(id) {
    return MainCharacterService.getMainCharacter(id);
  };

  self.showeventsfunction = function() {
    $location.path('/maincharacters/' + self.maincharacter.$loki + '/events');
  };

  self.showimagesfunction = function() {
    $location.path('/maincharacters/' + self.maincharacter.$loki + '/images');
  };

  self.showInfoWithQuestion = function(id) {
    if (id==='custom') {
      SupporterEditionChecker.filterAction(function () {
        $location.path('/maincharacters/' + self.maincharacter.$loki +
      '/infowithquestion/' + id + '/view');
      });
    } else {
      $location.path('/maincharacters/' + self.maincharacter.$loki +
        '/infowithquestion/' + id + '/view');
    }
  };

  self.showInfoWithoutQuestion = function (id) {
    $location.path('/maincharacters/' + self.maincharacter.$loki +
      '/infowithoutquestion/' + id + '/view');
  };

  self.isDeleteForbidden = function () {

    let deleteForbidden = false;
    let id = 'm_' + self.maincharacter.$loki;
    let chapters = ChapterService.getChaptersWithPrologueAndEpilogue();
    for (let i = 0; i < chapters.length && !deleteForbidden; i++) {
      let scenes = ChapterService.getScenes(chapters[i].$loki);
      for (let j = 0; j < scenes.length && !deleteForbidden; j++) {
        let revisions = scenes[j].revisions;
        for (let h = 0; h < revisions.length && !deleteForbidden; h++) {
          if (UtilService.array.contains(revisions[h].scenecharacters, id) ||
            revisions[h].povcharacterid === id) {
            deleteForbidden = true;
          }
        }
      }
    }

    return deleteForbidden;
  };

  self.addprofileimage = function() {
    $location.path('/maincharacters/' + self.maincharacter.$loki + '/images/addprofile');
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
      $location.path('/maincharacters/' + self.maincharacter.$loki + '/groupsmembership');
    });
  };
}
