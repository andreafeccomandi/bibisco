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
  self.projectActive = true;
  self.architectureActive = false;
  self.charactersActive = false;
  self.locationsActive = false;
  self.chaptersActive = false;
  self.exportActive = false;
  self.analysisActive = false;
  self.settingsActive = false;
  self.infoActive = false;

  $rootScope.$on('SHOW_MENU', function() {
    self.visible = true;
  });

  $rootScope.$on('HIDE_MENU', function() {
    self.visible = false;
  });

  $rootScope.$on('DISABLE_MENU', function() {
    self.disabled = true;
  });

  $rootScope.$on('ENABLE_MENU', function() {
    self.disabled = false;
  });

  self.toggleCollapse = function() {
    this.collapsed = !this.collapsed;
  }

  self.selectItem = function(item) {
    self.disableAllItems();
    eval("self." + item + "Active = true");
    eval("$location.path('/" + item + "')");
  }

  self.disableAllItems = function() {
    self.projectActive = false;
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
