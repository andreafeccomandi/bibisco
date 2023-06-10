/* 
 * Copyright (C) 2014-2023 Andrea Feccomandi
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
    const os = require('os');
    let BibiscoPropertiesService = $injector.get('BibiscoPropertiesService');
    let ContextService = $injector.get('ContextService');
    let FileSystemService = $injector.get('FileSystemService');
    let LocaleService = $injector.get('LocaleService');
    let LoggerService = $injector.get('LoggerService');
    let ProjectService = $injector.get('ProjectService');
    let SupporterEditionChecker = $injector.get('SupporterEditionChecker');

    let currentVersionInitialized = BibiscoPropertiesService.isCurrentVersionInitialized();
    let projectsDirectory = BibiscoPropertiesService.getProperty('projectsDirectory');
    let projectsDirectoryExists = false;
    let backupDirectory = BibiscoPropertiesService.getProperty('backupDirectory');
    let backupDirectoryExists = false;
  
    // Log installation information
    LoggerService.info('*** Application path: ' + ContextService.getAppPath());
    LoggerService.info('*** Bibisco version: ' + BibiscoPropertiesService.getProperty(
      'version'));
    LoggerService.info('*** Current version initialized: ' + currentVersionInitialized);
    if (currentVersionInitialized && SupporterEditionChecker.isTrialActive()) {
      LoggerService.info('*** Remaining trial days: ' + SupporterEditionChecker.getRemainingTrialDays());
    } else if (SupporterEditionChecker.isTrialExpired()) {
      LoggerService.info('*** Trial expired! ');
    }
    LoggerService.info('*** Actual user: ' + os.userInfo().username);
    LoggerService.info('*** Locale: ' + LocaleService.getCurrentLocale());
    LoggerService.info('*** OS: ' + ContextService.getOs());
    LoggerService.info('*** Projects directory: ' + projectsDirectory);
    LoggerService.info('*** Backup directory: ' + backupDirectory);
  
    if (currentVersionInitialized) {
      // check if projects directory still exists
      projectsDirectoryExists = FileSystemService.exists(projectsDirectory);
      LoggerService.info('*** Projects directory exists: ' + projectsDirectoryExists);
      if (!projectsDirectoryExists) {
        LoggerService.error(
          '*** Projects directory NOT EXISTS, so I clean bibisco db: restart from welcome page!'
        );
      }
      // check if backup directory still exists
      backupDirectoryExists = FileSystemService.exists(backupDirectory);
      LoggerService.info('*** Backup directory exists: ' + backupDirectoryExists);
      if (!backupDirectoryExists) {
        LoggerService.error(
          '*** Backup directory NOT EXISTS: restart from welcome page!'
        );
      }
    } else {
      // if current version is not initialized delete previous dictionaries if exist
      FileSystemService.cleanDirectory(ContextService.getDictionaryDirectoryPath());
      LoggerService.info('*** Dictionaries directory cleaned!');
    }
  
    // sync bibisco db with projects directory
    if (projectsDirectoryExists) {
      ProjectService.syncProjectDirectoryWithBibiscoDb();
    }
  
    // Routing based on current version initialized, projects directory and backup directory exist
    if (!currentVersionInitialized || !projectsDirectoryExists || !backupDirectoryExists) {
      $location.path('/welcome');
    } else {
      $location.path('/start');
    }
  }, 1000);

  $location.path('/loading');
}
