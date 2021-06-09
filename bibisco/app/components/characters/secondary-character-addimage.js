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
  component('secondarycharacteraddimage', {
    templateUrl: 'components/characters/secondary-character-addimage.html',
    controller: SecondaryCharacterAddImageController
  });

function SecondaryCharacterAddImageController($location, $routeParams, 
  BibiscoPropertiesService, PopupBoxesService, SecondaryCharacterService) {

  var self = this;

  self.$onInit = function() {

    let secondaryCharacter = SecondaryCharacterService.getSecondaryCharacter($routeParams.id);

    // addprofile mode
    self.addprofile = $location.path().includes('addprofile');

    // breadcrumb
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters/params/focus=secondarycharacters_' + secondaryCharacter.$loki
    });
    self.breadcrumbitems.push({
      label: secondaryCharacter.name,
      href: '/secondarycharacters/ ' + secondaryCharacter.$loki + '/view'
    });

    if (self.addprofile) {
      self.breadcrumbitems.push({
        label: 'add_profile_image_title'
      });
  
      self.exitpath = '/secondarycharacters/ ' + secondaryCharacter.$loki + '/view';
      self.customtitle = 'add_profile_image_title';
    }
    else {
      self.breadcrumbitems.push({
        label: 'common_characters_images',
        href: '/secondarycharacters/ ' + secondaryCharacter.$loki + '/images'
      });
      self.breadcrumbitems.push({
        label: 'jsp.addImageForm.dialog.title'
      });
  
      self.exitpath = '/secondarycharacters/' + $routeParams.id + '/images';
      self.customtitle = null;
    }
  };

  self.save = function(name, path) {
    let filename = SecondaryCharacterService.addImage($routeParams.id, name, path);
    if (self.addprofile) {
      SecondaryCharacterService.setProfileImage($routeParams.id, filename);
      if (BibiscoPropertiesService.getProperty('addProfileImageTip') === 'true') {
        PopupBoxesService.showTip('addProfileImageTip');
      }
    }
  };
}
