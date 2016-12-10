angular.module('bibiscoApp').
config(['$locationProvider', '$routeProvider',
function config($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  console.log($routeProvider.path);
  $routeProvider.
  when('/chapters/:chapterId', {
    template: '<chapter></chapter>'
  }).
  when('/main', {
    template: '<p>main!!!<a href="/welcome">vai a benvenuto</a></p>'
  }).
  when('/start', {
    template: '<start></start>'
  }).
  when('/welcome', {
    template: '<p>benvenuto!!!</p>'
  }).
  otherwise('/start');
}
]);
