/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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
      changegroupfilterfunction: '&',
      carddimension: '@',
      dndenabled: '@',
      dropfunction: '&',
      emptylisttext: '@',
      emptylistbuttonlabel: '@',
      emptylistbuttonfunction: '&',
      emptylistbuttontooltip: '@',
      emptyselectedgrouptext: '@',
      family: '@',
      hastext: '<',
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
      scrollable: '<',
      selectfunction: '&',
      showgroupfilter: '<',
      showwordsgoalcounter: '<',
      subheader: '<',
      supportersonly: '<'
    }
  });


function CardGridController() {

  var self = this;

  self.$onInit = function() {

    self.cardgriditemsboxcontainerclass;
    if (self.pageheadersubtitle && self.scrollable) {
      self.cardgriditemsboxcontainerclass = 'scrollable-box-full-height-page-with-header-subtitle';
    } else if (!self.pageheadersubtitle && self.scrollable){
      self.cardgriditemsboxcontainerclass = 'scrollable-box-full-height-page-with-header';
    }
    self.tipenabled = (self.pageheadertipcode && self.items && self.items.length>1);
  };
}
