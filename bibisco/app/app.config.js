angular.module('bibiscoApp')
.config(['$locationProvider', '$routeProvider',
function config($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  console.log($routeProvider.path);
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
    template: '<languageselect></languageselect><h1>{{"jsp.welcome.h1" | translate}}</h1>'
  }).
  otherwise('/main');
}
])
.config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'resources/locale-',// path to translations files
        suffix: '.json'// suffix, currently- extension of the translations
    });
    $translateProvider.determinePreferredLanguage();// is applied on first load
    $translateProvider.fallbackLanguage(['en']);
})
.config(function (tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
})
.constant('LOCALES', {
    'locales': {
        'cs': 'Český',
        'de': 'Deutsch',
        'en_CA': 'English (Canada)',
        'en_UK': 'English (UK)',
        'en_US': 'English (USA)',
        'es': 'Español',
        'fr': 'Français',
        'it': 'Italiano',
        'pl': 'Polski',
        'pt': 'Português (Brasil)'
    }
})
;
