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
  component('license', {
    templateUrl: 'components/license/license.html',
    controller: LicenseController,
    bindings: {
      dismiss: '&'
    }
  });

function LicenseController() {

  var self = this;
  self.close = function () {
    self.dismiss({
      $value: 'cancel'
    });
  };
}
