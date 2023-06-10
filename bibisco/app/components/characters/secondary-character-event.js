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
  component('secondarycharacterevent', {
    templateUrl: 'components/characters/secondary-character-event.html',
    controller: SecondaryCharacterEventController
  });

function SecondaryCharacterEventController($routeParams, $window, SecondaryCharacterService) {

  var self = this;

  self.$onInit = function() {

    self.edit = $routeParams.eventid !== undefined ? true : false;

    self.breadcrumbitems = [];
    let secondaryCharacter = SecondaryCharacterService.getSecondaryCharacter(parseInt($routeParams.id));

    // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
    if (!secondaryCharacter) {
      $window.history.back();
      return;
    }

    // breadcrumb
    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters'
    });
    self.breadcrumbitems.push({
      label: secondaryCharacter.name,
      href: '/secondarycharacters/ ' + secondaryCharacter.$loki + '/view'
    });
    self.breadcrumbitems.push({
      label: 'common_events',
      href: '/secondarycharacters/ ' + secondaryCharacter.$loki + '/events'
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

    self.profileimage = secondaryCharacter.profileimage;
    self.id=parseInt($routeParams.id);
    self.eventid=$routeParams.eventid;
  };
}
