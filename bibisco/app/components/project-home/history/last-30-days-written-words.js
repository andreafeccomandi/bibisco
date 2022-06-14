/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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
  component('last30dayswrittenwords', {
    templateUrl: 'components/project-home/history/last-30-days-written-words.html',
    controller: Last30DaysWrittenWordsController,
    bindings: {
      wordsperdaygoal: '<'
    }
  });

function Last30DaysWrittenWordsController($filter, $translate, ChapterService) {

  var self = this;

  self.$onInit = function () {

    // load translations
    let translations = $translate.instant([
      'date_format_moment',
      'goals_words_per_day_goal'
    ]);
      
    // Words written in the last 30days
    self.data = [];
    self.labels = [];
    self.words = [];
    let history = ChapterService.getWordsWrittenLast30Days();

    self.wordsTotal = 0;
    self.wordsAverage = 0;
    if (history.length > 0) {
      history.forEach(element => {
        self.labels.push(moment(String(element.day)).format(translations.date_format_moment));
        self.words.push(element.words);
        self.wordsTotal += element.words;
      });
      self.data.push(self.words);
      self.wordsAverage = Math.round(self.wordsTotal / 30 + Number.EPSILON);
      self.series = ['Words written'];
    }

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