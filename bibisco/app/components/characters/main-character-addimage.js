/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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
  component('maincharacteraddimage', {
    templateUrl: 'components/characters/main-character-addimage.html',
    controller: MainCharacterAddImageController
  });

function MainCharacterAddImageController($location, $routeParams, 
  BibiscoPropertiesService, MainCharacterService, PopupBoxesService) {

  var self = this;

  self.$onInit = function() {

    let mainCharacter = MainCharacterService.getMainCharacter($routeParams.id);

    // addprofile mode
    self.addprofile = $location.path().includes('addprofile');

    // breadcrumb
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters/params/focus=maincharacters_' + mainCharacter.$loki
    });
    self.breadcrumbitems.push({
      label: mainCharacter.name,
      href: '/maincharacters/' + mainCharacter.$loki
    });

    if (self.addprofile) {
      self.breadcrumbitems.push({
        label: 'add_profile_image_title'
      });
  
      self.exitpath = '/maincharacters/' + mainCharacter.$loki;
      self.customtitle = 'add_profile_image_title';
    }
    else {
      self.breadcrumbitems.push({
        label: 'common_characters_images',
        href: '/maincharacters/' + mainCharacter.$loki + 'images'
      });
      self.breadcrumbitems.push({
        label: 'jsp.addImageForm.dialog.title'
      });
  
      self.exitpath = '/maincharacters/' + mainCharacter.$loki + '/images';
      self.customtitle = null;
    }
  };

  self.save = function(name, path) {
    let filename = MainCharacterService.addImage($routeParams.id, name, path);
    if (self.addprofile) {
      MainCharacterService.setProfileImage($routeParams.id, filename);
      if (BibiscoPropertiesService.getProperty('addProfileImageTip') === 'true') {
        PopupBoxesService.showTip('addProfileImageTip');
      }
    }
  };
}
