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
  component('itemimages', {
    templateUrl: 'components/items/item-images.html',
    controller: ItemImagesController
  });

function ItemImagesController($location, $rootScope, $routeParams,
  ItemService) {

  var self = this;

  self.$onInit = function() {
    
    let item = ItemService.getItem($routeParams.id);
    
    self.breadcrumbitems = [];
    self.breadcrumbitems.push({
      label: 'items'
    });
    self.breadcrumbitems.push({
      label: item.name
    });
    self.breadcrumbitems.push({
      label: 'jsp.projectFromScene.select.location.images'
    });

    self.images = item.images;
    self.lastsave = item.lastsave;
    self.pageheadertitle = item.name;
  };

  self.delete = function(filename) {
    let item = ItemService.deleteImage($routeParams.id, filename);
    self.images = item.images;
  };

  self.insert = function() {
    $location.path('/items/' + $routeParams.id + '/images/new');
  };

  self.back = function() {
    $location.path('/items/' + $routeParams.id);
  };
}
