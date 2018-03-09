/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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

angular.module('bibiscoApp').service('DatetimeService', function (
  $translate, UtilService) {
  'use strict';

  return {
    calculateSceneYear: function (datetime) {
      let result = null;
      if (datetime) {
        let year = datetime.getUTCFullYear();
        let bc = '';
        if (year < 0) {
          year = year * (-1);
          bc = ' ' + $translate.instant('year_bc_scene_tags');
        }
        let yearAsPaddedString = UtilService.number.pad(year, 4);
        result = yearAsPaddedString + bc;
      }
      return result;
    }
  };
});
