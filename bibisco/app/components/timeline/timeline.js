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
  component('timeline', {
    templateUrl: 'components/timeline/timeline.html',
    controller: TimelineController
  });

function TimelineController($injector, $rootScope) {

  let self = this;
  self.$onInit = function() {
    
    // show menu item
    $rootScope.$emit('SHOW_PAGE', {
      item: 'timeline'
    });

    let TimelineService = $injector.get('TimelineService');
    self.fullTimeline = TimelineService.getTimeline();
    self.applyFilterGroup();
  };

  self.applyFilterGroup = function() {
    let GroupService = $injector.get('GroupService');
    if ($rootScope.groupFilter && $rootScope.groupFilter.key !== 'all') {
      self.timeline = [];
      for (let i = 0; i < self.fullTimeline.length; i++) {
        const element = self.fullTimeline[i];
        if (GroupService.isElementInGroup(element.type, element.id, $rootScope.groupFilter.key)) {
          self.timeline.push(element);
        }
      }
    } else {
      self.timeline = self.fullTimeline;
    }
  };
}
