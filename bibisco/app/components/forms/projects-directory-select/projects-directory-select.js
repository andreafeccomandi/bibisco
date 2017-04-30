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
component('projectsdirectoryselect', {
  templateUrl: 'components/forms/projects-directory-select/projects-directory-select.html',
  controller: ProjectsDirectorySelectController,
  bindings: {
    model: '=',
    field: '<',
    label: '@',
    name: '@',
    labelcols: '@',
    inputcols: '@',
    onselectprojectsdirectory: '&',
    forbiddendirectory: '<'
  }
});


function ProjectsDirectorySelectController(LoggerService) {
  LoggerService.debug('Start ProjectsDirectorySelectController...');

  var remote = require('electron').remote;
  var dialog = remote.getGlobal('dialog');
  var self = this;

  self.projectsdirectory = null;
  self.opendirectorydialog = function() {
    dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory']
      },
      function(filenames) {
        if (filenames) {
          self.onselectprojectsdirectory({
            directory: filenames[0]
          });
        }
      });
  };;

  // show errors
  self.hasError = function() {
    return self.field.$$parentForm.$submitted && self.field.$invalid;
  }

  LoggerService.debug('End ProjectsDirectorySelectController...');
}
