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
component('settings', {
  templateUrl: 'components/settings/settings.html',
  controller: SettingsController
});

function SettingsController($location, $rootScope, $scope,
  BibiscoDbConnectionService, BibiscoPropertiesService,
  LocaleService, LoggerService, UtilService, ProjectService) {
  LoggerService.debug('Start SettingsController...');

  var self = this;
  self.selectedLanguage = LocaleService.getCurrentLocale();
  let currentProjectsDirectory = BibiscoPropertiesService.getProperty(
    'projectsDirectory');

  // show directory name without "/_internal_bibisco2_projects_db_"
  // that is 32 characters
  self.selectedProjectsDirectory = currentProjectsDirectory.substring(0,
    currentProjectsDirectory.length - 32);

  self.forbiddenDirectory = false;

  self.selectLanguage = function(selectedLanguage) {
    self.selectedLanguage = selectedLanguage;
  }

  self.selectProjectsDirectory = function(directory) {
    self.selectedProjectsDirectory = directory;
    self.forbiddenDirectory = false;
    $scope.settingsForm.$setDirty();
    $scope.$apply();
  }

  self.save = function(isValid, isDirty) {
    LoggerService.debug('save: isValid = ' + isValid + ' - isDirty = ' +
      isDirty);

    if (!isDirty) {
      $location.path('/start');
    } else if (isValid) {

      var projectsDirectory = ProjectService.createProjectsDirectory(self.selectedProjectsDirectory);
      if (projectsDirectory) {
        LocaleService.setCurrentLocale(self.selectedLanguage);
        BibiscoPropertiesService.setProperty('locale', LocaleService.getCurrentLocale());
        BibiscoPropertiesService.setProperty('projectsDirectory',
          projectsDirectory);
        BibiscoDbConnectionService.saveDatabase();

        // sync bibisco db with projects directory
        ProjectService.syncProjectDirectoryWithBibiscoDb();

        LoggerService.debug('Saved preferences: selectedLanguage=' +
          LocaleService.getCurrentLocale() +
          ' - selectedProjectsDirectory=' + self.selectedProjectsDirectory
        );

        $location.path('/start');
      } else {
        self.forbiddenDirectory = true;
      }
    }
  }

  self.back = function() {
    $location.path('/start');
  }

  LoggerService.debug('End SettingsController...');
}
