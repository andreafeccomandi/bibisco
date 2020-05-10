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
  component('monthlyaveragewrittenwords', {
    templateUrl: 'components/project-home/history/monthly-average-written-words.html',
    controller: MonthlyAverageWrittenWordsController,
    bindings: {
      wordsperdaygoal: '<'
    }
  });

function MonthlyAverageWrittenWordsController($filter, $translate, ChapterService) {

  var self = this;

  self.$onInit = function () {

    // load translations
    let translations = $translate.instant([
      'goals_words_per_day_goal'
    ]);

    self.data = [];
    self.labels = [];
    self.words = [];
    let history = ChapterService.getWordsWrittenMonthAvg();

    // fill with empty months in order to have 12 entries
    let fillWithEmptyMonths = 12 - history.length;
    let firstWritingMonth = history.length > 0 ? moment(String(history[0].day)) : moment().add(1, 'months');
    for (let index = fillWithEmptyMonths; index > 0; index--) {
      self.labels.push(firstWritingMonth.clone().subtract(index, 'months').format('YYYY-MM'));
      self.words.push(0);
    }

    // data and labels
    history.forEach(element => {
      self.labels.push(moment(String(element.day)).format('YYYY-MM'));
      self.words.push(element.words);
    }); 
    self.data.push(self.words);
    self.series = ['Words written on average'];

    // options
    self.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    self.options = {
      maintainAspectRatio: false,
      responsive: true,
      elements: {
        point: {
          borderColor: '#004586'
        },
        line: {
          borderColor: '#0084D1',
          fill: false,
          tension: 0
        }
      },
      scales: {
        yAxes: [
          {
            id: 'y-axis-1',
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
              beginAtZero: true,
              precision:0
            }
          }
        ]
      }
    };

    if (self.wordsperdaygoal) {
      self.options.annotation = {
        annotations: [{
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-1',
          value: self.wordsperdaygoal,
          borderColor: '#5CB85C',
          borderWidth: 3,
          label: {
            enabled: true,
            content: translations.goals_words_per_day_goal + ': ' + $filter('number')(self.wordsperdaygoal, '0'),
            backgroundColor: '#5CB85C'
          }
        }]
      };
      self.options.scales.yAxes[0].ticks.suggestedMax = self.wordsperdaygoal + (self.wordsperdaygoal * 0.1);
    }
  };

}