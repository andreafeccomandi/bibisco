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
  component('error', {
    templateUrl: 'components/error/error.html',
    controller: ErrorController
  });

function ErrorController($location, $rootScope, $translate, BibiscoPropertiesService, ContextService) {

  var self = this;
  self.$onInit = function () {
    $rootScope.$emit('SHOW_ERROR_PAGE');

    let exception = ContextService.getLastError().exception;
    self.cause = ContextService.getLastError().cause || exception.message;
    self.stacktrace = exception.stack;
    
    self.showPermissionErrorMessage;

    if (exception.code==='EPERM' && (exception.syscall==='open' || exception.syscall==='mkdir')) {
      let projectsDirectory = BibiscoPropertiesService.getProperty('projectsDirectory');
      // show directory name without "/_internal_bibisco2_projects_db_"
      // that is 32 characters
      projectsDirectory = projectsDirectory.substring(0,projectsDirectory.length - 32);
      let backupDirectory = BibiscoPropertiesService.getProperty('backupDirectory');

      self.showPermissionErrorMessage = $translate.instant('directory_permission_error', { projectsDirectory: projectsDirectory, backupDirectory: backupDirectory });
      self.showPermissionErrorPath = $translate.instant('directory_permission_path', { path: ContextService.getLastError().exception.path });
    }
  };

  self.goHome = function() {
    $location.path('/start');
  };
}
