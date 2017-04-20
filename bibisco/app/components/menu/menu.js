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
  self.isCollapsed = true;
  self.isVisible = false;
  self.isDisabled = false;

  $rootScope.$on('SHOW_MENU', function() {
    self.isVisible = true;
  });

  $rootScope.$on('HIDE_MENU', function() {
    self.isVisible = false;
  });

  $rootScope.$on('DISABLE_MENU', function() {
    self.isDisabled = true;
  });

  $rootScope.$on('ENABLE_MENU', function() {
    self.isDisabled = false;
  });

  self.toggleCollapse = function() {
    this.isCollapsed = !this.isCollapsed;
  }

  self.selectItem = function(path) {
    $location.path(path);
  }

  LoggerService.debug('End MenuController...');
}
