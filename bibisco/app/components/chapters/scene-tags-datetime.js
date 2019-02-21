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
  component('scenetagsdatetime', {
    templateUrl: 'components/chapters/scene-tags-datetime.html',
    controller: SceneTagsDatetimeController,
    bindings: {
      lastscenetime: '<',
      scenetime: '<',
      scenetimegregorian: '='
    }
  });

function SceneTagsDatetimeController($rootScope, $scope, DatetimeService, LocaleService) {

  var self = this;

  self.$onInit = function() {

    // init date time
    self.originalscenetime = null;
    self.scenetimeshowed = null;
    self.scenetimecustom = null;
    if (self.scenetime !== null) {
      if (self.scenetimegregorian === true) {
        self.originalscenetime = self.scenetime;
        self.scenetime = new Date(self.scenetime);
        self.scenetimeshowed = self.scenetime;
      } else {
        self.scenetimecustom = self.scenetime;
      }
    }

    self.scenetimeselected = false;
    moment.locale(LocaleService.getCurrentLocale());
    self.scenetimeCalendarOpen = false;
  };

  self.onTimeSet = function(newDate) {
    self.scenetime = newDate;
    self.scenetimeshowed = newDate;
    self.scenetimeCalendarOpen = false;
    $rootScope.dirty = true;
    self.scenetimeselected = true;
    $scope.$emit('SCENE_TIME_SELECTED',  self.scenetime);
  };

  self.calculateSceneYear = function() {
    return DatetimeService.calculateSceneYear(self.scenetimeshowed);
  };

  self.calendarToggled = function(open) {
    if (open && self.originalscenetime === null && !self.scenetimeselected) {
      self.scenetime = self.lastscenetime;
    } else if (!open && self.originalscenetime === null && !self.scenetimeselected) {
      self.scenetime = null;
    }
  };

  self.setScenetimetypeGregorian = function(gregorian) {
    self.scenetimegregorian = gregorian;
    if (gregorian) {
      self.scenetime = self.scenetimeshowed;
    } else {
      self.scenetime = self.scenetimecustom;
    }
  };

  self.changeScenetimeCustom = function() {
    $rootScope.dirty = true;
    self.scenetime = self.scenetimecustom;
    $scope.$emit('SCENE_TIME_SELECTED',  self.scenetime);
  };
}
