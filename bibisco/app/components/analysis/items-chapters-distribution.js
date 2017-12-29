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
  component('itemschaptersdistribution', {
    templateUrl: 'components/analysis/items-chapters-distribution.html',
    controller: ItemsChaptersDistributionController,
    bindings: {
      analysistitle: '@',
      chapterscount: '<',
      items: '<',
      noitemsmessage: '@'
    }
  });

function ItemsChaptersDistributionController() {

  var self = this;

  self.$onInit = function () {
  
    self.tablewidth = self.chapterscount*20+200;

    self.chapters = [];
    for (let i = 1; i <= self.chapterscount; i++) {
      self.chapters.push(i);
    }
  };
}