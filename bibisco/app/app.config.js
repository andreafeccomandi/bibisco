angular.module('bibiscoApp')
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

    var langMap = {
      'cs_CZ': 'cs',
      'de_DE': 'de',
      'en_CA': 'en',
      'en_GB': 'en',
      'en_US': 'en',
      'es_ES': 'es',
      'fr_FR': 'fr',
      'it_IT': 'it',
      'pl_PL': 'pl',
      'pt_BR': 'pt'
    };

    $translateProvider
    .useStaticFilesLoader({
        prefix: 'resources/locale-',// path to translations files
        suffix: '.json'// suffix, currently- extension of the translations
    })
    .registerAvailableLanguageKeys(['cs', 'de', 'en', 'es', 'fr', 'it', 'pl', 'pt'], langMap) // register available languages
    .determinePreferredLanguage()// is applied on first load
    .fallbackLanguage(['en']) // fallback language
    .useSanitizeValueStrategy(null) // sanitize strategy: null until 'sanitize' mode is fixed
    ;
})
.config(function (tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('../bower_components/angular-i18n/angular-locale_{{locale}}.js');
})
.constant('LOCALES', {
    'locales': {
        'cs_CZ': 'Český',
        'de_DE': 'Deutsch',
        'en_CA': 'English (Canada)',
        'en_GB': 'English (UK)',
        'en_US': 'English (USA)',
        'es_ES': 'Español',
        'fr_FR': 'Français',
        'it_IT': 'Italiano',
        'pl_PL': 'Polski',
        'pt_BR': 'Português (Brasil)'
    }
})
;
