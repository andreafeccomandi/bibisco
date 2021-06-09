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
  component('timelineelement', {
    templateUrl: 'components/timeline/timeline-element.html',
    controller: TimelineElementController,
    bindings: {
      deletefunction: '&',
      index: '<',
      editfunction: '&',
      element: '<',
      mode: '@'
    }
  });

function TimelineElementController($location, LocaleService) {
  let self = this;

  self.$onInit = function () {
    moment.locale(LocaleService.getCurrentLocale());
    self.dayofweek = moment(self.element.time).format('dddd');
  };

  self.showScene = function() {
    $location.path('/timeline/chapters/' + self.element.chapterid + '/scenes/' + self.element.sceneid + '/view');
  };
}
