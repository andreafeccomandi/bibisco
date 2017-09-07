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
component('cardgrid', {
  templateUrl: 'components/common/uielements/card-grid/card-grid.html',
  controller: CardGridController,
  bindings: {
    carddimension: '@',
    dndenabled: '@',
    dropfunction: '&',
    emptylistboxtext: '@',
    emptylistboxbuttonlabel: '@',
    emptylistboxbuttonfunction: '&',
    family: '@',
    items: '<',
    pageheaderbuttonlabel: '@',
    pageheaderbuttonfunction: '&',
    pageheadertitle: '@',
    pageheadersubtitle: '@',
    selectfunction: '&',
    type: '@'
  }
});


function CardGridController(LoggerService) {
  LoggerService.debug('Start CardGridController...');

  var self = this;

  self.$onInit = function() {

    let headersubtitleclass;
    if (self.pageheadersubtitle) {
      headersubtitleclass = 'with-header-subtitle';
    } else {
      headersubtitleclass = 'no-header-subtitle';
    }
    self.gridclass = 'card-grid-items-' + headersubtitleclass + '-' + self.type;
    self.headerclass = 'card-grid-header-' + self.type;
  }

  LoggerService.debug('End CardGridController...');
}
