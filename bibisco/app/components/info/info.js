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
  component('info', {
    templateUrl: 'components/info/info.html',
    controller: InfoController,
    bindings: {

    }
  });

function InfoController($rootScope, $translate, $uibModal, BibiscoPropertiesService, SupporterEditionChecker) {

  let self = this;
  const { shell } = require('electron');

  self.$onInit = function () {
    self.version = BibiscoPropertiesService.getProperty('version');

    self.isCommunityEdition = !SupporterEditionChecker.isSupporter();

    self.trialstatus;
    if (SupporterEditionChecker.isTrialActive()) {
      let remainingDays = SupporterEditionChecker.getRemainingTrialDays();
      self.trialstatus = remainingDays > 1 ? 
        $translate.instant('trial_active_days', { remainingDays: remainingDays }) :
        $translate.instant('trial_active_hours');
    } else if (SupporterEditionChecker.isTrialExpired()) {
      self.trialstatus = $translate.instant('trial_expired');
    }
  };

  self.gotoWebsite = function() {
    shell.openExternal('https://bibisco.com');
  };

  self.download = function() {
    let url = $translate.instant('supporter_edition_get_it_button_url');
    shell.openExternal(url);
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

    $rootScope.$emit('OPEN_POPUP_BOX');

    modalInstance.result.then(function () {
      $rootScope.$emit('CLOSE_POPUP_BOX');
    }, function () {
      $rootScope.$emit('CLOSE_POPUP_BOX');
    });
  };
}
