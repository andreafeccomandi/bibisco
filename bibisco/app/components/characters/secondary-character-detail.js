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
  component('secondarycharacterdetail', {
    templateUrl: 'components/characters/secondary-character-detail.html',
    controller: SecondaryCharacterDetailController
  }); 

function SecondaryCharacterDetailController($injector, $location, $routeParams, $scope, $timeout, $window, 
  hotkeys, ChapterService, NavigationService, PopupBoxesService, ProjectService, SecondaryCharacterService, 
  SupporterEditionChecker, UtilService) {

  let self = this;
  let GroupService = null;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    self.secondarycharacter = self.getSecondaryCharacter(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!self.secondarycharacter) {
      $window.history.back();
      return;
    }

    self.mode = NavigationService.calculateMode($routeParams.mode); 
    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters'
    });
    self.breadcrumbitems.push({
      label: self.secondarycharacter.name
    });

    self.deleteforbidden = self.isDeleteForbidden();

    // tags
    self.tags = [];
    if (SupporterEditionChecker.isSupporterOrTrial()) {
      let elementGroups = self.getGroupService().getElementGroups('secondarycharacter', self.secondarycharacter.$loki);
      for (let i = 0; i < elementGroups.length; i++) {
        let group = elementGroups[i];
        self.tags.push({label: group.name, color: group.color});
      }
    }
  };


  self.addprofileimage = function() {
    $location.path('/secondarycharacters/' + self.secondarycharacter.$loki + '/images/addprofile');
  };

  self.changeStatus = function(status) {
    self.secondarycharacter.status = status;
    SecondaryCharacterService.update(self.secondarycharacter);
  };

  self.changeTitle = function() {
    $location.path('/secondarycharacters/' + self.secondarycharacter
      .$loki + '/title');
  };

  self.delete = function() {
    SecondaryCharacterService.remove(self.secondarycharacter.$loki);
    $window.history.back();
  };

  self.edit = function () {
    $location.path('/secondarycharacters/ ' + self.secondarycharacter.$loki + '/edit').replace();
  };

  self.read = function () {
    $location.path('/secondarycharacters/ ' + self.secondarycharacter.$loki + '/view').replace();
  };

  self.getGroupService = function () {
    if (!GroupService) {
      GroupService = $injector.get('GroupService');
    }
    return GroupService;
  };

  self.getSecondaryCharacter = function(id) {
    return SecondaryCharacterService.getSecondaryCharacter(id);
  };

  self.savefunction = function() {
    SecondaryCharacterService.update(self.secondarycharacter);
  };

  self.showeventsfunction = function() {
    $location.path('/secondarycharacters/' + self.secondarycharacter.$loki + '/events');
  };

  self.showimagesfunction = function() {
    $location.path('/secondarycharacters/' + self.secondarycharacter.$loki + '/images');
  };

  self.isDeleteForbidden = function() {

    let deleteForbidden = false;
    let id = 's_' + self.secondarycharacter.$loki;
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

  hotkeys.bindTo($scope)
    .add({
      combo: ['ctrl+shift+m', 'command+shift+m'],
      description: 'groupsmembership',
      callback: function () {
        self.managegroupsmembership();
      }
    });

  self.managegroupsmembership = function() {
    SupporterEditionChecker.filterAction(function () {
      $location.path('/secondarycharacters/' + self.secondarycharacter.$loki + '/groupsmembership');
    });
  };

  self.transformIntoMain = function() {

    let executeTransformationFunction = function() {
      $timeout(function() {            
        let maincharacter = SecondaryCharacterService.transformIntoMain(self.secondarycharacter.$loki);
        $location.path('/maincharacters/' + maincharacter.$loki);
      });   
    };

    let backupAndExecuteTransformationFunction = function() {
      ProjectService.executeBackup({
        backupFileSuffix: 'BEFORE_SECONDARY_2_MAIN',
        showWaitingModal: true,
        callback: executeTransformationFunction
      });
    };

    SupporterEditionChecker.filterAction(function () {
      PopupBoxesService.confirm(function() {
        PopupBoxesService.confirm(backupAndExecuteTransformationFunction, 
          'backup_before_transformation_confirm', executeTransformationFunction);
      }, 'transformation_secondary_to_main_confirm');
    });
  };
}
