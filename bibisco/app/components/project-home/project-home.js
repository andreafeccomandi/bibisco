/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  component('projecthome', {
    templateUrl: 'components/project-home/project-home.html',
    controller: TipsController,
    bindings: {

    }
  });

function TipsController($location, ContextMenuService, ProjectService) {
  
  var self = this;

  self.$onInit = function () {
    // action items
    self.actionitems = [];
    self.actionitems.push({
      label: 'jsp.project.button.updateTitle',
      itemfunction: function() {
        $location.path('/project/title');
      }
    });
  };

  self.project = function() {
    return ProjectService.getProjectInfo();
  };

  self.showTips = function() {
    $location.path('/project/tips');
  };

  self.back = function() {
    $location.path('/start');
    ContextMenuService.destroy();
  };
}
