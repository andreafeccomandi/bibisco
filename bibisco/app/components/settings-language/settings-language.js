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
component('settingslanguage', {
  templateUrl: 'components/settings-language/settings-language.html',
  controller: SettingsLanguageController
});

function SettingsLanguageController($location, BibiscoPropertiesService,
  LocaleService, LoggerService, ProjectService) {
  LoggerService.debug('Start SettingsLanguageController...');
  var self = this;
  self.selectedLanguage;
  self.languageChanged = false;

  self.change = function(selectedLanguage) {
    self.selectedLanguage = selectedLanguage;
    self.languageChanged = true;
  }

  self.save = function() {
    LocaleService.setCurrentLocale(self.selectedLanguage);
    BibiscoPropertiesService.setProperty('locale', LocaleService.getCurrentLocale());
    $location.path('/start');
  }

  self.backWithoutConfirm = function() {
    if (!self.languageChanged) {
      $location.path('/start');
    }
  }

  self.backWithConfirm = function() {
    $location.path('/start');
  }

  LoggerService.debug('End SettingsLanguageController...');
}
