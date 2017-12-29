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
  component('analysischapterlength', {
    templateUrl: 'components/analysis/analysis-chapter-length.html',
    controller: AnalysisController,
    bindings: {

    }
  });

function AnalysisController() {

  var self = this;

  self.$onInit = function () {

    self.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 
      'Friday', 'Saturday', 'Sunday', 'Lunedì', 'Martedì', 'Mercoledì', 
      'Giovedì', 'Venerdì', 'Sabato', 'Domenica', 'Monday', 'Tuesday', 
      'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    self.type = 'StackedBar';
    self.series = ['2015', '2016'];
    self.options = {
      scales: {
        xAxes: [{
          stacked: true,
        }],
        yAxes: [{
          stacked: true
        }]
      }
    };

    self.data = [
      [65, 59, 90, 81, 56, 55, 40, 65, 59, 90, 81, 56, 55, 40, 65, 59, 90, 81, 56, 55, 40],
      [28, 48, 40, 19, 96, 27, 100, 28, 48, 40, 19, 96, 27, 100, 28, 48, 40, 19, 96, 27, 100]
    ];
  };
}