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
component('welcome', {
  templateUrl: 'components/welcome/welcome.html',
  controller: WelcomeController
});


function WelcomeController($scope, $location, BibiscoDbService,
  BibiscoPropertiesDaoService, ContextService,
  FileSystemService, LocaleService, LoggerService) {
  LoggerService.debug('Start WelcomeController...');
  var self = this;
  self.selectedProjectsDirectory = null;
  self.step = 1;
  self.forbiddenDirectory = false;

  self.selectProjectsDirectory = function(directory) {
    self.selectedProjectsDirectory = directory;
    self.forbiddenDirectory = false;
    $scope.$apply();
  }
  self.next = function() {
    self.step = 2;
  }
  self.back = function() {
    self.step = 1;
  }
  self.finish = function(isValid) {
    if (isValid) {

      BibiscoPropertiesDaoService.setProperty('locale', LocaleService.getCurrentLocale());

      var projectsDirectory;
      if (self.selectedProjectsDirectory.endsWith(
          "_internal_bibisco_projects_db_")) {
        projectsDirectory = self.selectedProjectsDirectory;
      } else {
        projectsDirectory = self.selectedProjectsDirectory + ContextService
          .getFileSeparator() + '_internal_bibisco_projects_db_';
      }

      var directoryCreated = FileSystemService.createDirectory(
        projectsDirectory);

      if (directoryCreated) {
        BibiscoPropertiesDaoService.setProperty('projectsDirectory',
          projectsDirectory);
        BibiscoPropertiesDaoService.setProperty('firstAccess', false);
        BibiscoDbService.saveDatabase();

        LoggerService.debug('Saved preferences: selectedLanguage=' +
          LocaleService.getCurrentLocale() +
          ' - selectedProjectsDirectory=' + self.selectedProjectsDirectory);

        $location.path('/start');
      } else {
        self.forbiddenDirectory = true;
      }
    }

  }
  LoggerService.debug('End WelcomeController...');
}

function createInternalBibiscoProjectsDB() {

}
