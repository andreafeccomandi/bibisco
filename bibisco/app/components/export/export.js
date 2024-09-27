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
  component('export', {
    templateUrl: 'components/export/export.html',
    controller: ExportController,
    bindings: {

    }
  });

function ExportController($location, $rootScope, SupporterEditionChecker) {
  var self = this;

  self.$onInit = function () {
    
    // show menu item
    $rootScope.$emit('SHOW_PAGE', {
      item: 'export'
    });
  };

  self.exportPdf = function() {
    $location.path('/exporttoformat/pdf');
  };

  self.exportWord = function () {
    $location.path('/exporttoformat/docx');
  };

  self.exportTxt = function () {
    $location.path('/exporttoformat/txt');
  };

  self.exportEPub = function () {
    SupporterEditionChecker.filterAction(function() {
      $location.path('/exporttoepub');
    });
  };

  self.exportArchive = function () {
    $location.path('/exporttoformat/archive');
  };
}
