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

function ChaptersController($location, $rootScope, LoggerService) {
  LoggerService.debug('Start ChaptersController...');
  var self = this;

  self.chapters = [{
    'id': 75,
    'position': 1,
    'title': 'Ho un problema Charlie Brown',
    'status': 'done',
    'words': 751,
    'characters': 112
  }, {
    'id': 17,
    'position': 2,
    'title': 'Inizio della fine. La fine di inizio. Bye.',
    'status': 'tocomplete',
    'words': 2918,
    'characters': 9321
  }, {
    'id': 68,
    'position': 4,
    'title': 'Hui!',
    'status': 'todo',
    'words': 93,
    'characters': 2302
  }, {
    'id': 33,
    'position': 3,
    'title': 'Shultz',
    'status': 'done',
    'words': 751,
    'characters': 112
  }, {
    'id': 13,
    'position': 5,
    'title': 'Leroy Merlin',
    'status': 'done',
    'words': 23,
    'characters': 321
  }];

  self.move = function(draggedObjectId, destinationObjectId) {

    alert('move: draggedObjectId=' + draggedObjectId +
      ' - destinationObjectId=' + destinationObjectId);

    self.chapters = [{
      'id': 75,
      'position': 1,
      'title': 'Ho un problema Charlie Brown',
      'status': 'done',
      'words': 751,
      'characters': 112
    }, {
      'id': 17,
      'position': 2,
      'title': 'Inizio della fine. La fine di inizio. Bye.',
      'status': 'tocomplete',
      'words': 2918,
      'characters': 9321
    }, {
      'id': 68,
      'position': 4,
      'title': 'Hui!',
      'status': 'todo',
      'words': 93,
      'characters': 2302
    }, {
      'id': 33,
      'position': 3,
      'title': 'Shultz',
      'status': 'done',
      'words': 751,
      'characters': 112
    }, {
      'id': 13,
      'position': 5,
      'title': 'Leroy Merlin',
      'status': 'done',
      'words': 23,
      'characters': 321
    }];
  }

  LoggerService.debug('End ChaptersController...');
}
