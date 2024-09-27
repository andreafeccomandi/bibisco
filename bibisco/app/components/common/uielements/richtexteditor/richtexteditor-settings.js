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
  component('richtexteditorsettings', {
    templateUrl: 'components/common/uielements/richtexteditor/richtexteditor-settings.html',
    controller: RichtexteditorSettingsController,
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '='
    },
  });

function RichtexteditorSettingsController($scope, BibiscoDbConnectionService,
  BibiscoPropertiesService, hotkeys, RichTextEditorPreferencesService, SupporterEditionChecker) {

  var self = this;
  self.font;
  self.fontgroup;

  self.$onInit = function() {

    let supporterSuffix = SupporterEditionChecker.isSupporter() ? '' : '_ce';

    self.fontgroup = [{
      label: 'baskerville' + supporterSuffix,
      value: 'baskerville',
      buttonclass: 'bibiscoRichTextEditorSettings-baskerville'
    }, {
      label: 'courier',
      value: 'courier',
      buttonclass: 'bibiscoRichTextEditorSettings-courier'
    }, {
      label: 'garamond' + supporterSuffix,
      value: 'garamond',
      buttonclass: 'bibiscoRichTextEditorSettings-garamond'
    }, {
      label: 'georgia' + supporterSuffix,
      value: 'georgia',
      buttonclass: 'bibiscoRichTextEditorSettings-georgia'
    }, {
      label: 'arial',
      value: 'arial',
      buttonclass: 'bibiscoRichTextEditorSettings-arial'
    }, {
      label: 'palatino' + supporterSuffix,
      value: 'palatino',
      buttonclass: 'bibiscoRichTextEditorSettings-palatino'
    }, {
      label: 'times',
      value: 'times',
      buttonclass: 'bibiscoRichTextEditorSettings-times'
    }];
    self.setFont(BibiscoPropertiesService.getProperty('font'));

    self.fontsize = BibiscoPropertiesService.getProperty('font-size');
    self.fontsizegroup = [{
      label: 'common_small',
      value: 'small'
    }, {
      label: 'common_medium',
      value: 'medium'
    }, {
      label: 'common_big',
      value: 'big'
    },];
    self.indent = BibiscoPropertiesService.getProperty('indentParagraphEnabled');
    self.indentgroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];
    self.autocapitalize = BibiscoPropertiesService.getProperty('autocapitalizeEnabled');
    self.autocapitalizegroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];
    self.linespacing = BibiscoPropertiesService.getProperty('linespacing');
    self.linespacinggroup = [{
      label: '1',
      value: 10
    }, {
      label: '1.3',
      value: 13
    }, {
      label: '1.4',
      value: 14
    }, {
      label: '1.5',
      value: 15
    }, {
      label: '2',
      value: 20
    }];
    self.paragraphspacing = BibiscoPropertiesService.getProperty('paragraphspacing');
    self.paragraphspacinggroup = [{
      label: '0',
      value: 'none'
    }, {
      label: '0.5',
      value: 'small'
    }, {
      label: '1',
      value: 'medium'
    }, {
      label: '1.5',
      value: 'large'
    }, {
      label: '2',
      value: 'double'
    }];
    self.spellcheck = BibiscoPropertiesService.getProperty(
      'spellCheckEnabled');
    self.spellcheckgroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];

    hotkeys.bindTo($scope)
      .add({
        combo: ['enter', 'enter'],
        description: 'enter',
        callback: function ($event) {
          $event.preventDefault();
          self.ok();
        }
      });
  };

  self.selectItem = function(value) {
    if (value!=='courier' && value!=='times' && value!=='arial' ) {  
      SupporterEditionChecker.filterAction(function() {
        self.setFont(value);
      }, function() {
        self.setFont('courier');
      });
    } else {
      self.setFont(value);
    }
  };

  self.setFont = function(value) {
    for (let i = 0; i < self.fontgroup.length; i++) {
      const item = self.fontgroup[i];
      if (item.value === value) {
        self.font = item;
        break;
      }
    }
  };

  self.ok = function() {

    RichTextEditorPreferencesService.save({
      font: self.font.value,
      fontsize: self.fontsize,
      indentParagraphEnabled: self.indent,
      linespacing: self.linespacing,
      autocapitalizeEnabled: self.autocapitalize,
      paragraphspacing: self.paragraphspacing,
      spellCheckEnabled: self.spellcheck
    });

    BibiscoDbConnectionService.saveDatabase();

    self.close({
      $value: 'ok'
    });
  };

  self.cancel = function() {
    self.dismiss({
      $value: 'cancel'
    });
  };
}
