/*
 * Copyright (C) 2014-2019 Andrea Feccomandi
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
  LocaleService, LoggerService, ProjectService) {
  
  var self = this;
  const os = require('os');
  self.$onInit = function () {
    $rootScope.$emit('SHOW_WELCOME');

    // check for first access
    let firstAccess = BibiscoPropertiesService.getProperty('firstAccess');
    
    // check if the current user has accepted the license
    self.actualUser = os.userInfo().username;
    self.signers = BibiscoPropertiesService.getProperty('signers');
    let actualUserInSigners = self.isActualUserInSigners();

    self.previousProjectsDirectory = null;
    self.selectedProjectsDirectory = null;
    self.forbiddenDirectory = false;
    if (firstAccess || !actualUserInSigners) {
      self.step = 0;
      self.showLicenseTextExpressAcceptance = false;
    } else {
      self.step = 2;
      let previousProjectsDirectory = BibiscoPropertiesService.getProperty('projectsDirectory');
      // show directory name without "/_internal_bibisco2_projects_db_"
      // that is 32 characters
      self.previousProjectsDirectory = previousProjectsDirectory.substring(0,
        previousProjectsDirectory.length - 32);
    }
  };

  self.isActualUserInSigners = function() {
    let actualUserInSigners = false;
    self.signers.forEach(element => {
      if (self.actualUser === element) {
        actualUserInSigners = true;
      }
    });

    return actualUserInSigners;
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
        BibiscoPropertiesService.setProperty('projectsDirectory', projectsDirectory);
        BibiscoPropertiesService.setProperty('firstAccess', false);
        if (!self.isActualUserInSigners()) {
          self.signers.push(self.actualUser);
          BibiscoPropertiesService.setProperty('signers', self.signers);
          LoggerService.info('*** Added ' + self.actualUser + ' to signers');
        }
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
