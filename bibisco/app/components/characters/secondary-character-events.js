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
  component('secondarycharacterevents', {
    templateUrl: 'components/characters/secondary-character-events.html',
    controller: SecondaryCharacterEventsController
  });

function SecondaryCharacterEventsController($location, $routeParams,
  SecondaryCharacterService) {

  var self = this;

  self.$onInit = function() {
    
    let secondaryCharacter = SecondaryCharacterService.getSecondaryCharacter($routeParams.id);
    self.backpath = '/secondarycharacters/ ' + secondaryCharacter.$loki + '/view';

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_characters',
      href: '/characters/params/focus=secondarycharacters_' + secondaryCharacter.$loki
    });
    self.breadcrumbitems.push({
      label: secondaryCharacter.name,
      href: self.backpath
    });
    self.breadcrumbitems.push({
      label: 'common_events'
    });

    self.id = secondaryCharacter.$loki;
    self.lastsave = secondaryCharacter.lastsave;
    self.pageheadertitle = secondaryCharacter.name;
    self.profileimage = secondaryCharacter.profileimage;
  };

  self.edit = function(eventid) {
    $location.path('/secondarycharacters/' + $routeParams.id + '/events/' + eventid);
  };

  self.insert = function() {
    $location.path('/secondarycharacters/' + $routeParams.id + '/events/new');
  };
}
