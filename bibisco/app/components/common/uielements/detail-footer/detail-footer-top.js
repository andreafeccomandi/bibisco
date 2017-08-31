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
component('detailfootertop', {
  templateUrl: 'components/common/uielements/detail-footer/detail-footer-top.html',
  controller: DetailFooterTopController,
  bindings: {
    autosaveenabled: '<',
    characters: '<',
    lastsave: '<',
    words: '<',
    wordscharactersenabled: '<'
  }
});


function DetailFooterTopController(LoggerService) {

  LoggerService.debug('Start DetailFooterTopController...');

  var self = this;

  LoggerService.debug('End DetailFooterTopController...');
}
