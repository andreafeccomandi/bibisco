/*
 * Copyright (C) 2014-2019 Andrea Feccomandi
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
  component('info', {
    templateUrl: 'components/info/info.html',
    controller: InfoController,
    bindings: {

    }
  });

function InfoController($uibModal, $window, BibiscoPropertiesService) {

  var self = this;
  const { shell } = require('electron');

  self.$onInit = function () {
    self.version = BibiscoPropertiesService.getProperty('version');
    self.hotkeys = ['esc'];
  };

  self.gotoWebsite = function() {
    shell.openExternal('http://www.bibisco.com');
  };

  self.writeEmail = function () {
    shell.openExternal('mailto:info@bibisco.com');
  };

  self.gotoValeIGProfile = function () {
    shell.openExternal('https://www.instagram.com/cloudsandcowfish/');
  };

  self.showLicense = function () {
    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'license',
      resolve: {
      },
      size: 'lg'
    });

    modalInstance.result.then(function () {}, function () {});
  };

  self.back = function () {
    $window.history.back();
  };
}
