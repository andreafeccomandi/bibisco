/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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
  component('maincharacterevent', {
    templateUrl: 'components/characters/main-character-event.html',
    controller: MainCharacterEventController
  });

function MainCharacterEventController($routeParams, $window, MainCharacterService) {

  var self = this;

  self.$onInit = function() {

    self.breadcrumbitems = [];

    self.edit = $routeParams.eventid !== undefined ? true : false;

    let mainCharacter = MainCharacterService.getMainCharacter(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!mainCharacter) {
      $window.history.back();
      return;
    }
    
    // breadcrumb
    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters'
    });
    self.breadcrumbitems.push({
      label: mainCharacter.name,
      href: '/maincharacters/' + mainCharacter.$loki
    });
    self.breadcrumbitems.push({
      label: 'common_events',
      href: '/maincharacters/' + mainCharacter.$loki + 'events'
    });
    
    if (self.edit) {
      self.breadcrumbitems.push({
        label: 'events_edit_event_title'
      });
    } else {
      self.breadcrumbitems.push({
        label: 'events_add_event_title'
      });
    }

    self.profileimage = mainCharacter.profileimage;
    self.id=parseInt($routeParams.id);
    self.eventid=$routeParams.eventid;
  };
}
