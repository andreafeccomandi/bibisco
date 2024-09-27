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
  component('mindmaptitle', {
    templateUrl: 'components/mindmaps/mindmap-title.html',
    controller: MindmapTitleController
  });

function MindmapTitleController($routeParams, $window, MindmapService) {

  let self = this;

  self.$onInit = function() {

    // common bradcrumb root
    self.breadcrumbitems = [];

    if ($routeParams.id !== undefined) {
      let mindmap = MindmapService.getMindmap(parseInt($routeParams.id));
  
      // If we get to the page using the back button it's possible that the resource has been deleted. Let's go back again.
      if (!mindmap) {
        $window.history.back();
        return;
      }

      self.breadcrumbitems.push({
        label: 'common_mindmaps_title',
        href: '/mindmaps'
      });

      // edit breadcrumb mindmaps
      self.breadcrumbitems.push({
        label: mindmap.name,
        href: '/mindmaps/' + mindmap.$loki + '/default'
      });
      self.breadcrumbitems.push({
        label: 'mindmap_change_name_title'
      });

      self.name = mindmap.name;
      self.pageheadertitle = 'mindmap_change_name_title';
      
    } else {

      self.breadcrumbitems.push({
        label: 'common_mindmaps_title',
        href: '/mindmaps'
      });

      // create breadcrumb mindmaps
      self.breadcrumbitems.push({
        label: 'mindmap_create_title'
      });

      self.elementbasepath = '/relations/';

      self.name = null;
      self.pageheadertitle =
        'mindmap_create_title';
    }
  };

  self.save = function(title) {
    if ($routeParams.id !== undefined) {
      let mindmap = MindmapService.getMindmap(parseInt($routeParams.id));
      mindmap.name = title;
      MindmapService.update(mindmap);
    } else {
      MindmapService.insert({
        description: '',
        name: title
      });
    }
  };
}
