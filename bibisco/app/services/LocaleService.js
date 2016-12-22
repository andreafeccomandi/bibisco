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
 
angular.module('bibiscoApp') .service('LocaleService', function ($translate, LOCALES, $rootScope, tmhDynamicLocale) {
    'use strict';
    // PREPARING LOCALES INFO
    var localesObj = LOCALES.locales;

    // locales and locales display names
    var _LOCALES = Object.keys(localesObj);
    if (!_LOCALES || _LOCALES.length === 0) {
      console.error('There are no _LOCALES provided');
    }
    var _LOCALES_DISPLAY_NAMES = [];
    _LOCALES.forEach(function (locale) {
      _LOCALES_DISPLAY_NAMES.push(localesObj[locale]);
    });

    // STORING CURRENT LOCALE
    console.log('$translate.resolveClientLocale()=' + $translate.resolveClientLocale());
    var currentLocale = calculatePreferredLocale($translate.preferredLanguage());
    tmhDynamicLocale.set(currentLocale);

    // METHODS
    var checkLocaleIsValid = function (locale) {
      return _LOCALES.indexOf(locale) !== -1;
    };

    var setLocale = function (locale) {
      if (!checkLocaleIsValid(locale)) {
        console.error('Locale name "' + locale + '" is invalid');
        return;
      }

      currentLocale = locale;// updating current locale
      console.log('currentLocale='+currentLocale);

      // asking angular-translate to load and apply proper translations
      $translate.use(currentLocale);

      // asking angular-dynamic-locale to load and apply proper AngularJS $locale setting
      tmhDynamicLocale.set(currentLocale);
    };

    // EVENTS
    // on successful applying translations by angular-translate
    $rootScope.$on('$translateChangeSuccess', function (event, data) {
      document.documentElement.setAttribute('lang', data.language);// sets "lang" attribute to html
    });

    return {
      getCurrentLocale: function () {
        return currentLocale;
      },
      setCurrentLocale: function (locale) {
        setLocale(locale);
      },
      getLocales: function () {
        return LOCALES.locales;
      }
    };
});

function calculatePreferredLocale(preferredLanguage) {

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
  } else if (preferredLanguage.startsWith('pt')) {
    preferredLocale = 'pt';
  } else if (preferredLanguage == 'en-ca') {
    preferredLocale = 'en-ca';
  } else if (preferredLanguage == 'en-gb') {
    preferredLocale = 'en-gb';
  } else {
    preferredLocale = 'en-us';
  }

  console.log('calculatePreferredLocale - input: ' +
   preferredLanguage + ' - output: ' + preferredLocale);

  return preferredLocale;
}
