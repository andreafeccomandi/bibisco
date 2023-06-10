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
  component('welcome', {
    templateUrl: 'components/welcome/welcome.html',
    controller: WelcomeController
  });


function WelcomeController($location, $rootScope, $scope,
  BibiscoDbConnectionService, BibiscoPropertiesService, DictionaryService,
  FileSystemService, LocaleService, LoggerService, ProjectService) {
  
  let self = this;
  const os = require('os');
  const path = require('path');
  const ipc = require('electron').ipcRenderer;
  const INTERNAL_PROJECTS_DIR = '_internal_bibisco2_projects_db_';

  self.$onInit = function () {
    $rootScope.$emit('SHOW_WELCOME');

    // check if current version is initialized
    let currentVersionInitialized = BibiscoPropertiesService.isCurrentVersionInitialized();

    // check if there is a previous version installed
    self.previousVersionInstalled = BibiscoPropertiesService.isPreviousVersionInstalled();
   
    self.previousProjectsDirectory = null;
    self.selectedProjectsDirectory = null;
    self.forbiddenDirectory = false;
    self.repairingProjectsDirectory = false;
    self.previousBackupDirectory = null;
    self.selectedBackupDirectory = null;
    self.forbiddenBackupDirectory = false;
    self.repairingBackupDirectory = false;
    self.backupDirectoryEqualToProjectsDirectory = false;
    self.backupDirectoryCustomErrorMessage = null;
    self.saveFunction;

    self.dictionaryLoadedListener = function(event) {
      $location.path('/start');
      $scope.$apply();
    };
    ipc.once('DICTIONARY_LOADED', self.dictionaryLoadedListener);

    if (!currentVersionInitialized) {
      self.step = 0;
      self.saveFunction = self.finish;
      self.repairmode = false;
      self.showLicenseTextExpressAcceptance = false;
    } else {
      self.step = 2;
      self.saveFunction = self.repair;
      self.repairmode = true;

      // check if projects directory still exists
      let savedProjectsDirectory = BibiscoPropertiesService.getProperty('projectsDirectory');
      if (!FileSystemService.exists(savedProjectsDirectory)) {
        self.repairingProjectsDirectory = true;
        self.previousProjectsDirectory = savedProjectsDirectory;
        // show directory name without "/_internal_bibisco2_projects_db_"
        self.previousProjectsDirectory = self.previousProjectsDirectory.substring(0, self.previousProjectsDirectory.length - INTERNAL_PROJECTS_DIR.length);
      }

      // check if backup directory still exists
      let savedBackupDirectory = BibiscoPropertiesService.getProperty('backupDirectory');
      if (!FileSystemService.exists(savedBackupDirectory)) {
        self.repairingBackupDirectory = true;
        self.previousBackupDirectory = savedBackupDirectory;
      }      
    }
  };

  self.$onDestroy = function () {
    ipc.removeListener('DICTIONARY_LOADED', self.dictionaryLoadedListener);
  };

  self.isProjectsDirectoryEqualsToBackupDirectory = function(projectsDirectory, backupDirectory) {

    let projectsDirectoryToCheck = projectsDirectory.endsWith(INTERNAL_PROJECTS_DIR) ? 
      projectsDirectory : FileSystemService.concatPath(projectsDirectory, INTERNAL_PROJECTS_DIR);
    let backupDirectoryToCheck = backupDirectory.endsWith(INTERNAL_PROJECTS_DIR) ? 
      backupDirectory : FileSystemService.concatPath(backupDirectory, INTERNAL_PROJECTS_DIR);

    return projectsDirectoryToCheck === backupDirectoryToCheck;
  };

  self.selectProjectsDirectory = function(directory) {
    self.selectedProjectsDirectory = directory;
    self.forbiddenDirectory = false;
    self.projectsDirectoryCustomErrorMessage = null;
    $scope.$apply();
  };

  self.selectBackupDirectory = function(directory) {
    self.selectedBackupDirectory = directory;
    self.forbiddenBackupDirectory = false;
    self.backupDirectoryCustomErrorMessage = null;
    $scope.$apply();
  };

  self.acceptLicense = function () {
    self.showLicenseTextExpressAcceptance = true;    
  };
  self.expressAccept = function () {
    BibiscoPropertiesService.initializeCurrentVersion();
    if (self.previousVersionInstalled) {
      $location.path('/start');
    } else {
      self.step = 1;
    }
  };
  self.next = function() {
    self.step = 2;
  };
  self.back = function() {
    self.step = 1;
  };
  self.finish = function(isValid) {
    if (isValid) {

      // check if I can write selected projects directory
      if (!FileSystemService.canWriteDirectory(self.selectedProjectsDirectory)) {
        self.forbiddenDirectory = true;
      }
      // check if I can write selected backup directory
      if (!FileSystemService.canWriteDirectory(self.selectedBackupDirectory)) {
        self.forbiddenBackupDirectory = true;
      }

      self.backupDirectoryEqualToProjectsDirectory = self.isProjectsDirectoryEqualsToBackupDirectory(self.selectedProjectsDirectory, self.selectedBackupDirectory);
      self.backupDirectoryCustomErrorMessage = self.backupDirectoryEqualToProjectsDirectory ? 'backup_directory_equal_to_projects_directory_error' : null;

      if (!self.forbiddenDirectory && !self.forbiddenBackupDirectory && !self.backupDirectoryEqualToProjectsDirectory) {

        // save properties
        BibiscoPropertiesService.setProperty('locale', LocaleService.getCurrentLocale());
        BibiscoPropertiesService.setProperty('projectsDirectory', ProjectService.createProjectsDirectory(self.selectedProjectsDirectory));
        BibiscoPropertiesService.setProperty('backupDirectory', self.selectedBackupDirectory);
        BibiscoDbConnectionService.saveDatabase();

        // sync bibisco db with projects directory
        ProjectService.syncProjectDirectoryWithBibiscoDb();

        LoggerService.debug('Saved preferences: selectedLanguage=' +
          LocaleService.getCurrentLocale() +
          ' - selected projects directory=' + self.selectedProjectsDirectory +
          ' - selected backup directory=' + self.selectedBackupDirectory);

        // unpack dictionary
        let currentLocale = LocaleService.getCurrentLocale();
        let dictionaryLanguage = currentLocale === 'es' ? 'es-es' : currentLocale;
        DictionaryService.unpackAndLoadDictionary(dictionaryLanguage);
        self.step = 3;
      } 
    }
  };

  self.repair = function(isValid) {

    if (isValid) {

      LoggerService.debug('Repairing: ' + (self.repairingProjectsDirectory ? ' - projects directory ' : ' ') + 
        (self.repairingBackupDirectory ? ' - backup directory' : '') );

      // check if I can write selected projects directory
      if (self.repairingProjectsDirectory && !FileSystemService.canWriteDirectory(self.selectedProjectsDirectory)) {
        self.forbiddenDirectory = true;
      }
      // check if I can write selected backup directory
      if (self.repairingBackupDirectory && !FileSystemService.canWriteDirectory(self.selectedBackupDirectory)) {
        self.forbiddenBackupDirectory = true;
      }

      // check if projects directory and backup directory are not the same
      let projectsDirectoryToCheck = self.repairingProjectsDirectory ? self.selectedProjectsDirectory : BibiscoPropertiesService.getProperty('projectsDirectory');
      let backupDirectoryToCheck = self.repairingBackupDirectory ? self.selectedBackupDirectory : BibiscoPropertiesService.getProperty('backupDirectory');
      self.backupDirectoryEqualToProjectsDirectory = self.isProjectsDirectoryEqualsToBackupDirectory(projectsDirectoryToCheck, backupDirectoryToCheck);
      
      if (self.backupDirectoryEqualToProjectsDirectory) {
        // I always associate the error with the backup directory select, 
        // except if I'm repairing only the project directory
        if (self.repairingProjectsDirectory && !self.repairingBackupDirectory) {
          self.projectsDirectoryCustomErrorMessage = 'projects_directory_equal_to_backup_directory_error';
        } else {
          self.backupDirectoryCustomErrorMessage = 'backup_directory_equal_to_projects_directory_error';
        }
      }

      if (!self.forbiddenDirectory && !self.forbiddenBackupDirectory && !self.backupDirectoryEqualToProjectsDirectory) {

        // save properties
        if (self.repairingProjectsDirectory) {
          BibiscoPropertiesService.setProperty('projectsDirectory', ProjectService.createProjectsDirectory(self.selectedProjectsDirectory));
        }
        if (self.repairingBackupDirectory) {
          BibiscoPropertiesService.setProperty('backupDirectory', self.selectedBackupDirectory);
        }
        BibiscoDbConnectionService.saveDatabase();

        // sync bibisco db with projects directory
        if (self.repairingProjectsDirectory) {
          ProjectService.syncProjectDirectoryWithBibiscoDb();
        }

        LoggerService.debug('Saved preferences: ' +
          ' - selected projects directory=' + self.selectedProjectsDirectory +
          ' - selected backup directory=' + self.selectedBackupDirectory);

        $location.path('/start');
      } 
    }
  };
  
}
