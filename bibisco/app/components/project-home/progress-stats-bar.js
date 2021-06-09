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
  component('progressstatsbar', {
    templateUrl: 'components/project-home/progress-stats-bar.html',
    controller: ProgressStatsBarController,
    bindings: {
      completed: '<',
      tocomplete: '<',
      todo: '<',
      total: '<'
    }
  });

function ProgressStatsBarController() {
  var self = this;

  self.$onInit = function () {
    if (self.total) {
      self.completedPerc = Math.round((self.completed / self.total * 100 + Number.EPSILON));
      self.tocompletePerc = Math.round((self.tocomplete / self.total * 100+ Number.EPSILON));
      self.todoPerc = 100-self.completedPerc-self.tocompletePerc;
    }
  };
}
