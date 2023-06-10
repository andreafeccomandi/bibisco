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
  component('itemschaptersdistribution', {
    templateUrl: 'components/analysis/items-chapters-distribution.html',
    controller: ItemsChaptersDistributionController,
    bindings: {
      analysistitle: '@',
      chart: '@',
      chapterscount: '<',
      chapterspositions: '<',
      items: '<',
      noitemsmessage: '@'
    }
  });

function ItemsChaptersDistributionController(BibiscoPropertiesService, ChapterService, UtilService) {

  var self = this;

  self.$onInit = function () {
  
    self.tablewidth = self.chapterscount*20+350;
    
    self.chapters = [];
    for (let i = 0; i < self.chapterspositions.length; i++) {
      self.chapters.push(ChapterService.getChapterPositionDescription(self.chapterspositions[i]));
    }

    self.labels = [];
    self.data = [];
    for (let i = 0; i < self.items.length; i++) {
      let labeltouse = self.items[i].labelshort ? self.items[i].labelshort : self.items[i].label;
      self.labels.push(UtilService.string.truncate(labeltouse, 20));
      self.data.push(self.items[i].percentage);
    }

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