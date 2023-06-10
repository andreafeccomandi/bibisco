/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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

function MainCharacterTitleController($routeParams, $window, MainCharacterService) {
  let self = this;

  self.$onInit = function() {

    // common breadcrumb root
    self.breadcrumbitems = [];

    let maincharacter = MainCharacterService.getMainCharacter(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!maincharacter) {
      $window.history.back();
      return;
    }

    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters'
    });

    // edit breadcrumb items
    self.breadcrumbitems.push({
      label: maincharacter.name,
      href: '/maincharacters/' + maincharacter.$loki
    });
    self.breadcrumbitems.push({
      label: 'jsp.character.dialog.title.updateTitle'
    });

    self.profileimageenabled = true;
    self.profileimage = maincharacter.profileimage;
    self.name = maincharacter.name;
    self.pageheadertitle = 'jsp.character.dialog.title.updateTitle';
  };

  self.save = function(title) {
    let maincharacter = MainCharacterService.getMainCharacter(parseInt($routeParams.id));
    maincharacter.name = title;
    MainCharacterService.update(maincharacter);
  };
}
