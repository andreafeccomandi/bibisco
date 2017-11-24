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
  component('stranddetail', {
    templateUrl: 'components/strands/strand-detail.html',
    controller: StrandDetailController
  });

function StrandDetailController($location, $routeParams, StrandService) {

  var self = this;

  self.$onInit = function() {

    self.strand = self.getStrand($routeParams.id);

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.nav.li.architecture',
      href: '/project/architecture'
    });
    self.breadcrumbitems.push({
      label: self.strand.name
    });

    self.showprojectexplorer = true;

  };

  self.back = function() {
    $location.path('/project/architecture');
  };

  self.changeStatus = function(status) {
    self.strand.status = status;
    StrandService.update(self.strand);
  };

  self.changeTitle = function() {
    $location.path('/strands/' + self.strand.$loki + '/title');
  };

  self.delete = function() {
    StrandService.remove(self.strand
      .$loki);
    $location.path('/project/architecture');
  };

  self.getStrand = function(id) {
    return StrandService.getStrand(id);
  };

  self.savefunction = function() {
    StrandService.update(self.strand);
  };
}
