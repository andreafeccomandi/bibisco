/*
 * Copyright (C) 2014-2020 Andrea Feccomandi
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
  component('interviewswitch', {
    templateUrl: 'components/characters/interview-switch.html',
    controller: InterviewSwitchController,
    bindings: {
      freetextenabled: '='
    }
  });


function InterviewSwitchController($rootScope, PopupBoxesService) {

  var self = this;

  self.$onInit = function () {};

  self.interview = function() {
    if (self.freetextenabled === true) {
      self.switch(false);
    }
  };

  self.freetext = function() {
    if (self.freetextenabled === false) {
      self.switch(true);
    }
  };

  self.switch = function(freetextenabled) {
    if ($rootScope.dirty === true) {
      PopupBoxesService.confirm(function() {
        self.executeSwitch(freetextenabled);
      }, 'js.common.message.confirmExitWithoutSave');
    } else {
      self.executeSwitch(freetextenabled);
    }
  };

  self.executeSwitch = function(freetextenabled) {
    self.freetextenabled = freetextenabled;
    $rootScope.dirty = false;
  };
}