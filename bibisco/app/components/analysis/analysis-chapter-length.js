/*
 * Copyright (C) 2014-2019 Andrea Feccomandi
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
  component('analysischapterlength', {
    templateUrl: 'components/analysis/analysis-chapter-length.html',
    controller: AnalysisController,
    bindings: {

    }
  });

function AnalysisController($translate, AnalysisService) {

  var self = this;

  self.$onInit = function () {

    // load translations
    let translations = $translate.instant([
      'common_chapters',
      'common_words'
    ]);

    self.labels = [];
    self.data = [];
    let chaptersLength = AnalysisService.getChaptersLength();
    self.total = chaptersLength.total;
    self.totalcharacters = chaptersLength.totalcharacters;
    let words = chaptersLength.words;
    let max = 0;

    for (let i = 0; i < words.length; i++) {
      self.labels.push('#' + (i+1));
      self.data.push(words[i]);
      if (words[i] > max) {
        max = words[i];
      }
    }

    if (max > 10) {
      self.options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: translations.common_chapters.toLowerCase()
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: translations.common_words.toLowerCase()
            },
            ticks: {
              beginAtZero: true,
            }
          }]
        }
      };
    } else {
      self.options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: translations.common_chapters.toLowerCase()
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: translations.common_words.toLowerCase()
            },
            ticks: {
              beginAtZero: true,
              steps: max / 10 >= 1 ? max / 10 : 1,
              stepValue: max / 10 >= 1 ? max / 10 : 1,
              max: max >= 10 ? max : 10
            }
          }]
        }
      };
    }
    
    
  };
}