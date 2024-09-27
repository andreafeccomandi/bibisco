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
  component('colorpickerfield', {
    templateUrl: 'components/common/forms/color-picker-field/color-picker-field.html',
    controller: ColorPickerFieldController,
    bindings: {
      form: '<',
      model: '=',
      label: '@',
      labelcols: '@',
      inputcols: '@'
    }
  });


function ColorPickerFieldController() {

  let self = this;
  const colors = ['#FFC0CB', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#004586', '#0084D1', '#03A9F4', '#00BCD4', '#009688', '#579D1C', '#AECF00', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722', '#FF0000', '#7E0021', '#795548', '#607D8B'];
    
  self.$onInit = function() {
    if (!self.model) {
      self.model = colors[0];
    }
    self.colorItems = [];
    self.initColorPicker();
  };

  self.initColorPicker = function() {
    self.colorItems = [];
    for (let i = 0; i < colors.length; i++) {
      self.colorItems.push({
        color: colors[i],
        selected: colors[i] === self.model ? true : false
      });
    }
  };

  self.selectColor = function(color) {
    self.model = color;
    self.initColorPicker();
    self.form.$dirty = true; 
  };
}
