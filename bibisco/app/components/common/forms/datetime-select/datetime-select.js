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
  component('datetimeselect', {
    templateUrl: 'components/common/forms/datetime-select/datetime-select.html',
    controller: DatetimeselectController,
    bindings: {
      additionalclass: '@',
      buttongroupcols: '@',
      field: '<',
      inputcols: '@',
      label: '@',
      labelcols: '@',
      lastdatetimeselected: '<',
      name: '@',
      offsetcols: '@',
      opencalendardirection: '@',
      required: '@',
      time: '=',
      timegregorian: '='
    }
  });

function DatetimeselectController($rootScope, $scope, DatetimeService, LocaleService) {

  let self = this;

  self.$onInit = function() {

    // init date time
    self.originaltime = null;
    self.timeshowed = null;
    self.timecustom = null;
    if (self.time) {
      if (self.timegregorian === true) {
        self.originaltime = self.time;
        self.time = new Date(self.time);
        self.timeshowed = self.time;
      } else {
        self.timecustom = self.time;
      }
    }

    self.timeselected = false;
    moment.locale(LocaleService.getCurrentLocale());
    self.timeCalendarOpen = false;

    if (self.opencalendardirection==='up') {
      self.dropdownclass = 'dropup';
    } else {
      self.dropdownclass = 'dropdown';
    }

    if (!self.name) {
      self.name = 'defaultdatetime';
    }
    if (!self.offsetcols) {
      self.offsetcols = '0';
    }

  };

  self.onTimeSet = function(newDate) {
    self.time = newDate;
    self.timeshowed = newDate;
    self.timeCalendarOpen = false;
    $rootScope.dirty = true;
    self.timeselected = true;
  };

  self.calculateYear = function() {
    return DatetimeService.calculateYear(self.timeshowed);
  };

  self.calendarToggled = function(open) {
    if (open && self.originaltime === null && !self.timeselected) {
      self.time = self.lastdatetimeselected;
    } else if (!open && self.originaltime === null && !self.timeselected) {
      self.time = null;
    }
  };

  self.setTimetypeGregorian = function(gregorian) {
    self.timegregorian = gregorian;
    if (gregorian) {
      self.time = self.timeshowed;
    } else {
      self.time = self.timecustom;
    }

    $rootScope.dirty = true;
  };

  self.changeTimeCustom = function() {
    $rootScope.dirty = true;
    self.time = self.timecustom;
  };

  // show errors
  self.hasError = function() {
    if (self.field) {
      return self.field.$$parentForm.$submitted && self.field.$invalid;
    } else {
      return false;
    }
  };
}
