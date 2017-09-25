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
component('detailfooterleftbuttonbar', {
  templateUrl: 'components/common/uielements/detail-footer/detail-footer-left-buttonbar.html',
  controller: DetailFooterLeftButtonbarController,
  bindings: {
    editmode: '<',
    imagesenabled: '<',
    showimagesfunction: '&',
    showprojectexplorer: '=',
    tagsenabled: '<',
    tagsfunction: '&',
    words: '<'
  }
});

function DetailFooterLeftButtonbarController($location, LoggerService,
  PopupBoxesService) {

  LoggerService.debug('Start DetailFooterLeftButtonbarController...');

  var self = this;

  self.toggleProjectExplorer = function() {
    self.showprojectexplorer = !self.showprojectexplorer;
  }

  LoggerService.debug('End DetailFooterLeftButtonbarController...');
}
