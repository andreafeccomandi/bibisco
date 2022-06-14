/*
 * Copyright (C) 2014-2022 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.gnu.org/licenses/gpl-3.0.en.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */
angular.
  module('bibiscoApp').
  component('search', {
    templateUrl: 'components/search/search.html',
    controller: SearchController
  });

function SearchController($injector, $location, $rootScope, $scope, $timeout, hotkeys) {

  var self = this;
  var SearchService = $injector.get('SearchService');
  
  self.$onInit = function() {

    self.results = null;   
    
    // show menu item
    $rootScope.$emit('SHOW_PAGE', {
      item: 'search'
    });

    // hotkey
    hotkeys.bindTo($scope).
      add({
        combo: ['enter', 'enter'],
        description: 'enter',
        allowIn: ['INPUT'],
        callback: function ($event) {
          if ($rootScope.text2search) {
            $event.preventDefault();
            self.search();
          }
        }
      });

    // search
    self.search();
  };

  self.toggleCaseSensitive = function () {
    $rootScope.searchCasesensitiveactive = !$rootScope.searchCasesensitiveactive;
    self.search();
  };

  self.toggleWholeWord = function () {
    $rootScope.searchWholewordactive = !$rootScope.searchWholewordactive;
    self.search();
  };

  self.toggleSearchOnlyScenes = function () {
    $rootScope.searchOnlyscenes = true;
    self.search();
  };

  self.toggleSearchAll = function () {
    $rootScope.searchOnlyscenes = false;
    self.search();
  };

  self.search = function() {
    if ($rootScope.text2search) {
      self.loading = true;
      $timeout(function () {
        self.results = SearchService.search($rootScope.text2search, 
          $rootScope.searchCasesensitiveactive, $rootScope.searchWholewordactive, 
          $rootScope.searchOnlyscenes);
        self.loading = false;
      },0);
    }
  };

  self.gotoElement = function (path) {
    $rootScope.richtexteditorSearchActiveOnOpen = true;
    $location.path(path);
  };  
}
