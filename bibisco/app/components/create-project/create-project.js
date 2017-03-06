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
component('createproject', {
  templateUrl: 'components/create-project/create-project.html',
  controller: CreateProjectController
});

function CreateProjectController($location, LoggerService,
  BibiscoDbService) {
  LoggerService.debug('Start CreateProjectController...');
  var self = this;
  self.projectName = null;
  self.projectLanguage = null;

  self.save = function() {
    alert('save!')
  }

  self.back = function() {
    $location.path('/start');
  }

  LoggerService.debug('End CreateProjectController...');
}
