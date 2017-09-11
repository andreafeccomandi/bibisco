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
component('maincharactertitle', {
  templateUrl: 'components/characters/main-character-title.html',
  controller: MainCharacterTitleController
});

function MainCharacterTitleController($location, $routeParams,
  MainCharacterService, LoggerService) {
  LoggerService.debug('Start MainCharacterTitleController...');

  var self = this;

  self.$onInit = function() {

    // common breadcrumb root
    self.breadcrumbItems = [];
    self.breadcrumbItems.push({
      label: 'jsp.projectFromScene.nav.li.characters'
    });

    if ($routeParams.operation == 'edit') {
      let maincharacter = MainCharacterService.getMainCharacter(
        $routeParams.id);

      // edit breadcrumb items
      self.breadcrumbItems.push({
        labelvalue: maincharacter.name
      });
      self.breadcrumbItems.push({
        label: 'jsp.character.dialog.title.updateTitle'
      });

      self.exitpath = "/maincharacterdetail/" + $routeParams.id;
      self.name = maincharacter.name;
      self.pageheadertitle =
        'jsp.character.dialog.title.updateTitle';
    } else {

      // create breadcrumb items
      self.breadcrumbItems.push({
        label: 'jsp.characters.dialog.title.createMainCharacter'
      });

      self.exitpath = "/project/characters";
      self.name = null;
      self.pageheadertitle =
        'jsp.characters.dialog.title.createMainCharacter';
    }
  }

  self.save = function(title) {
    if ($routeParams.operation == 'edit') {
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
  }

  LoggerService.debug('End MainCharacterTitleController...');
}
