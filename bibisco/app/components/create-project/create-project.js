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

function CreateProjectController($location, BibiscoDbService, LocaleService,
  ProjectDbService, LoggerService, UuidService) {
  LoggerService.debug('Start CreateProjectController...');
  var self = this;
  self.projectName = null;
  self.projectLanguage = LocaleService.getCurrentLocale();
  self.projectLocales = {
    'ca-es': 'Català',
    'cs': 'Český',
    'da-dk': 'Dansk',
    'de': 'Deutsch',
    'en-au': 'English (Australia)',
    'en-ca': 'English (Canada)',
    'en-za': 'English (South Africa)',
    'en-gb': 'English (UK)',
    'en-us': 'English (USA)',
    'es-ar': 'Español (Argentina)',
    'es-es': 'Español (España)',
    'es-mx': 'Español (México)',
    'es-mx': 'Español (Venezuela)',
    'fr': 'Français',
    'it': 'Italiano',
    'nl': 'Nederlands',
    'no': 'Norsk',
    'pl': 'Polski',
    'pt-br': 'Português (Brasil)',
    'pt-pt': 'Português (Portugal)',
    'sv': 'Svenska'
  }

  self.save = function() {
    var projectId = UuidService.generateUuid();

    var project = {
      'id': projectId,
      'name': self.projectName,
      'language': self.projectLanguage,
      'bibiscoVersion': BibiscoDbService.getProperty('version')
    }

    // create project db
    ProjectDbService.createProjectDb(project);
    ProjectDbService.saveDatabase();

    // add project to bibisco db
    BibiscoDbService.addProject(project.id, project.name);
    BibiscoDbService.saveDatabase();
  }

  self.back = function() {
    $location.path('/start');
  }

  LoggerService.debug('End CreateProjectController...');
}
