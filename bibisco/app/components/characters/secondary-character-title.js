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
  component('secondarycharactertitle', {
    templateUrl: 'components/characters/secondary-character-title.html',
    controller: SecondaryCharacterTitleController
  });

function SecondaryCharacterTitleController($location, $routeParams, $window,
  SecondaryCharacterService) {

  var self = this;

  self.$onInit = function() {

    // common breadcrumb root
    self.breadcrumbItems = [];
    
    if ($routeParams.id !== undefined) {
      let secondarycharacter = SecondaryCharacterService.getSecondaryCharacter(parseInt($routeParams.id));
  
      // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
      if (!secondarycharacter) {
        $window.history.back();
        return;
      }

      self.breadcrumbItems.push({
        label: 'common_characters',
        href: '/characters/params/focus=secondarycharacters_' + secondarycharacter.$loki
      });

      // edit breadcrumb items
      self.breadcrumbItems.push({
        label: secondarycharacter.name,
        href: '/secondarycharacters/' + secondarycharacter.$loki + '/view'
      });
      self.breadcrumbItems.push({
        label: 'jsp.character.dialog.title.updateTitle'
      });

      self.profileimageenabled = true;
      self.profileimage = secondarycharacter.profileimage;
      self.name = secondarycharacter.name;
      self.pageheadertitle =
        'jsp.character.dialog.title.updateTitle';
    } else {

      self.breadcrumbItems.push({
        label: 'common_characters',
        href: '/characters'
      });

      // create breadcrumb items
      self.breadcrumbItems.push({
        label: 'jsp.characters.dialog.title.createSecondaryCharacter'
      });

      self.profileimageenabled = false;
      self.name = null;
      self.pageheadertitle =
        'jsp.characters.dialog.title.createSecondaryCharacter';
    }
  };

  self.save = function(title) {
    if ($routeParams.id !== undefined) {
      let secondarycharacter = SecondaryCharacterService.getSecondaryCharacter(parseInt($routeParams.id));
      secondarycharacter.name = title;
      SecondaryCharacterService.update(secondarycharacter);
    } else {
      SecondaryCharacterService.insert({
        description: '',
        name: title
      });
    }
  };
}
