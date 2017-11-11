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
  component('fileselect', {
    templateUrl: 'components/file-select/file-select.html',
    controller: FileSelectController,
    bindings: {
      filefilter: '<',
      onselectfile: '&'
    }
  });


function FileSelectController(LoggerService) {
  LoggerService.debug('Start FileSelectController...');

  var remote = require('electron').remote;
  var dialog = remote.getGlobal('dialog');
  var self = this;

  self.openfiledialog = function() {
    let filters;
    if (!self.filefilter) {
      filters = [];
    } else {
      filters = [{
        name: 'filters',
        extensions: self.filefilter
      }];
    }
    dialog.showOpenDialog({
      filters: filters,
      properties: ['openFile']
    },
    function(filenames) {
      if (filenames) {
        self.onselectfile({
          file: filenames[0]
        });
      }
    });
  };
  LoggerService.debug('End FileSelectController...');
}
