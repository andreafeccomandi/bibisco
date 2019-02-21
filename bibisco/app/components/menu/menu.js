/*
 * Copyright (C) 2014-2019 Andrea Feccomandi
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
  component('menu', {
    templateUrl: 'components/menu/menu.html',
    controller: MenuController
  });

function MenuController($injector, $location, $rootScope, CardUtilService, 
  SupporterEditionChecker) {

  var self = this;
  self.$onInit = function () {

    // menu status
    self.collapsed = true;
    self.visible = false;
  
    // menu items status
    self.disableAllItems();

    // focus element map
    self.focuselementmap = [];

    // ADD ELEMENT IMAGE
    $rootScope.$on('ADD_ELEMENT_IMAGE', function () {
      self.visible = true;
    });

    // EXPORT SELECT DIRECTORY
    $rootScope.$on('EXPORT_SELECT_DIRECTORY', function () {
      self.visible = true;
    });

    // MOVE SCENE SELECT CHAPTER
    $rootScope.$on('MOVE_SCENE_SELECT_CHAPTER', function () {
      self.visible = true;
    });

    // SHOW START EVENT
    $rootScope.$on('SHOW_START', function () {
      self.visible = false;
    });

    // SHOW CREATE PROJECT EVENT
    $rootScope.$on('SHOW_CREATE_PROJECT', function () {
      self.visible = false;
    });

    // SHOW ERROR PAGE
    $rootScope.$on('SHOW_ERROR_PAGE', function () {
      self.visible = false;
    });

    // SHOW IMPORT PROJECT EVENT
    $rootScope.$on('SHOW_IMPORT_PROJECT', function () {
      self.visible = false;
    });

    // SHOW ELEMENT detail
    $rootScope.$on('SHOW_ELEMENT_DETAIL', function () {
      self.visible = true;
    });

    // SHOW ELEMENT IMAGES
    $rootScope.$on('SHOW_ELEMENT_IMAGES', function () {
      self.visible = true;
    });

    // SHOW ELEMENT TITLE
    $rootScope.$on('SHOW_ELEMENT_TITLE', function () {
      self.visible = true;
    });

    // SHOW OPEN PROJECT EVENT
    $rootScope.$on('SHOW_OPEN_PROJECT', function () {
      self.visible = false;
    });

    // SHOW TIPS
    $rootScope.$on('SHOW_TIPS', function () {
      self.visible = true;
    });

    // SHOW WELCOME EVENT
    $rootScope.$on('SHOW_WELCOME', function () {
      self.visible = false;
    });

    // SHOW PROJECT
    $rootScope.$on('SHOW_PAGE', function (event, args) {
      self.disableAllItems();
      eval('self.' + args.item + 'Active = true');
      self.collapsed = true;
      self.visible = true;
      if (self.focuselementmap[args.item]) {
        CardUtilService.focus(self.focuselementmap[args.item]);
      }
    });

    // REGISTER_FOCUS
    $rootScope.$on('REGISTER_FOCUS', function (event, args) {
      self.focuselementmap[args.page] = args.element;
    });
  };

  self.toggleCollapse = function() {
    self.collapsed = !self.collapsed;
  };

  self.selectItem = function(item) {
    if ((item === 'timeline' || item === 'search' || item === 'objects') 
      && !SupporterEditionChecker.check()) {
      SupporterEditionChecker.showSupporterMessage();
    }
    else {
      if ((item === 'timeline' || item === 'search') || item === 'objects') {
        $injector.get('IntegrityService').ok();
      }
      $location.path('/' + item);
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
    self.searchActive = false;
    self.exportActive = false;
    self.analysisActive = false;
    self.settingsActive = false;
  };
}
