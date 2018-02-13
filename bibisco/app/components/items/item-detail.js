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
  component('itemdetail', {
    templateUrl: 'components/items/item-detail.html',
    controller: ItemDetailController
  });

function ItemDetailController($location, $routeParams, ChapterService, 
  ItemService) {

  var self = this;

  self.$onInit = function() {

    self.item = self.getItem($routeParams.id);

    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'items',
      href: '/project/items'
    });
    self.breadcrumbitems.push({
      label: self.item.name
    });
  
    self.deleteforbidden = self.isDeleteForbidden();
  };

  self.back = function() {
    $location.path('/project/items');
  };

  self.changeStatus = function(status) {
    self.item.status = status;
    ItemService.update(self.item);
  };

  self.changeTitle = function() {
    $location.path('/items/' + self.item.$loki + '/title');
  };

  self.delete = function() {
    ItemService.remove(self.item
      .$loki);
    $location.path('/project/items');
  };

  self.getItem = function(id) {
    return ItemService.getItem(id);
  };

  self.savefunction = function() {
    ItemService.update(self.item);
  };

  self.showimagesfunction = function() {
    $location.path('/items/' + self.item.$loki + '/images');
  };

  self.isDeleteForbidden = function () {

    let deleteForbidden = false;
    let id = self.item.$loki;
    let chapters = ChapterService.getChapters();
    for (let i = 0; i < chapters.length && !deleteForbidden; i++) {
      let scenes = ChapterService.getScenes(chapters[i].$loki);
      for (let j = 0; j < scenes.length && !deleteForbidden; j++) {
        let revisions = scenes[j].revisions;
        for (let h = 0; h < revisions.length && !deleteForbidden; h++) {
          if (revisions[h].itemid === id) {
            deleteForbidden = true;
          }
        }
      }
    }

    return deleteForbidden;
  };
}
