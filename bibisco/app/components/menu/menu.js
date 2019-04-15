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

function MenuController($injector, $location, $rootScope, 
  SupporterEditionChecker) {

  var self = this;
  self.$onInit = function () {

    // menu status
    self.collapsed = true;
    self.visible = false;

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

    // SHOW CREATE SEQUEL
    $rootScope.$on('SHOW_CREATE_SEQUEL', function () {
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

    // SHOW SETTINGS
    $rootScope.$on('SHOW_SETTINGS', function () {
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
      self.collapsed = true;
      self.visible = true;
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
}
