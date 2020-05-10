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
  component('maincharactertitle', {
    templateUrl: 'components/characters/main-character-title.html',
    controller: MainCharacterTitleController
  });

function MainCharacterTitleController($location, $routeParams,
  MainCharacterService) {
  var self = this;

  self.$onInit = function() {

    // common breadcrumb root
    self.breadcrumbItems = [];

    if ($routeParams.id !== undefined) {
      let maincharacter = MainCharacterService.getMainCharacter($routeParams.id);

      self.breadcrumbItems.push({
        label: 'common_characters',
        href: '/characters/params/focus=maincharacters_' + maincharacter.$loki
      });

      // edit breadcrumb items
      self.breadcrumbItems.push({
        label: maincharacter.name,
        href: '/maincharacters/' + maincharacter.$loki
      });
      self.breadcrumbItems.push({
        label: 'jsp.character.dialog.title.updateTitle'
      });

      self.exitpath = '/maincharacters/' + maincharacter.$loki;
      self.name = maincharacter.name;
      self.pageheadertitle = 'jsp.character.dialog.title.updateTitle';

    } else {

      self.breadcrumbItems.push({
        label: 'common_characters',
        href: '/characters'
      });

      // create breadcrumb items
      self.breadcrumbItems.push({
        label: 'jsp.characters.dialog.title.createMainCharacter'
      });

      self.exitpath = '/characters';
      self.name = null;
      self.pageheadertitle = 'jsp.characters.dialog.title.createMainCharacter';
    }
  };

  self.save = function(title) {
    if ($routeParams.id !== undefined) {
      let maincharacter = MainCharacterService.getMainCharacter(
        $routeParams.id);
      maincharacter.name = title;
      MainCharacterService.update(maincharacter);
    } else {
      MainCharacterService.insert({
        description: '',
        name: title
      });
    }
  };
}
