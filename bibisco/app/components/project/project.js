/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  component('project', {
    templateUrl: 'components/project/project.html',
    controller: ProjectController,
    bindings: {

    }
  });

function ProjectController($location, $rootScope, $routeParams, AnalysisService) {

  var self = this;

  // init AnalysisService
  AnalysisService.ping();

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
  self.infoActive = false;

  // select item from route
  eval('self.' + $routeParams.item + 'Active = true');

  // show menu
  $rootScope.$emit('SHOW_PROJECT', {
    item: $routeParams.item
  });

  // change menu item
  $rootScope.$on('MENU_ITEM_SELECTED', function(event, args) {
    self.disableAllItems();
    eval('self.' + args.item + 'Active = true');
  });

  // disable all items
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
    self.infoActive = false;
  };
}
