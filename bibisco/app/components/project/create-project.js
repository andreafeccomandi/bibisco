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
  component('createproject', {
    templateUrl: 'components/project/create-project.html',
    controller: CreateProjectController
  });

function CreateProjectController($location, $rootScope, $scope, $timeout,
  LocaleService, PopupBoxesService, ProjectService) {

  // hide menu
  $rootScope.$emit('SHOW_CREATE_PROJECT');

  var self = this;

  self.$onInit = function () {
    self.projectName = null;
    self.projectAuthor = null;
    self.projectLanguage = LocaleService.getCurrentLocale();
    if (self.projectLanguage === 'es') {
      self.projectLanguage = 'es-es';
    }
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
      'nb-no': 'Norsk',
      'pl': 'Polski',
      'pt-br': 'Português (Brasil)',
      'pt-pt': 'Português (Portugal)',
      'ru': 'Русский',
      'sl': 'Slovenski jezik',
      'sr': 'Srpski',
      'sv': 'Svenska',
      'tr': 'Türkçe',
      'uk': 'українська',
    };

    self.checkExit = {
      active: true
    };
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $scope.createProjectForm.$dirty, self.checkExit);
  });

  self.save = function(isValid) {
    if (isValid) {
      PopupBoxesService.confirm(function () {
        $timeout(function () {
          ProjectService.create(self.projectName, self.projectLanguage, self.projectAuthor);

          self.checkExit = {
            active: false
          };
          $location.path('/projecthome');
        }, 0);
      },
      'jsp.createProject.save.confirm',
      function () {
      });
    }
  };
}
