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
  component('analysischapterlength', {
    templateUrl: 'components/analysis/analysis-chapter-length.html',
    controller: AnalysisController,
    bindings: {

    }
  });

function AnalysisController($translate, AnalysisService, BibiscoPropertiesService, ChapterService) {

  var self = this;

  self.$onInit = function () {

    // load translations
    self.translations = $translate.instant([
      'common_chapters',
      'common_words',
      'part',
      'parts'
    ]);

    self.labels = [];
    self.data = [];
    self.partslabels = [];
    self.partsdata = [];
    self.partsenabled;


    let chaptersLength = AnalysisService.getChaptersLength();
    self.total = chaptersLength.total;
    self.totalcharacters = chaptersLength.totalcharacters;
    self.partsdelimiters = chaptersLength.partsdelimiters;
    self.partsenabled = chaptersLength.partsenabled;
    self.populateChapters(chaptersLength);
    self.populateParts(chaptersLength);
  };


  self.populateChapters = function (chaptersLength) {
    let words = chaptersLength.words;
    let chapterpositions = chaptersLength.chapterpositions;
    let max = 0;
   
    for (let i = 0; i < words.length; i++) {
      self.labels.push(ChapterService.getChapterPositionDescription(chapterpositions[i]));
      self.data.push(words[i]);
      if (words[i] > max) {
        max = words[i];
      }
    }

    self.options = self.calculateOptions(max, self.translations.common_chapters.toLowerCase());

    // add parts delimiters
    if (self.partsenabled) {
      let annotations = [];
      for (let i = 0; i < self.partsdelimiters.length; i++) {
        annotations.push(self.createPartAnnotation(self.partsdelimiters[i]));
      }
      self.options.annotation = {
        annotations: annotations
      };
    };
  };

  self.createPartAnnotation = function(partsdelimiter) {
    let content;

    if (!partsdelimiter.parts[0] && partsdelimiter.parts[1]) {
      content = '| ' + self.translations.part + ' #' + partsdelimiter.parts[1];
    } else if (partsdelimiter.parts[0] && !partsdelimiter.parts[1])  {
      content = self.translations.part + ' #' + partsdelimiter.parts[0] + ' |';
    } else {
      content = self.translations.part + ' #' + partsdelimiter.parts[0] + ' | ' + self.translations.part +' #' + partsdelimiter.parts[1];
    }

    return {
      type: 'line',
      mode: 'vertical',
      scaleID: 'x-axis-0',
      value: partsdelimiter.position,
      borderWidth: 3,
      borderColor: '#5CB85C',
      label: {
        content: content,
        enabled: true,
        position: 'top',
        backgroundColor: '#5CB85C'
      }
    };
  };

  self.populateParts = function (chaptersLength) {
    let words = chaptersLength.partswords;
    let max = 0;
   
    for (let i = 0; i < words.length; i++) {
      self.partslabels.push('#' + (i+1));
      self.partsdata.push(words[i]);
      if (words[i] > max) {
        max = words[i];
      }
    }
    self.partsoptions = self.calculateOptions(max, self.translations.parts.toLowerCase());
  };

  self.calculateOptions = function(max, xAxesLabelString) {

    let options;
    if (max > 10) {
      options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: xAxesLabelString
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: self.translations.common_words.toLowerCase()
            },
            ticks: {
              beginAtZero: true
            }
          }]
        }
      };
    } else {
      options = {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: xAxesLabelString
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: self.translations.common_words.toLowerCase()
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

    return options;
  };
}