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

angular.module('bibiscoApp').service('LocaleService', function($translate,
  $rootScope, tmhDynamicLocale, LoggerService, BibiscoPropertiesService) {
  'use strict';

  // get preferredLanguage from bibiscodb
  var currentLocale = BibiscoPropertiesService.getProperty("locale");
  LoggerService.debug('storedLocale = [' + currentLocale + ']');

  if (!currentLocale) {
    // is the first access, I calculate preferred locale
    currentLocale = calculatePreferredLocale($translate.preferredLanguage(),
      LoggerService);
  }
  // asking angular-translate to load and apply proper translations
  $translate.use(currentLocale);

  // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
  tmhDynamicLocale.set(currentLocale);

  // EVENTS
  // on successful applying translations by angular-translate
  $rootScope.$on('$translateChangeSuccess', function(event, data) {
    document.documentElement.setAttribute('lang', data.language); // sets "lang" attribute to html
  });

  return {
    getCurrentLocale: function() {
      return currentLocale;
    },
    setCurrentLocale: function(locale) {
      // updating current locale
      currentLocale = locale;

      // asking angular-translate to load and apply proper translations
      $translate.use(currentLocale);

      // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
      tmhDynamicLocale.set(currentLocale);
    },
    getLocales: function() {
      return {
        'cs': 'Český',
        'de': 'Deutsch',
        'en-ca': 'English (Canada)',
        'en-gb': 'English (UK)',
        'en-us': 'English (USA)',
        'es': 'Español',
        'fr': 'Français',
        'it': 'Italiano',
        'pl': 'Polski',
        'pt-br': 'Português (Brasil)',
        'pt-pt': 'Português (Portugal)'
      };
    }
  };
});

function calculatePreferredLocale(preferredLanguage, LoggerService) {

  let preferredLocale;

  preferredLanguage = preferredLanguage.toLowerCase().replace(/_/g, '-');

  if (preferredLanguage.startsWith('cs')) {
    preferredLocale = 'cs';
  } else if (preferredLanguage.startsWith('de')) {
    preferredLocale = 'de';
  } else if (preferredLanguage.startsWith('es')) {
    preferredLocale = 'es';
  } else if (preferredLanguage.startsWith('fr')) {
    preferredLocale = 'fr';
  } else if (preferredLanguage.startsWith('it')) {
    preferredLocale = 'it';
  } else if (preferredLanguage.startsWith('pl')) {
    preferredLocale = 'pl';
  } else if (preferredLanguage == 'pt-br') {
    preferredLocale = 'pt_BR';
  } else if (preferredLanguage == 'en-ca') {
    preferredLocale = 'en-ca';
  } else if (preferredLanguage == 'en-gb') {
    preferredLocale = 'en-gb';
  } else {
    preferredLocale = 'en-us';
  }

  LoggerService.debug('calculatePreferredLocale - input: ' +
    preferredLanguage + ' - output: ' + preferredLocale);

  return preferredLocale;
}
