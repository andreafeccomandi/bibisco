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
  component('architecture', {
    templateUrl: 'components/architecture/architecture.html',
    controller: ArchitectureController,
    bindings: {

    }
  });

function ArchitectureController($injector, $location, $rootScope, $scope,
  ArchitectureService, StrandService, SupporterEditionChecker) {

  var self = this;

  self.$onInit = function() {
    self.architecturecardgriditems = self.getArchitectureCardGridItems();
    self.strandcardgriditems = self.getStrandCardGridItems();
  };

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

    /* Global notes */
    let globalnotes = ArchitectureService.getGlobalNotes();
    items.push({
      id: 'globalnotes',
      position: 4,
      status: globalnotes.status,
      text: 'common_notes_description',
      title: 'common_notes_title'
    });

    return items;
  };

  self.architectureItemSelect = function(id) {
    if (id === 'globalnotes' && !SupporterEditionChecker.check()) {
      SupporterEditionChecker.showSupporterMessage();
    } else {
      $injector.get('IntegrityService').ok();
      $location.path('/architectureitems/' + id);
    }
  };

  self.getStrandCardGridItems = function() {
    let items = null;
    if (StrandService.getStrandsCount() > 0) {
      let strands = StrandService.getStrands();
      items = [];
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
  };

  self.createStrand = function() {
    $location.path('/strands/new');
  };

  self.strandSelect = function(id) {
    $location.path('/strands/' + id);
  };

  self.strandMove = function(draggedObjectId, destinationObjectId) {
    StrandService.move(draggedObjectId, destinationObjectId);
    self.strandcardgriditems = this.getStrandCardGridItems();
    $scope.$apply();
  };
}
