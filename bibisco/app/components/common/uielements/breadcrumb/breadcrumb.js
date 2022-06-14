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
  component('breadcrumb', {
    templateUrl: 'components/common/uielements/breadcrumb/breadcrumb.html',
    controller: BreadcrumbController,
    bindings: {
      imgoffset: '<',
      items: '<',
      linkdisabled: '<'
    }
  });

function BreadcrumbController($location, $translate, $window, TextDimensionService) {
  var self = this;

  self.$onInit = function () {
    self.calculateItemsSpace();
    $window.addEventListener('resize', self.onResize);
  };

  self.$onDestroy = function () {
    $window.removeEventListener('resize', self.onResize);
  };

  self.onResize = function () {
    self.calculateItemsSpace();
  };

  self.followlink = function(path) {
    $location.path(path);
  };


  self.calculateItemsSpace = function() {
    
    let leftOffset = self.imgoffset ? 550 : 450;
    let itemQuota = ($window.innerWidth - leftOffset) / self.items.length;
    let residualQuota = 0;
    let needExtraQuotaItem;
    let needExtraQuotaValue;
    let labelWidths =[];
    for (let i = 0; i < self.items.length; i++) {
      let calculatedLabelWidth = TextDimensionService.calculateElementDimension($translate.instant(self.items[i].label)) + 5;
      let labelWidth;
      if (calculatedLabelWidth > itemQuota) {
        labelWidth = itemQuota;
        needExtraQuotaItem = i;
        needExtraQuotaValue = calculatedLabelWidth;
      } else {
        labelWidth = calculatedLabelWidth;
        residualQuota += itemQuota - calculatedLabelWidth;
      }
      labelWidths.push(labelWidth);
    }
    if (needExtraQuotaItem) {    
      if ((labelWidths[needExtraQuotaItem] +residualQuota-50) < needExtraQuotaValue) { 
        labelWidths[needExtraQuotaItem] += residualQuota-50;
      } else {
        labelWidths[needExtraQuotaItem] = needExtraQuotaValue;
      }
    } 

    for (let i = 0; i < self.items.length; i++) {
      self.items[i].style = 'width: '+labelWidths[i]+'px'; 
    }
  };
}
