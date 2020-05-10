/*
 * Copyright (C) 2014-2020 Andrea Feccomandi
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
  component('dayofweekwrittenwords', {
    templateUrl: 'components/project-home/history/day-of-week-written-words.html',
    controller: DayOfWeekWrittenWordsController,
    bindings: {

    }
  });

function DayOfWeekWrittenWordsController($translate, ChapterService) {

  var self = this;

  self.$onInit = function () {

    // load translations
    let translations = $translate.instant([
      'day_of_the_week_0',
      'day_of_the_week_1',
      'day_of_the_week_2',
      'day_of_the_week_3',
      'day_of_the_week_4',
      'day_of_the_week_5',
      'day_of_the_week_6'
    ]);

    self.labels = [];
    self.data = [];

    let historyDayOfWeek = ChapterService.getWordsWrittenDayOfWeek();
    for (let index = 0; index < historyDayOfWeek.length; index++) {
      self.labels.push(translations['day_of_the_week_'+index]);
      self.data.push(historyDayOfWeek[index]);
    }

    self.options = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [{
          scaleLabel: {
            display: true
          }
        }],
        yAxes: [{
          scaleLabel: {
            display: true,
          },
          ticks: {
            beginAtZero: true,
          }
        }]
      }
    };
    
  };

}