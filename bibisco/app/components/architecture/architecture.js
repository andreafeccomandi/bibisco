/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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
  component('architecture', {
    templateUrl: 'components/architecture/architecture.html',
    controller: ArchitectureController,
    bindings: {

    }
  });

function ArchitectureController($injector, $location, $rootScope, $scope,
  ArchitectureService, StrandService, SupporterEditionChecker) {

  let self = this;
  let GroupService = null;

  self.$onInit = function() {

    // show menu item
    $rootScope.$emit('SHOW_PAGE', {
      item: 'architecture'
    });

    self.architecturecardgriditems = self.getArchitectureCardGridItems();
    self.strandcardgriditems = self.getStrandCardGridItems();

    // hotkeys
    self.hotkeys = ['ctrl+n','command+n'];
  };

  self.getArchitectureCardGridItems = function() {
    let items = [];

    /* Premise */
    let premise = ArchitectureService.getPremise();
    items.push({
      id: 'premise',
      noimageicon: 'compass',
      position: 1,
      status: premise.status,
      text: 'jsp.architecture.thumbnail.premise.description',
      title: 'jsp.architecture.thumbnail.premise.title'
    });

    /* Fabula */
    let fabula = ArchitectureService.getFabula();
    items.push({
      id: 'fabula',
      noimageicon: 'clock-o',
      position: 2,
      status: fabula.status,
      text: 'jsp.architecture.thumbnail.fabula.description',
      title: 'jsp.architecture.thumbnail.fabula.title'
    });

    /* Setting */
    let setting = ArchitectureService.getSetting();
    items.push({
      id: 'setting',
      noimageicon: 'globe',
      position: 3,
      status: setting.status,
      text: 'jsp.architecture.thumbnail.setting.description',
      title: 'jsp.architecture.thumbnail.setting.title'
    });

    /* Global notes */
    let globalnotes = ArchitectureService.getGlobalNotes();
    items.push({
      id: 'globalnotes',
      noimageicon: 'thumb-tack',
      position: 4,
      supportersonly: true,
      status: globalnotes.status,
      text: 'common_notes_description',
      title: 'common_notes_title'
    });

    return items;
  };

  self.architectureItemSelect = function(id) {
    if (id === 'globalnotes') {
      SupporterEditionChecker.filterAction(function() {
        $location.path('/architectureitems/' + id + '/default');
      });
    } else {
      $location.path('/architectureitems/' + id + '/default');
    }
  };

  self.getStrandCardGridItems = function() {
    let items = null;
    if (StrandService.getStrandsCount() > 0) {
      let strands = StrandService.getStrands();
      items = [];
      for (let i = 0; i < strands.length; i++) {
        let tags = [];
        if (SupporterEditionChecker.isSupporterOrTrial()) {
          let elementGroups = self.getGroupService().getElementGroups('strand', strands[i].$loki);
          for (let i = 0; i < elementGroups.length; i++) {
            tags.push({label: elementGroups[i].name, color: elementGroups[i].color});
          }  
        }
        items.push({
          id: strands[i].$loki,
          noimageicon: 'code-fork',
          position: strands[i].position,
          status: strands[i].status,
          tags: tags,
          title: strands[i].name
        });
      }
    }
    return items;
  };

  self.getGroupService = function () {
    if (!GroupService) {
      GroupService = $injector.get('GroupService');
    }
    return GroupService;
  };

  self.createStrand = function() {
    $location.path('/strands/new');
  };

  self.strandSelect = function(id) {
    $location.path('/strands/' + id + '/default');
  };

  self.strandMove = function(draggedObjectId, destinationObjectId) {
    StrandService.move(draggedObjectId, destinationObjectId);
    self.strandcardgriditems = this.getStrandCardGridItems();
    $scope.$apply();
  };
}
