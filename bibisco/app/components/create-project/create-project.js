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

function CreateProjectController($location, $rootScope, LocaleService,
  ProjectService) {

  // hide menu
  $rootScope.$emit('SHOW_CREATE_PROJECT');

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
    'es-ve': 'Español (Venezuela)',
    'fr': 'Français',
    'it': 'Italiano',
    'nl': 'Nederlands',
    'no': 'Norsk',
    'pl': 'Polski',
    'pt-br': 'Português (Brasil)',
    'pt-pt': 'Português (Portugal)',
    'ru': 'Русский',
    'sv': 'Svenska'
  };

  self.save = function(isValid) {
    if (isValid) {
      ProjectService.create(self.projectName, self.projectLanguage);
      $location.path('/project/projecthome');
    }
  };

  self.back = function() {
    $location.path('/start');
  };
}
