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
    template: '<main></main>'
  }).
  when('/start', {
    template: '<p>Start</p>'
  }).
  when('/welcome', {
    template: '<p>Welcome</p>'
  }).
  otherwise('/main');
}
]);
