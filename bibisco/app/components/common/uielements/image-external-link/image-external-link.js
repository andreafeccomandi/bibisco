/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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
  component('imageexternallink', {
    templateUrl: 'components/common/uielements/image-external-link/image-external-link.html',
    controller: ImageExternalLinkController,
    bindings: {
      dimension: '@',
      src: '@',
      url: '@'
    },
  });

function ImageExternalLinkController() {

  var self = this;
  const { shell } = require('electron');

  self.openUrl = function () {
    shell.openExternal(self.url);
  };
}
