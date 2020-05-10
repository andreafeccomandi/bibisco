/*
 * Copyright (C) 2014-2020 Andrea Feccomandi
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

function SecondaryCharacterDetailController($location, $rootScope, $routeParams, 
  ChapterService, SecondaryCharacterService, UtilService) {

  var self = this;

  self.$onInit = function() {

    self.secondarycharacter = self.getSecondaryCharacter($routeParams.id);
    self.mode = $routeParams.mode;
    let backpath = '/characters/params/focus=secondarycharacters_' + self.secondarycharacter.$loki;

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_characters',
      href: backpath
    });
    self.breadcrumbitems.push({
      label: self.secondarycharacter.name
    });

    self.deleteforbidden = self.isDeleteForbidden();

    if (self.mode === 'view') {
      self.backpath = backpath;
    }
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
    SecondaryCharacterService.remove(self.secondarycharacter
      .$loki);
    $location.path('/characters');
  };

  self.edit = function () {
    $location.path('/secondarycharacters/ ' + self.secondarycharacter.$loki + '/edit');
  };

  self.getSecondaryCharacter = function(id) {
    return SecondaryCharacterService.getSecondaryCharacter(id);
  };

  self.savefunction = function() {
    SecondaryCharacterService.update(self.secondarycharacter);
  };

  self.showimagesfunction = function() {
    $location.path('/secondarycharacters/' + self.secondarycharacter.$loki + '/images');
  };

  self.isDeleteForbidden = function() {

    let deleteForbidden = false;
    let id = 's_' + self.secondarycharacter.$loki;
    let chapters = ChapterService.getChapters();
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
}
