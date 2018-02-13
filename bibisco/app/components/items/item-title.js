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
  component('itemtitle', {
    templateUrl: 'components/items/item-title.html',
    controller: ItemTitleController
  });

function ItemTitleController($location, $routeParams, ItemService) {

  var self = this;

  self.$onInit = function() {

    // common bradcrumb root
    self.breadcrumbItems = [];
    self.breadcrumbItems.push({
      label: 'items'
    });

    if ($routeParams.id !== undefined) {
      let item = ItemService.getItem(
        $routeParams.id);

      // edit breadcrumb items
      self.breadcrumbItems.push({
        label: item.name
      });
      self.breadcrumbItems.push({
        label: 'item_change_name_title'
      });

      self.exitpath = '/items/' + $routeParams.id;
      self.name = item.name;
      self.pageheadertitle =
        'item_change_name_title';
    } else {

      // create breadcrumb items
      self.breadcrumbItems.push({
        label: 'item_create_title'
      });
      self.exitpath = '/project/items';
      self.name = null;
      self.pageheadertitle =
        'item_create_title';
    }
  };

  self.save = function(title) {
    if ($routeParams.id !== undefined) {
      let item = ItemService.getItem(
        $routeParams.id);
      item.name = title;
      ItemService.update(item);
    } else {
      ItemService.insert({
        description: '',
        name: title
      });
    }
  };
}
