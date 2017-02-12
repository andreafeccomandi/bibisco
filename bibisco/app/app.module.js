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

// Define the 'bibisco' module
var bibiscoApp = angular.module('bibiscoApp',
  ['ngRoute',
  'pascalprecht.translate',// angular-translate
  'tmh.dynamicLocale'// angular-dynamic-locale
])
.config(['$locationProvider', '$routeProvider',
function config($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.
  when('/chapters/:chapterId', {
    template: '<chapter></chapter>'
  }).
  when('/main', {
    template: '<main></main>'
  }).
  when('/start', {
    template: '<p>Start</p>'
  }).
  when('/welcome', {
    template: '<languageselect></languageselect><h1>{{"jsp.welcome.h1" | translate}}</h1><p>{{ 1000000 | currency }}</p>'
  }).
  otherwise('/main');
}
])
.config(function ($translateProvider) {

    $translateProvider
    .useStaticFilesLoader({
        prefix: 'resources/locale-',// path to translations files
        suffix: '.json'// suffix, currently- extension of the translations
    })
    .registerAvailableLanguageKeys(['cs', 'de', 'en', 'es', 'fr', 'it', 'pl', 'pt'],
      {
        'cs': 'cs',
        'de': 'de',
        'en-ca': 'en',
        'en-gb': 'en',
        'en-us': 'en',
        'es': 'es',
        'fr': 'fr',
        'it': 'it',
        'pl': 'pl',
        'pt': 'pt'
      }) // register available languages
    .determinePreferredLanguage()// is applied on first load
    .fallbackLanguage(['en']) // fallback language
    .useSanitizeValueStrategy(null) // sanitize strategy: null until 'sanitize' mode is fixed
    ;
})
.config(function (tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('../bower_components/angular-i18n/angular-locale_{{locale}}.js');
})

// By default, AngularJS will catch errors and log them to
// the Console. I want to keep that behavior; however, I
// want to intercept it so that I can also log the errors
// to file for later analysis. So I have to override the $exceptionHandler
// provider and replace it with a custom one: ExceptionHandlerService
.provider(
    "$exceptionHandler", {
        $get: function( ExceptionHandlerService ) {
            return( ExceptionHandlerService );
        }
    }
)
;
