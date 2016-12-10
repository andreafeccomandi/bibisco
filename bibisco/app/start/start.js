angular.
module('bibiscoApp').
component('start', {
  controller: StartController
});


function StartController($location) {
  console.log('Start StartController...');
  var firstAccess = false;
  if (firstAccess == true) {
    $location.path('/welcome');
  } else {
    $location.path('/main');
  }
  console.log('End StartController...');
}
