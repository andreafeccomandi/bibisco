angular.
module('bibiscoApp').
component('main', {
  controller: MainController
});


function MainController($location) {
  console.log('Start MainController...');
  var firstAccess = true;
  if (firstAccess == true) {
    $location.path('/welcome');
  } else {
    $location.path('/start');
  }
  console.log('End MainController...');
}
