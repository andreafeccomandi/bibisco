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
  component('secondarycharactertitle', {
    templateUrl: 'components/characters/secondary-character-title.html',
    controller: SecondaryCharacterTitleController
  });

function SecondaryCharacterTitleController($location, $routeParams,
  SecondaryCharacterService) {

  var self = this;

  self.$onInit = function() {

    // common breadcrumb root
    self.breadcrumbItems = [];
    
    if ($routeParams.id !== undefined) {
      let secondarycharacter = SecondaryCharacterService.getSecondaryCharacter(
        $routeParams.id);

      self.breadcrumbItems.push({
        label: 'common_characters',
        href: '/project/characters?focus=secondarycharacters_' + secondarycharacter.$loki
      });

      // edit breadcrumb items
      self.breadcrumbItems.push({
        label: secondarycharacter.name,
        href: '/secondarycharacters/' + secondarycharacter.$loki + '/view'
      });
      self.breadcrumbItems.push({
        label: 'jsp.character.dialog.title.updateTitle'
      });

      self.exitpath = '/secondarycharacters/' + secondarycharacter.$loki + '/view';
      self.name = secondarycharacter.name;
      self.pageheadertitle =
        'jsp.character.dialog.title.updateTitle';
    } else {

      self.breadcrumbItems.push({
        label: 'common_characters',
        href: '/project/characters'
      });

      // create breadcrumb items
      self.breadcrumbItems.push({
        label: 'jsp.characters.dialog.title.createSecondaryCharacter'
      });

      self.exitpath = '/project/characters';
      self.name = null;
      self.pageheadertitle =
        'jsp.characters.dialog.title.createSecondaryCharacter';
    }
  };

  self.save = function(title) {
    if ($routeParams.id !== undefined) {
      let secondarycharacter = SecondaryCharacterService.getSecondaryCharacter(
        $routeParams.id);
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
