/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  component('itemtitle', {
    templateUrl: 'components/objects/object-title.html',
    controller: ItemTitleController
  });

function ItemTitleController($location, $routeParams, ObjectService) {

  var self = this;

  self.$onInit = function() {

    // common bradcrumb root
    self.breadcrumbItems = [];

    if ($routeParams.id !== undefined) {
      let object = ObjectService.getObject($routeParams.id);

      self.breadcrumbItems.push({
        label: 'objects',
        href: '/objects/params/focus=objects_' + object.$loki
      });

      // edit breadcrumb objects
      self.breadcrumbItems.push({
        label: object.name,
        href: '/objects/' + object.$loki + '/view'
      });
      self.breadcrumbItems.push({
        label: 'object_change_name_title'
      });

      self.exitpath = '/objects/' + object.$loki + '/view';
      self.name = object.name;
      self.pageheadertitle = 'object_change_name_title';
      
    } else {

      self.breadcrumbItems.push({
        label: 'objects',
        href: '/objects'
      });

      // create breadcrumb objects
      self.breadcrumbItems.push({
        label: 'object_create_title'
      });
      self.exitpath = '/objects';
      self.name = null;
      self.pageheadertitle =
        'object_create_title';
    }
  };

  self.save = function(title) {
    if ($routeParams.id !== undefined) {
      let object = ObjectService.getObject(
        $routeParams.id);
      object.name = title;
      ObjectService.update(object);
    } else {
      ObjectService.insert({
        description: '',
        name: title
      });
    }
  };
}
