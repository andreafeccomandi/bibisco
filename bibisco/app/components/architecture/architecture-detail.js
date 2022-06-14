/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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
  component('architecturedetail', {
    templateUrl: 'components/architecture/architecture-detail.html',
    controller: ArchitectureDetailController
  });

function ArchitectureDetailController($location, $routeParams, 
  ArchitectureService) {

  var self = this;

  self.$onInit = function() {

    self.architectureitem = self.getArchitectureItem($routeParams.id);
    self.mode = $routeParams.mode; 

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'common_architecture',
      href: '/architecture/params/focus=architecture_' + $routeParams.id
    });
    self.breadcrumbitems.push({
      label: self.architectureitem.title
    });

    // Events enabled only for setting
    self.eventsenabled = ($routeParams.id === 'setting') ? true : false;
  };

  self.changeStatus = function(status) {
    self.architectureitem.status = status;
    ArchitectureService.update(self.architectureitem);
  };

  self.edit = function () {
    $location.path('/architectureitems/' + $routeParams.id + '/edit');
  };

  self.getArchitectureItem = function(id) {

    let architectureitem = ArchitectureService.getArchitectureItem(
      id);
    let title;
    let subtitle;

    if (id === 'premise') {
      title = 'jsp.architecture.thumbnail.premise.title';
      subtitle = 'jsp.architecture.thumbnail.premise.description';
    } else if (id === 'fabula') {
      title = 'jsp.architecture.thumbnail.fabula.title';
      subtitle = 'jsp.architecture.thumbnail.fabula.description';
    } else if (id === 'setting') {
      title = 'jsp.architecture.thumbnail.setting.title';
      subtitle = 'jsp.architecture.thumbnail.setting.description';
    } else if (id === 'globalnotes') {
      title = 'common_notes_title';
      subtitle = 'common_notes_description';
    }

    architectureitem.title = title;
    architectureitem.subtitle = subtitle;

    return architectureitem;
  };

  self.savefunction = function() {
    ArchitectureService.update(self.architectureitem);
  };

  self.showeventsfunction = function() {
    $location.path('/architectureitems/' + $routeParams.id + '/events');
  };
}
