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
component('chapters', {
  templateUrl: 'components/chapters/chapters.html',
  controller: ChaptersController,
  bindings: {

  }
});

function ChaptersController($location, $rootScope, $scope, ChapterService,
  LoggerService) {
  LoggerService.debug('Start ChaptersController...');

  var self = this;

  self.create = function() {
    $location.path('/chaptertitle/new/0');
  }

  self.getCardGridItems = function() {
    let items;
    if (ChapterService.getChaptersCount() > 0) {
      let chapters = ChapterService.getChapters();
      items = [];
      for (let i = 0; i < chapters.length; i++) {
        items.push({
          characters: chapters[i].characters,
          id: chapters[i].$loki,
          position: chapters[i].position,
          status: chapters[i].status,
          text: chapters[i].title,
          title: '#' + chapters[i].position,
          words: chapters[i].words
        });
      }
    }
    return items;
  }

  self.move = function(draggedObjectId, destinationObjectId) {
    ChapterService.move(draggedObjectId, destinationObjectId);
    self.cardgriditems = this.getCardGridItems();
    $scope.$apply();
  }

  self.select = function(id) {
    $location.path('/chapters/' + id);
  }

  self.cardgriditems = this.getCardGridItems();

  LoggerService.debug('End ChaptersController...');
}
