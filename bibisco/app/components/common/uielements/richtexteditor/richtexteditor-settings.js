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
  self.fontgroup;

  self.$onInit = function() {
    self.font = 'times';
    self.fontgroup = [{
      label: 'jsp.richTextEditorSettings.font.courier',
      value: 'courier',
      buttonclass: 'bibiscoRichTextEditorSettings-courier'
    }, {
      label: 'jsp.richTextEditorSettings.font.times',
      value: 'times',
      buttonclass: 'bibiscoRichTextEditorSettings-times'
    }, {
      label: 'jsp.richTextEditorSettings.font.arial',
      value: 'arial',
      buttonclass: 'bibiscoRichTextEditorSettings-arial'
    }];
    self.fontsize = 'medium';
    self.fontsizegroup = [{
      label: 'jsp.richTextEditorSettings.fontsize.big',
      value: 'big'
    }, {
      label: 'jsp.richTextEditorSettings.fontsize.medium',
      value: 'medium'
    }, {
      label: 'jsp.richTextEditorSettings.fontsize.small',
      value: 'small'
    }];
    self.indent = 'true';
    self.indentgroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];
    self.spellcheck = 'true';
    self.spellcheckgroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];
    self.autosave = 'true';
    self.autosavegroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];
  };

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
