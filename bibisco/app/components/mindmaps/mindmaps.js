/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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
  component('mindmaps', {
    templateUrl: 'components/mindmaps/mindmaps.html',
    controller: MindmapsController,
    bindings: {
    }
  });

function MindmapsController($location, $rootScope, $scope, MindmapService, SupporterEditionChecker) {

  let self = this;

  self.$onInit = function() {
    
    // show menu mindmap
    $rootScope.$emit('SHOW_PAGE', {
      mindmap: 'mindmaps'
    });
    
    self.cardgriditems = this.getCardGridItems();
    
    // hotkeys
    self.hotkeys = ['ctrl+n', 'command+n'];
  };

  self.mindmapsPresent = function() {
    return MindmapService.getMindmapsCount() > 0;
  };

  self.create = function() {
    SupporterEditionChecker.filterAction(function () {
      $location.path('/mindmaps/new');
    });
  };

  self.getCardGridItems = function () {
    let cardgriditems = null;
    if (MindmapService.getMindmapsCount() > 0) {
      let mindmaps = MindmapService.getMindmaps();
      cardgriditems = [];
      for (let i = 0; i < mindmaps.length; i++) {
        cardgriditems.push({
          id: mindmaps[i].$loki,
          noimageicon: 'sitemap',
          position: mindmaps[i].position,
          status: mindmaps[i].status,
          title: mindmaps[i].name
        });
      }
    }
    return cardgriditems;
  };

  self.move = function(draggedObjectId, destinationObjectId) {
    MindmapService.move(draggedObjectId, destinationObjectId);
    self.cardgriditems = this.getCardGridItems();
    $scope.$apply();
  };

  self.select = function(id) {
    SupporterEditionChecker.filterAction(function() {
      $location.path('/relations/' + id + '/view');
    });
  };
}
