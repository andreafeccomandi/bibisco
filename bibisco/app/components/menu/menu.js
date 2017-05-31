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
component('menu', {
  templateUrl: 'components/menu/menu.html',
  controller: MenuController
});

function MenuController($location, $rootScope, LocaleService, LoggerService) {
  LoggerService.debug('Start MenuController...');

  var self = this;

  // menu status
  self.collapsed = true;
  self.visible = false;
  self.disabled = false;

  // menu items status
  self.projecthomeActive = false;
  self.architectureActive = false;
  self.charactersActive = false;
  self.locationsActive = false;
  self.chaptersActive = false;
  self.exportActive = false;
  self.analysisActive = false;
  self.settingsActive = false;
  self.infoActive = false;

  // SHOW START EVENT
  $rootScope.$on('SHOW_START', function() {
    self.visible = false;
    self.disabled = false;
  });

  // SHOW CREATE PROJECT EVENT
  $rootScope.$on('SHOW_CREATE_PROJECT', function() {
    self.visible = false;
    self.disabled = false;
  });

  // SHOW IMPORT PROJECT EVENT
  $rootScope.$on('SHOW_IMPORT_PROJECT', function() {
    self.visible = false;
    self.disabled = false;
  });

  // SHOW LOCATION title
  $rootScope.$on('SHOW_LOCATION_TITLE', function() {
    self.visible = true;
    self.disabled = true;
  });

  // SHOW MAIN CHARACTER title
  $rootScope.$on('SHOW_MAIN_CHARACTER_TITLE', function() {
    self.visible = true;
    self.disabled = true;
  });

  // SHOW OPEN PROJECT EVENT
  $rootScope.$on('SHOW_OPEN_PROJECT', function() {
    self.visible = false;
    self.disabled = false;
  });

  // SHOW SECONDARY CHARACTER title
  $rootScope.$on('SHOW_SECONDARY_CHARACTER_TITLE', function() {
    self.visible = true;
    self.disabled = true;
  });

  // SHOW SECONDARY CHARACTER detail
  $rootScope.$on('SHOW_SECONDARY_CHARACTER_DETAIL', function() {
    self.visible = true;
    self.disabled = false;
  });


  // SHOW WELCOME EVENT
  $rootScope.$on('SHOW_WELCOME', function() {
    self.visible = false;
    self.disabled = false;
  });

  // SHOW PROJECT
  $rootScope.$on('SHOW_PROJECT', function(event, args) {
    self.disableAllItems();
    eval("self." + args.item + "Active = true");
    self.collapsed = true;
    self.visible = true;
    self.disabled = false;
  });


  self.toggleCollapse = function() {
    self.collapsed = !self.collapsed;
  }

  self.selectItem = function(item) {
    self.disableAllItems();
    eval("self." + item + "Active = true");
    $rootScope.$emit('MENU_ITEM_SELECTED', {
      item: item
    });
    self.collapsed = true;
  }

  self.disableAllItems = function() {
    self.projecthomeActive = false;
    self.architectureActive = false;
    self.charactersActive = false;
    self.locationsActive = false;
    self.chaptersActive = false;
    self.exportActive = false;
    self.analysisActive = false;
    self.settingsActive = false;
    self.infoActive = false;
  }

  LoggerService.debug('End MenuController...');
}
