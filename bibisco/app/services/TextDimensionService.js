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

angular.module('bibiscoApp').service('TextDimensionService', function(BibiscoPropertiesService) {
  'use strict';

  return {
    BUTTON_STANDARD_MARGIN: 40,

    calculateButtonFontSize: function() {
      let zoomLevel = BibiscoPropertiesService.getProperty('zoomLevel');
      let fontSize;
      if (zoomLevel === 100) {
        fontSize = '14px';
      } else if (zoomLevel === 115) {
        fontSize = '16px';
      } else if (zoomLevel === 130) {
        fontSize = '18px';
      }
      return fontSize;
    },

    calculateElementDimension: function(element) {
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');
      ctx.font = this.calculateButtonFontSize() + ' Arial';
      let width = ctx.measureText(element).width;
      return width;
    }
  };
});
