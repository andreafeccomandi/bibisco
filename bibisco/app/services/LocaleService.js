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

angular.module('bibiscoApp').service('LocaleService', function($translate,
  $rootScope, tmhDynamicLocale, LoggerService, BibiscoPropertiesService) {
  'use strict';

  const ipc = require('electron').ipcRenderer;

  // get preferredLanguage from bibiscodb
  var currentLocale = BibiscoPropertiesService.getProperty('locale');
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
    
    // sets "lang" attribute to html
    document.documentElement.setAttribute('lang', data.language); 

    // context menu translations
    let translations = $translate.instant([
      'context_menu_add_dictionary',
      'context_menu_copy',
      'context_menu_cut',
      'context_menu_paste'
    ]);
    ipc.send('setContextMenuStringTable', {
      addToDictionary: translations.context_menu_add_dictionary,
      cut: translations.context_menu_cut,
      copy: translations.context_menu_copy,
      paste: translations.context_menu_paste
    });
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

      $rootScope.$emit('LOCALE_CHANGED', {
        locale: currentLocale
      });
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
        'nl': 'Nederlands',
        'pl': 'Polski',
        'pt-br': 'Português (Brasil)',
        'pt-pt': 'Português (Portugal)',
        'ru': 'Русский',
        'sl': 'Slovenski jezik',
        'sr': 'Srpski',
        'tr': 'Türkçe'
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
  } else if (preferredLanguage.startsWith('nl')) {
    preferredLocale = 'nl';
  } else if (preferredLanguage.startsWith('pl')) {
    preferredLocale = 'pl';
  } else if (preferredLanguage.startsWith('ru')) {
    preferredLocale = 'ru';
  }  else if (preferredLanguage.startsWith('sl')) {
    preferredLocale = 'sl';
  } else if (preferredLanguage.startsWith('sr')) {
    preferredLocale = 'sr';
  } else if (preferredLanguage.startsWith('tr')) {
    preferredLocale = 'tr';
  } else if (preferredLanguage === 'pt-pt') {
    preferredLocale = 'pt-pt';
  } else if (preferredLanguage === 'pt-br') {
    preferredLocale = 'pt-br';
  } else if (preferredLanguage === 'en-ca') {
    preferredLocale = 'en-ca';
  } else if (preferredLanguage === 'en-gb') {
    preferredLocale = 'en-gb';
  } else {
    preferredLocale = 'en-us';
  }

  LoggerService.debug('calculatePreferredLocale - input: ' +
    preferredLanguage + ' - output: ' + preferredLocale);

  return preferredLocale;
}
