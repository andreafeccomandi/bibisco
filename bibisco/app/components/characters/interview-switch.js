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
  component('interviewswitch', {
    templateUrl: 'components/characters/interview-switch.html',
    controller: InterviewSwitchController,
    bindings: {
      dirty: '=',
      freetextenabled: '='
    }
  });


function InterviewSwitchController(PopupBoxesService) {

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
    if (self.dirty) {
      PopupBoxesService.confirm(function() {
        self.executeSwitch(freetextenabled);
      }, 'js.common.message.confirmExitWithoutSave');
    } else {
      self.executeSwitch(freetextenabled);
    }
  };

  self.executeSwitch = function(freetextenabled) {
    self.freetextenabled = freetextenabled;
    self.dirty = false;
  };
}