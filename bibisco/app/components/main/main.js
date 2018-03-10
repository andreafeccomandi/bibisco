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
  component('main', {
    controller: MainController,
    templateUrl: 'components/loading/loading.html',
  });


function MainController($injector, $location, $timeout) {
  
  $timeout(function () {
    let BibiscoPropertiesService = $injector.get('BibiscoPropertiesService');
    let ContextService = $injector.get('ContextService');
    let FileSystemService = $injector.get('FileSystemService');
    let LoggerService = $injector.get('LoggerService');
    let ProjectService = $injector.get('ProjectService');

    let firstAccess = BibiscoPropertiesService.getProperty('firstAccess');
    let projectsDirectory = BibiscoPropertiesService.getProperty(
      'projectsDirectory');
    let projectsDirectoryExists = false;
  
    // Log installation information
    LoggerService.info('*** Application path: ' + ContextService.getAppPath());
    LoggerService.info('*** Bibisco version: ' + BibiscoPropertiesService.getProperty(
      'version'));
    LoggerService.info('*** First access: ' + firstAccess);
    LoggerService.info('*** Locale: ' + BibiscoPropertiesService.getProperty(
      'locale'));
    LoggerService.info('*** OS: ' + ContextService.getOs());
    LoggerService.info('*** Projects directory: ' + projectsDirectory);
  
    if (!firstAccess) {
      // check if projects directory still exists
      projectsDirectoryExists = FileSystemService.exists(projectsDirectory);
      LoggerService.info('*** Projects directory exists: ' +
        projectsDirectoryExists);
      if (!projectsDirectoryExists) {
        LoggerService.error(
          '*** Projects directory NOT EXISTS, so I clean bibisco db: restart from welcome page!'
        );
        BibiscoPropertiesService.setProperty('projectsDirectory', null);
        ProjectService.deleteAllProjectsFromBibiscoDb();
      }
    }
  
    // sync bibisco db with projects directory
    if (projectsDirectoryExists) {
      ProjectService.syncProjectDirectoryWithBibiscoDb();
    }
  
    // Routing based on first access or not
    if (firstAccess || !projectsDirectoryExists) {
      $location.path('/welcome');
    } else {
      $location.path('/start');
    }
  }, 1000);

  $location.path('/loading');
}
