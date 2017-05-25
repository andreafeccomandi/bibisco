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
var bibiscoApp = angular.module('bibiscoApp', ['ngRoute',
    'pascalprecht.translate', // angular-translate
    'tmh.dynamicLocale', // angular-dynamic-locale
    'ui.select',
    'ngSanitize',
    'ngMessages',
    'focus-if',
    'mwl.confirm',
    'ui.bootstrap'
  ])
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!');
      $routeProvider.
      when('/chapters/:chapterId', {
        template: '<chapter></chapter>'
      }).
      when('/createproject', {
        template: '<createproject></createproject>'
      }).
      when('/error', {
        template: '<error></error>'
      }).
      when('/importproject', {
        template: '<importproject></importproject>'
      }).
      when('/locationtitle/:operation/:id', {
        template: '<locationtitle></locationtitle>'
      }).
      when('/main', {
        template: '<main></main>'
      }).
      when('/maincharactertitle/:operation/:id', {
        template: '<maincharactertitle></maincharactertitle>'
      }).
      when('/openproject', {
        template: '<openproject></openproject>'
      }).
      when('/project/:item', {
        template: '<project></project>'
      }).
      when('/secondarycharactertitle/:operation/:id', {
        template: '<secondarycharactertitle></secondarycharactertitle>'
      }).
      when('/settings', {
        template: '<settings></settings>'
      }).
      when('/start', {
        template: '<start></start>'
      }).
      when('/welcome', {
        template: '<welcome></welcome>'
      }).
      otherwise('/main');
    }
  ])
  .config(function($translateProvider) {

    $translateProvider
      .useStaticFilesLoader({
        prefix: 'resources/locale-', // path to translations files
        suffix: '.json' // suffix, currently- extension of the translations
      })
      .registerAvailableLanguageKeys(['cs', 'de', 'en', 'es', 'fr', 'it',
        'pl', 'pt-br', 'pt-pt'
      ], {
        'cs': 'cs',
        'de': 'de',
        'en-ca': 'en',
        'en-gb': 'en',
        'en-us': 'en',
        'es': 'es',
        'fr': 'fr',
        'it': 'it',
        'pl': 'pl',
        'pt-br': 'pt-br',
        'pt-pt': 'pt-pt'
      }) // register available languages
      .determinePreferredLanguage() // is applied on first load
      .fallbackLanguage(['en']) // fallback language
      .useSanitizeValueStrategy(null) // sanitize strategy: null until 'sanitize' mode is fixed
    ;
  })
  .config(function(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern(
      '../node_modules/angular-i18n/angular-locale_{{locale}}.js');
  })

// By default, AngularJS will catch errors and log them to
// the Console. I want to keep that behavior; however, I
// want to intercept it so that I can also log the errors
// to file for later analysis and I want to redirect to error page.
// So I have to override the $exceptionHandler
// provider and replace it with a custom one
.factory('$exceptionHandler', ['$injector', function($injector) {

  var $location;
  var $log;
  var ContextService;
  var LoggerService;

  return function(exception, cause) {

    // Pass off the error to the default error handler
    // on the AngularJS logger. This will output the
    // error to the console (and let the application
    // keep running normally for the user).
    $log = $log || $injector.get('$log');
    $log.error.apply($log, arguments);

    // Now, we need to try and log the error using the file logger.
    LoggerService = LoggerService || $injector.get('LoggerService');
    LoggerService.error('***EXCEPTION CAUSE*** : ' + cause);
    LoggerService.error('***EXCEPTION STACKTRACE*** : ' + exception.stack);

    // Put cause and exception in application context
    ContextService = ContextService || $injector.get('ContextService');
    ContextService.setLastError({
      cause: cause,
      stacktrace: exception.stack
    });

    // Redirect to error page
    $location = $location || $injector.get('$location');
    $location.path("/error");
  };
}])

// Set confirm dialog default
.run(function(confirmationPopoverDefaults) {
  confirmationPopoverDefaults.cancelButtonType = 'default';
  confirmationPopoverDefaults.confirmButtonType = 'danger';
  confirmationPopoverDefaults.templateUrl =
    'adapters/angular-bootstrap-confirm/angular-bootstrap-confirm.html';
});
