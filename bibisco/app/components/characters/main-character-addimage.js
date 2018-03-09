/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */
angular.
  module('bibiscoApp').
  component('maincharacteraddimage', {
    templateUrl: 'components/characters/main-character-addimage.html',
    controller: MainCharacterAddImageController
  });

function MainCharacterAddImageController($routeParams, MainCharacterService) {

  var self = this;

  self.$onInit = function() {

    let mainCharacter = MainCharacterService.getMainCharacter($routeParams.id);

    // breadcrumb
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_characters'
    });
    self.breadcrumbitems.push({
      label: mainCharacter.name
    });
    self.breadcrumbitems.push({
      label: 'common_characters_images'
    });
    self.breadcrumbitems.push({
      label: 'jsp.addImageForm.dialog.title'
    });

    self.exitpath = '/maincharacters/' + $routeParams.id + '/images';
  };

  self.save = function(name, path) {
    MainCharacterService.addImage($routeParams.id, name, path);
  };
}
