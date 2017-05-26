/*
 * Copyright (C) 2014-2017 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
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
  SecondaryCharacterService, LoggerService) {
  LoggerService.debug('Start SecondaryCharacterTitleController...');

  var self = this;
  self.name = null;

  if ($routeParams.operation == 'edit') {

  }

  self.save = function(title) {
    SecondaryCharacterService.insert({
      name: title
    });
  }

  LoggerService.debug('End SecondaryCharacterTitleController...');
}
