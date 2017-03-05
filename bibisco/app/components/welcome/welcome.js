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


function WelcomeController($scope, $location, LocaleService, LoggerService,
  BibiscoDbService) {
  LoggerService.debug('Start WelcomeController...');
  var self = this;
  self.selectedProjectsDirectory = null;
  self.step = 1;
  self.selectProjectsDirectory = function(directory) {
    self.selectedProjectsDirectory = directory;
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

      BibiscoDbService.setProperty('locale', LocaleService.getCurrentLocale());
      BibiscoDbService.setProperty('projectsDirectory', self.selectedProjectsDirectory);
      BibiscoDbService.setProperty('firstAccess', false);
      BibiscoDbService.saveDatabase();

      LoggerService.debug('Saved preferences: selectedLanguage=' +
        LocaleService.getCurrentLocale() +
        ' - selectedProjectsDirectory=' + self.selectedProjectsDirectory);

      $location.path('/start');
    }

  }
  LoggerService.debug('End WelcomeController...');
}
