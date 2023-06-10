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
  component('settings', {
    templateUrl: 'components/settings/settings.html',
    controller: SettingsController
  });

function SettingsController($location, $rootScope, $scope,
  $timeout, hotkeys, BibiscoDbConnectionService, BibiscoPropertiesService,
  FileSystemService, LocaleService, LoggerService, PopupBoxesService, 
  ProjectService, SupporterEditionChecker) {
  
  const ipc = require('electron').ipcRenderer;
  const INTERNAL_PROJECTS_DIR = '_internal_bibisco2_projects_db_';
  let self = this;

  self.$onInit = function () {

    // show menu item
    $rootScope.$emit('SHOW_SETTINGS', {
      item: 'settings'
    });

    self.theme = BibiscoPropertiesService.getProperty('theme');

    // zoom level
    self.zoomLevel = BibiscoPropertiesService.getProperty('zoomLevel');
    self.zoomLevelGroup = [{
      label: '100%',
      value: 100
    }, {
      label: '115%',
      value: 115
    }, {
      label: '130%',
      value: 130
    }];

    // selected language
    self.selectedLanguage = LocaleService.getCurrentLocale();
    let currentProjectsDirectory = BibiscoPropertiesService.getProperty('projectsDirectory');
  
    // show directory name without "/_internal_bibisco2_projects_db_"
    // that is 32 characters
    self.selectedProjectsDirectory = currentProjectsDirectory.substring(0,
      currentProjectsDirectory.length - 32);

    self.selectedBackupDirectory = BibiscoPropertiesService.getProperty('backupDirectory');

    self.maxBackupNumber = BibiscoPropertiesService.getProperty('maxBackupNumber');

    self.autoBackupOnExit = BibiscoPropertiesService.getProperty('autoBackupOnExit');
    self.autoBackupOnExitGroup = [{
      label: 'jsp.common.button.enabled',
      value: 'true'
    }, {
      label: 'jsp.common.button.disabled',
      value: 'false'
    }];

    self.autoBackupFrequency = BibiscoPropertiesService.getProperty('autoBackupFrequency');
    self.autoBackupFrequencyGroup = [{
      label: 'never',
      value: 'NEVER'
    }, {
      label: 'thirty_minutes',
      value: 'THIRTY_MINUTES'
    }, {
      label: 'one_hour',
      value: 'ONE_HOUR'
    }, {
      label: 'two_hours',
      value: 'TWO_HOURS'
    }, {
      label: 'four_hours',
      value: 'FOUR_HOURS'
    }];

    self.forbiddenDirectory = false;
    self.backupDirectoryCustomErrorMessage = null;
    self.checkExit = {
      active: true
    };

    hotkeys.bindTo($scope)
      .add({
        combo: ['enter', 'enter'],
        description: 'enter',
        allowIn: ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON'],
        callback: function ($event) {
          $event.preventDefault();
          self.save($scope.settingsForm.$valid, $scope.settingsForm.$dirty);
        }
      });
  };

  self.selectDarkTheme = function() {
    SupporterEditionChecker.filterAction(function() {
      $rootScope.$emit('SWITCH_DARK_THEME');
      $timeout(function () {
        self.theme = 'dark';
        $scope.settingsForm.$setDirty();
      }, 0);
    });
  };

  self.selectClassicTheme = function() {
    $rootScope.$emit('SWITCH_CLASSIC_THEME');
    $timeout(function () {
      self.theme = 'classic';
      $scope.settingsForm.$setDirty();
    }, 0);
  };

  self.selectZoomLevel = function(selected) {
    $rootScope.$emit('CHANGE_ZOOM_LEVEL', {
      level: selected
    });
  };


  self.selectLanguage = function(selectedLanguage) {
    self.selectedLanguage = selectedLanguage;
  };

  self.selectProjectsDirectory = function(directory) {
    self.selectedProjectsDirectory = directory;
    self.forbiddenDirectory = false;
    $scope.settingsForm.$setDirty();
    $scope.$apply();
  };

  self.selectBackupDirectory = function(directory) {
    self.selectedBackupDirectory = directory;
    self.forbiddenBackupDirectory = false;
    self.backupDirectoryCustomErrorMessage = null;
    $scope.settingsForm.$setDirty();
    $scope.$apply();
  };

  self.save = function(isValid, isDirty) {
    
    if (!isDirty) {
      $location.path('/start');
    } else if (isValid) {
      self.checkExit = {
        active: false
      };

      // check if I can write selected projects directory
      if (!FileSystemService.canWriteDirectory(self.selectedProjectsDirectory)) {
        self.forbiddenDirectory = true;
      }
      // check if I can write selected backup directory
      if (!FileSystemService.canWriteDirectory(self.selectedBackupDirectory)) {
        self.forbiddenBackupDirectory = true;
      }

      // check if projects directory and backup directory are equals
      self.backupDirectoryEqualToProjectsDirectory =  self.isProjectsDirectoryEqualsToBackupDirectory(self.selectedProjectsDirectory, self.selectedBackupDirectory);
      self.backupDirectoryCustomErrorMessage = self.backupDirectoryEqualToProjectsDirectory? 'backup_directory_equal_to_projects_directory_error' : null;

      if (!self.forbiddenDirectory && !self.forbiddenBackupDirectory && !self.backupDirectoryEqualToProjectsDirectory) {
        LocaleService.setCurrentLocale(self.selectedLanguage);
        BibiscoPropertiesService.setProperty('theme', self.theme);
        LoggerService.debug('BibiscoPropertiesService.getProperty(\'zoomLevel\')'+BibiscoPropertiesService.getProperty('zoomLevel')+' - self.zoomLevel='+self.zoomLevel);
        BibiscoPropertiesService.setProperty('zoomLevel', self.zoomLevel); 
        BibiscoPropertiesService.setProperty('locale', LocaleService.getCurrentLocale());
        BibiscoPropertiesService.setProperty('projectsDirectory', ProjectService.createProjectsDirectory(self.selectedProjectsDirectory));
        BibiscoPropertiesService.setProperty('backupDirectory', self.selectedBackupDirectory);
        BibiscoPropertiesService.setProperty('maxBackupNumber', self.maxBackupNumber);   
        BibiscoPropertiesService.setProperty('autoBackupFrequency', self.autoBackupFrequency);   
        BibiscoPropertiesService.setProperty('autoBackupOnExit', self.autoBackupOnExit);   
        BibiscoDbConnectionService.saveDatabase();

        // sync bibisco db with projects directory
        ProjectService.syncProjectDirectoryWithBibiscoDb();

        LoggerService.info('Saved preferences: ' 
          + ' theme=' + self.theme  
          + ' - zoomLevel=' + self.zoomLevel
          + ' - language=' + LocaleService.getCurrentLocale() 
          + ' - projects directory=' + self.selectedProjectsDirectory
          + ' - backup directory=' + self.selectedBackupDirectory
          + ' - max backup number=' + self.maxBackupNumber
          + ' - auto backup frequency=' + self.autoBackupFrequency
          + ' - auto backup on exit=' + self.autoBackupOnExit
        );

        $location.path('/start');
      } 
    }
  };

  self.isProjectsDirectoryEqualsToBackupDirectory = function(projectsDirectory, backupDirectory) {

    let projectsDirectoryToCheck = projectsDirectory.endsWith(INTERNAL_PROJECTS_DIR) ? 
      projectsDirectory : FileSystemService.concatPath(projectsDirectory, INTERNAL_PROJECTS_DIR);
    let backupDirectoryToCheck = backupDirectory.endsWith(INTERNAL_PROJECTS_DIR) ? 
      backupDirectory : FileSystemService.concatPath(backupDirectory, INTERNAL_PROJECTS_DIR);

    return projectsDirectoryToCheck === backupDirectoryToCheck;
  };

  self.back = function() {
    self.theme = BibiscoPropertiesService.getProperty('theme');
    if (self.theme === 'dark') {
      $rootScope.$emit('SWITCH_DARK_THEME');
    } else {
      $rootScope.$emit('SWITCH_CLASSIC_THEME');
    }
    self.zoomLevel = BibiscoPropertiesService.getProperty('zoomLevel');
    $rootScope.$emit('CHANGE_ZOOM_LEVEL', {
      level: self.zoomLevel
    });
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.settingsForm.$dirty, self.checkExit, self.back);
  });
}
