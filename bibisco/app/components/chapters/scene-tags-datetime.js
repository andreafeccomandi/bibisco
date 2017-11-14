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
  component('scenetagsdatetime', {
    templateUrl: 'components/chapters/scene-tags-datetime.html',
    controller: SceneTagsDatetimeController,
    bindings: {
      dirty: '=',
      lastscenetime: '<',
      scenetime: '=',
      scenetimegregorian: '='
    }
  });

function SceneTagsDatetimeController($location, $translate,
  LocaleService, UtilService) {

  var self = this;

  self.$onInit = function() {

    // load translations
    self.translations = $translate.instant([
      'year_bc_scene_tags'
    ]);

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
    self.scenetimeshowed = self.scenetime;
    self.scenetimeCalendarOpen = false;
    self.dirty = true;
    self.scenetimeselected = true;
  };

  self.calculateSceneYear = function() {
    let result = null;
    if (self.scenetimeshowed) {
      let year = self.scenetimeshowed.getUTCFullYear();
      let bc = '';
      if (year < 0) {
        year = year * (-1);
        bc = ' ' + self.translations.year_bc_scene_tags;
      }
      let yearAsPaddedString = UtilService.number.pad(year, 4);
      result = yearAsPaddedString + bc;
    }
    return result;
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
    self.dirty = true;
    self.scenetime = self.scenetimecustom;
  };
}
