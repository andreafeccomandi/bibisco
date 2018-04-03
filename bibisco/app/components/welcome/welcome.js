/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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
  component('welcome', {
    templateUrl: 'components/welcome/welcome.html',
    controller: WelcomeController
  });


function WelcomeController($location, $rootScope, $scope,
  BibiscoDbConnectionService, BibiscoPropertiesService,
  FileSystemService, LocaleService, LoggerService, ProjectService) {
  
  var self = this;
  self.$onInit = function () {
    $rootScope.$emit('SHOW_WELCOME');
    self.selectedProjectsDirectory = null;
    self.step = 0;
    self.showLicenseTextExpressAcceptance = false;
    self.forbiddenDirectory = false;
  };

  self.selectProjectsDirectory = function(directory) {
    self.selectedProjectsDirectory = directory;
    self.forbiddenDirectory = false;
    $scope.$apply();
  };
  self.acceptLicense = function () {
    self.showLicenseTextExpressAcceptance = true;    
  };
  self.expressAccept = function () {
    self.step = 1;
  };
  self.next = function() {
    self.step = 2;
  };
  self.back = function() {
    self.step = 1;
  };
  self.finish = function(isValid) {
    if (isValid) {

      var projectsDirectory = ProjectService.createProjectsDirectory(self.selectedProjectsDirectory);
      if (projectsDirectory) {
        BibiscoPropertiesService.setProperty('locale', LocaleService.getCurrentLocale());
        BibiscoPropertiesService.setProperty('projectsDirectory',
          projectsDirectory);
        BibiscoPropertiesService.setProperty('firstAccess', false);
        BibiscoDbConnectionService.saveDatabase();

        // sync bibisco db with projects directory
        ProjectService.syncProjectDirectoryWithBibiscoDb();

        LoggerService.debug('Saved preferences: selectedLanguage=' +
          LocaleService.getCurrentLocale() +
          ' - selectedProjectsDirectory=' + self.selectedProjectsDirectory);

        $location.path('/start');
      } else {
        self.forbiddenDirectory = true;
      }
    }

  };
  
}
