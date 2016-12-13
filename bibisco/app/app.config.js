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
    template: '<h1>{{"jsp.welcome.h1" | translate}}</h1>'
  }).
  otherwise('/main');
}
])
.config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'resources/locale-',// path to translations files
        suffix: '.json'// suffix, currently- extension of the translations
    });
    $translateProvider.preferredLanguage('fr');// is applied on first load
})
;
