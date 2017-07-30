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
component('richtexteditorsettings', {
  templateUrl: 'components/common/uielements/richtexteditor/richtexteditor-settings.html',
  controller: RichtexteditorSettingsController,
  bindings: {
    close: '&',
    dismiss: '&'
  },
});

function RichtexteditorSettingsController(LoggerService) {
  LoggerService.debug('Start RichtexteditorSettingsController...');

  var self = this;
  self.font;

  self.$onInit = function() {
    self.font = 'courier';
  };

  self.changefont = function(font) {
    self.font = font;
  }

  self.ok = function() {
    self.close({
      $value: 'ok'
    });
  };

  self.cancel = function() {
    self.dismiss({
      $value: 'cancel'
    });
  };

  LoggerService.debug('End RichtexteditorSettingsController...');
}
