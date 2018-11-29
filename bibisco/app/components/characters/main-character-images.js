/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  component('maincharacterimages', {
    templateUrl: 'components/characters/main-character-images.html',
    controller: MainCharacterImagesController
  });

function MainCharacterImagesController($location, $routeParams,
  MainCharacterService) {

  var self = this;

  self.$onInit = function() {
    
    let mainCharacter = MainCharacterService.getMainCharacter($routeParams.id);

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters/params/focus=maincharacters_' + mainCharacter.$loki
    });
    self.breadcrumbitems.push({
      label: mainCharacter.name,
      href: '/maincharacters/' + mainCharacter.$loki
    });
    self.breadcrumbitems.push({
      label: 'common_characters_images'
    });

    self.images = mainCharacter.images;
    self.lastsave = mainCharacter.lastsave;
    self.pageheadertitle = mainCharacter.name;
  };

  self.delete = function(filename) {
    let mainCharacter = MainCharacterService.deleteImage($routeParams.id, filename);
    self.images = mainCharacter.images;
  };

  self.insert = function() {
    $location.path('/maincharacters/' + $routeParams.id + '/images/new');
  };

  self.back = function() {
    $location.path('/maincharacters/' + $routeParams.id);
  };
}
