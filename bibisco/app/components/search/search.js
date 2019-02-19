/*
 * Copyright (C) 2014-2018 Andrea Feccomandi
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

function SearchController($location, $rootScope, SearchService) {

  var self = this;
  self.$onInit = function() {

    self.text2search = null;
    self.casesensitiveactive = false;
    self.wholewordactive = false;
    self.onlyscenes = false;
    self.results = null;   
    
    // show menu item
    $rootScope.$emit('SHOW_PAGE', {
      item: 'search'
    });
  };

  self.toggleCaseSensitive = function () {
    self.casesensitiveactive = !self.casesensitiveactive;
  };

  self.toggleWholeWord = function () {
    self.wholewordactive = !self.wholewordactive;
  };

  self.toggleSearchOnlyScenes = function () {
    self.onlyscenes = true;
  };

  self.toggleSearchAll = function () {
    self.onlyscenes = false;
  };

  self.search = function() {
    self.results = SearchService.search(self.text2search, 
      self.casesensitiveactive, self.wholewordactive, self.onlyscenes);
  };

  self.gotoElement = function (path) {
    $location.path(path);
  };  
}
