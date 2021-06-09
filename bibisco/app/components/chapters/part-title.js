/*
 * Copyright (C) 2014-2021 Andrea Feccomandi
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
  component('parttitle', {
    templateUrl: 'components/chapters/part-title.html',
    controller: PartTitleController
  });

function PartTitleController($routeParams, ChapterService) {
  var self = this;

  self.$onInit = function() {

    // common breadcrumb root
    self.breadcrumbItems = [];

    if ($routeParams.id !== undefined) {
      let part = ChapterService.getPart($routeParams.id);

      // edit breadcrumb items
      self.breadcrumbItems.push({
        label: 'common_chapters',
        href: '/chapters'
      });
      self.breadcrumbItems.push({
        label: part.title
      });
      self.breadcrumbItems.push({
        label: 'change_part_title_title'
      });

      self.exitpath = '/chapters/';
      self.title = part.title;
      self.pageheadertitle = 'change_part_title_title';
    } else {
      self.breadcrumbItems.push({
        label: 'common_chapters',
        href: '/chapters'
      });

      // create breadcrumb items
      self.breadcrumbItems.push({
        label: 'create_part_title'
      });

      self.exitpath = '/chapters';
      self.name = null;
      self.pageheadertitle = 'create_part_title';
    }
  };

  self.save = function(title) {
    if ($routeParams.id !== undefined) {
      let part = ChapterService.getPart($routeParams.id);
      part.title = title;
      ChapterService.updatePart(part);
    } else {
      ChapterService.insertPart({
        title: title
      });
    }
  };

}
