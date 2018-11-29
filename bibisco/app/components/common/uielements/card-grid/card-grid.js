/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  component('cardgrid', {
    templateUrl: 'components/common/uielements/card-grid/card-grid.html',
    controller: CardGridController,
    bindings: {
      carddimension: '@',
      dndenabled: '@',
      dropfunction: '&',
      emptylisttext: '@',
      emptylistbuttonlabel: '@',
      emptylistbuttonfunction: '&',
      emptylistbuttontooltip: '@',
      family: '@',
      items: '<',
      pageheaderbuttonfunction: '&',
      pageheaderbuttonhotkey: '<',
      pageheaderbuttonlabel: '@',
      pageheaderbuttontooltip: '@',
      pageheadertitle: '@',
      pageheadersubtitle: '@',
      pageheadertipcode: '@',
      pageheadercharacters: '<',
      pageheaderwords: '<',
      selectfunction: '&',
      type: '@'
    }
  });


function CardGridController() {

  var self = this;

  self.$onInit = function() {

    let headersubtitleclass;
    if (self.pageheadersubtitle) {
      headersubtitleclass = 'with-header-subtitle';
    } else {
      headersubtitleclass = 'no-header-subtitle';
    }
    self.gridclass = 'card-grid-items-' + headersubtitleclass + '-' + self.type;
    self.emptygridclass = 'card-grid-emptyitems-' + headersubtitleclass + '-' +
      self.type;
    self.headerclass = 'card-grid-header-' + self.type;
    self.tipenabled = (self.pageheadertipcode && self.items && self.items.length>1);
  };
}
