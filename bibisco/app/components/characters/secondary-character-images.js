/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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
  component('secondarycharacterimages', {
    templateUrl: 'components/characters/secondary-character-images.html',
    controller: SecondaryCharacterImagesController
  });

function SecondaryCharacterImagesController($location, $routeParams, $window, SecondaryCharacterService) {

  var self = this;

  self.$onInit = function() {
    
    self.breadcrumbitems = [];
    let secondaryCharacter = SecondaryCharacterService.getSecondaryCharacter(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!secondaryCharacter) {
      $window.history.back();
      return;
    }

    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters/params/focus=secondarycharacters_' + secondaryCharacter.$loki
    });
    self.breadcrumbitems.push({
      label: secondaryCharacter.name,
      href: '/secondarycharacters/ ' + secondaryCharacter.$loki + '/view'
    });
    self.breadcrumbitems.push({
      label: 'common_characters_images'
    });

    self.images = secondaryCharacter.images;
    self.selectedimage = secondaryCharacter.profileimage;
    self.lastsave = secondaryCharacter.lastsave;
    self.pageheadertitle = secondaryCharacter.name;
  };

  self.delete = function(filename) {
    let secondaryCharacter = SecondaryCharacterService.deleteImage(parseInt($routeParams.id), filename);
    self.images = secondaryCharacter.images;
    self.selectedimage = secondaryCharacter.profileimage;
  };

  self.insert = function() {
    $location.path('/secondarycharacters/' + $routeParams.id + '/images/new');
  };

  self.select = function(filename) {
    SecondaryCharacterService.setProfileImage(parseInt($routeParams.id), filename);
    self.selectedimage = filename;
  };
}
