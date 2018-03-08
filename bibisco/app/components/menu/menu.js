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

function MenuController($injector, $location, $rootScope, SupporterEditionChecker) {

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
  self.objectsActive = false;
  self.chaptersActive = false;
  self.timelineActive = false;
  self.exportActive = false;
  self.analysisActive = false;
  self.settingsActive = false;

  // ADD ELEMENT IMAGE
  $rootScope.$on('ADD_ELEMENT_IMAGE', function () {
    self.visible = true;
    self.disabled = true;
  });

  // EXPORT SELECT DIRECTORY
  $rootScope.$on('EXPORT_SELECT_DIRECTORY', function () {
    self.visible = true;
    self.disabled = true;
  });

  // MOVE SCENE SELECT CHAPTER
  $rootScope.$on('MOVE_SCENE_SELECT_CHAPTER', function () {
    self.visible = true;
    self.disabled = true;
  });

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

  // SHOW ERROR PAGE
  $rootScope.$on('SHOW_ERROR_PAGE', function () {
    self.visible = false;
    self.disabled = false;
  });

  // SHOW IMPORT PROJECT EVENT
  $rootScope.$on('SHOW_IMPORT_PROJECT', function() {
    self.visible = false;
    self.disabled = false;
  });

  // SHOW ELEMENT detail
  $rootScope.$on('SHOW_ELEMENT_DETAIL', function() {
    self.visible = true;
    self.disabled = true;
  });

  // SHOW ELEMENT IMAGES
  $rootScope.$on('SHOW_ELEMENT_IMAGES', function() {
    self.visible = true;
    self.disabled = true;
  });

  // SHOW ELEMENT TITLE
  $rootScope.$on('SHOW_ELEMENT_TITLE', function () {
    self.visible = true;
    self.disabled = true;
  });

  // SHOW OPEN PROJECT EVENT
  $rootScope.$on('SHOW_OPEN_PROJECT', function() {
    self.visible = false;
    self.disabled = false;
  });

  // SHOW TIPS
  $rootScope.$on('SHOW_TIPS', function () {
    self.visible = true;
    self.disabled = true;
  });

  // SHOW WELCOME EVENT
  $rootScope.$on('SHOW_WELCOME', function() {
    self.visible = false;
    self.disabled = false;
  });

  // SHOW PROJECT
  $rootScope.$on('SHOW_PROJECT', function(event, args) {
    self.disableAllItems();
    eval('self.' + args.item + 'Active = true');
    self.collapsed = true;
    self.visible = true;
    self.disabled = false;
  });


  self.toggleCollapse = function() {
    self.collapsed = !self.collapsed;
  };

  self.selectItem = function(item) {
    if (item === 'timeline' && !SupporterEditionChecker.check()) {
      SupporterEditionChecker.showSupporterMessage();
    }
    else {
      if (item === 'timeline') {
        $injector.get('IntegrityService').ok();
      }
      self.disableAllItems();
      eval('self.' + item + 'Active = true');
      $rootScope.$emit('MENU_ITEM_SELECTED', {
        item: item
      });
      self.collapsed = true;
    }
  };

  self.disableAllItems = function() {
    self.projecthomeActive = false;
    self.architectureActive = false;
    self.charactersActive = false;
    self.locationsActive = false;
    self.objectsActive = false;
    self.chaptersActive = false;
    self.timelineActive = false;
    self.exportActive = false;
    self.analysisActive = false;
    self.settingsActive = false;
  };
}
