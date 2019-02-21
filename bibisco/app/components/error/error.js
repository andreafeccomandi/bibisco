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
  component('error', {
    templateUrl: 'components/error/error.html',
    controller: ErrorController
  });

function ErrorController($location, $rootScope, ContextService) {

  var self = this;
  self.$onInit = function () {
    $rootScope.$emit('SHOW_ERROR_PAGE');
    self.cause = ContextService.getLastError().cause;
    self.stacktrace = ContextService.getLastError().stacktrace;
  };

  self.goHome = function() {
    $location.path('/start');
  };
}
