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
  component('communitytrialpopup', {
    templateUrl: 'components/supporter-edition-popup/community-trial-popup.html',
    controller: CommunityTrialPopupController,
    bindings: {
      close: '&',
      dismiss: '&',
      resolve: '<'
    },
  });

function CommunityTrialPopupController($rootScope, $translate, SupporterEditionChecker) {
   
  let self = this;
  const { shell } = require('electron');

  self.$onInit = function () {
    self.remainingTrialDays = SupporterEditionChecker.getRemainingTrialDays();
    self.p2 = self.remainingTrialDays > 1 ? 
      $translate.instant('community_trial_popup_p2', { remainingDays: self.remainingTrialDays }) :
      $translate.instant('community_trial_popup_p2_hours');
    self.showcountdown = false;
    self.countdown;
    $rootScope.trialmessageopen = true;
    $rootScope.$emit('OPEN_COMMUNITY_TRIAL_POPUP');
  };

  self.getIt = function () {
    self.close({
      $value: 'download'
    });
    $rootScope.trialmessageopen = false;
  };

  self.tryIt = function () {
    self.dismiss({
      $value: 'tryit'
    });
    $rootScope.trialmessageopen = false;
  };

  self.closepopup = function () {
    self.close({
      $value: 'close'
    });
    $rootScope.trialmessageopen = false;
  };
}