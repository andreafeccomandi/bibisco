/*
 * Copyright (C) 2014-2017 Andrea Feccomandi
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
  component('secondarycharacteraddimage', {
    templateUrl: 'components/characters/secondary-character-addimage.html',
    controller: SecondaryCharacterAddImageController
  });

function SecondaryCharacterAddImageController($routeParams, SecondaryCharacterService) {

  var self = this;

  self.$onInit = function() {

    let secondaryCharacter = SecondaryCharacterService.getSecondaryCharacter($routeParams.id);

    // breadcrumb
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_characters'
    });
    self.breadcrumbitems.push({
      label: secondaryCharacter.name
    });
    self.breadcrumbitems.push({
      label: 'common_characters_images'
    });
    self.breadcrumbitems.push({
      label: 'jsp.addImageForm.dialog.title'
    });

    self.exitpath = '/secondarycharacters/' + $routeParams.id + '/images';
  };

  self.save = function(name, path) {
    SecondaryCharacterService.addImage($routeParams.id, name, path);
  };
}
