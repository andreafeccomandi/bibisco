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
  component('secondarycharacteraddimage', {
    templateUrl: 'components/characters/secondary-character-addimage.html',
    controller: SecondaryCharacterAddImageController
  });

function SecondaryCharacterAddImageController($location, $routeParams, $window,
  BibiscoPropertiesService, PopupBoxesService, SecondaryCharacterService) {

  var self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];
    let secondaryCharacter = SecondaryCharacterService.getSecondaryCharacter(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!secondaryCharacter) {
      $window.history.back();
      return;
    }
    
    // addprofile mode
    self.addprofile = $location.path().includes('addprofile');

    // breadcrumb

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
  
      self.customtitle = null;
    }
  };

  self.save = function(name, path) {
    let filename = SecondaryCharacterService.addImage(parseInt($routeParams.id), name, path);
    if (self.addprofile) {
      SecondaryCharacterService.setProfileImage(parseInt($routeParams.id), filename);
      if (BibiscoPropertiesService.getProperty('addProfileImageTip') === 'true') {
        PopupBoxesService.showTip('addProfileImageTip');
      }
    }
  };
}
