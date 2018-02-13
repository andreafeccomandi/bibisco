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
  component('items', {
    templateUrl: 'components/items/items.html',
    controller: ItemsController,
    bindings: {

    }
  });

function ItemsController($location, $scope, ItemService, SupporterEditionChecker) {

  var self = this;

  self.$onInit = function() {
    self.cardgriditems = this.getCardGridItems();
  };

  self.itemsPresent = function() {
    return ItemService.getItemsCount() > 0;
  };

  self.create = function() {
    self.supporterEditionFilterAction(function () {
      $location.path('/items/new');
    });
  };

  self.getCardGridItems = function () {
    let cardgriditems = null;
    if (ItemService.getItemsCount() > 0) {
      let items = ItemService.getItems();
      cardgriditems = [];
      for (let i = 0; i < items.length; i++) {
        cardgriditems.push({
          id: items[i].$loki,
          position: items[i].position,
          status: items[i].status,
          title: items[i].name
        });
      }
    }
    return cardgriditems;
  };

  self.move = function(draggedObjectId, destinationObjectId) {
    ItemService.move(draggedObjectId, destinationObjectId);
    self.cardgriditems = this.getCardGridItems();
    $scope.$apply();
  };

  self.select = function(id) {
    self.supporterEditionFilterAction(function() {
      $location.path('/items/' + id);
    });
  };

  self.supporterEditionFilterAction = function(action) {
    if (!SupporterEditionChecker.isSupporterEdition()) {
      SupporterEditionChecker.showSupporterMessage();
    } else {
      action();
    }
  };
}
