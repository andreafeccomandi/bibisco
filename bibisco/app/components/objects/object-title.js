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
    templateUrl: 'components/objects/object-title.html',
    controller: ItemTitleController
  });

function ItemTitleController($location, $routeParams, ObjectService) {

  var self = this;

  self.$onInit = function() {

    // common bradcrumb root
    self.breadcrumbItems = [];
    self.breadcrumbItems.push({
      label: 'objects'
    });

    if ($routeParams.id !== undefined) {
      let object = ObjectService.getObject(
        $routeParams.id);

      // edit breadcrumb objects
      self.breadcrumbItems.push({
        label: object.name
      });
      self.breadcrumbItems.push({
        label: 'object_change_name_title'
      });

      self.exitpath = '/objects/' + $routeParams.id;
      self.name = object.name;
      self.pageheadertitle =
        'object_change_name_title';
    } else {

      // create breadcrumb objects
      self.breadcrumbItems.push({
        label: 'object_create_title'
      });
      self.exitpath = '/project/objects';
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
