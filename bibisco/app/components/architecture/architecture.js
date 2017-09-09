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
component('architecture', {
  templateUrl: 'components/architecture/architecture.html',
  controller: ArchitectureController,
  bindings: {

  }
});

function ArchitectureController($location, $rootScope, ArchitectureService,
  StrandService, LoggerService) {
  LoggerService.debug('Start ArchitectureController...');
  var self = this;

  self.$onInit = function() {
    self.architecturecardgriditems = self.getArchitectureCardGridItems();
    self.strandcardgriditems = self.getStrandCardGridItems();
  }

  self.getArchitectureCardGridItems = function() {
    let items = [];

    /* Premise */
    let premise = ArchitectureService.getPremise();
    items.push({
      id: 'premise',
      position: 1,
      status: premise.status,
      text: 'jsp.architecture.thumbnail.premise.description',
      title: 'jsp.architecture.thumbnail.premise.title'
    });

    /* Fabula */
    let fabula = ArchitectureService.getFabula();
    items.push({
      id: 'fabula',
      position: 2,
      status: fabula.status,
      text: 'jsp.architecture.thumbnail.fabula.description',
      title: 'jsp.architecture.thumbnail.fabula.title'
    });

    /* Setting */
    let setting = ArchitectureService.getSetting();
    items.push({
      id: 'setting',
      position: 3,
      status: setting.status,
      text: 'jsp.architecture.thumbnail.setting.description',
      title: 'jsp.architecture.thumbnail.setting.title'
    });

    return items;
  }

  self.getStrandCardGridItems = function() {
    let items = [];
    if (StrandService.getStrandsCount() > 0) {
      let strands = StrandService.getStrands();
      for (let i = 0; i < strands.length; i++) {
        items.push({
          id: strands[i].$loki,
          position: strands[i].position,
          status: strands[i].status,
          title: strands[i].name
        });
      }
    }
    return items;
  }

  self.createStrand = function() {
    $location.path('/strandtitle/new/0');
  }

  self.strandSelect = function(id) {
    $location.path('/strand/' + id);
  }

  self.strandMove = function(draggedObjectId, destinationObjectId) {
    StrandService.move(draggedObjectId, destinationObjectId);
    self.strandscardgriditems = this.getStrandCardGridItems();
    $scope.$apply();
  }

  LoggerService.debug('End ArchitectureController...');
}
