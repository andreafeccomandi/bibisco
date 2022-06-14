/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
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
  component('fileselect', {
    templateUrl: 'components/common/forms/file-select/file-select.html',
    controller: FileSelectController,
    bindings: {
      filefilter: '<',
      onselectfile: '&'
    }
  });


function FileSelectController(MainProcessCallbackExecutorService) {

  const ipc = require('electron').ipcRenderer;
  var self = this;

  self.openfiledialog = function() {
    let callbackId = MainProcessCallbackExecutorService.register(self.onselectfile);
    ipc.send('selectfile', {
      callbackId: callbackId,
      filefilter: self.filefilter
    });
  };
}
