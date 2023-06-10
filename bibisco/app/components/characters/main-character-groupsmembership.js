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
  component('maincharactergroupsmembership', {
    templateUrl: 'components/characters/main-character-groupsmembership.html',
    controller: MainCharacterGroupsmembershipController
  });

function MainCharacterGroupsmembershipController($routeParams, $window, MainCharacterService) {

  let self = this;

  self.$onInit = function() {
  
    self.breadcrumbitems = [];
    let mainCharacter = MainCharacterService.getMainCharacter(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!mainCharacter) {
      $window.history.back();
      return;
    }
    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters'
    });
    self.breadcrumbitems.push({
      label: mainCharacter.name,
      href: '/maincharacters/ ' + mainCharacter.$loki
    });
    self.breadcrumbitems.push({
      label: 'groups_membership'
    });

    self.id = mainCharacter.$loki;
    self.lastsave = mainCharacter.lastsave;
    self.pageheadertitle = mainCharacter.name;
    self.profileimage = mainCharacter.profileimage;
  };
}
