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

  // show menu
  $rootScope.$emit('SHOW_MENU');

  LoggerService.debug('End ChaptersController...');
}
