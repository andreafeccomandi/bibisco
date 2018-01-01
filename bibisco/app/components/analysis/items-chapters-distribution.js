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
      chart: '@',
      chapterscount: '<',
      items: '<',
      noitemsmessage: '@'
    }
  });

function ItemsChaptersDistributionController($translate, UtilService) {

  var self = this;

  self.$onInit = function () {
  
    self.tablewidth = self.chapterscount*20+350;
    
    self.chapters = [];
    for (let i = 1; i <= self.chapterscount; i++) {
      self.chapters.push(i);
    }

    self.labels = [];
    self.data = [];
    for (let i = 0; i < self.items.length; i++) {
      self.labels.push(UtilService.string.truncate(self.items[i].label, 20));
      self.data.push(self.items[i].percentage);
    }

    // load translations
    let translations = $translate.instant([
      'common_chapters',
      'common_words'
    ]);


    self.options = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        yAxes: [{
          scaleLabel: {
            display: true,
            labelString: '%'
          },
          ticks: {
            beginAtZero: true,
            max: 100
          }
        }]
      }
    };
    
  };
}