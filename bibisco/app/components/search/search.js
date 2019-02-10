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

function SearchController($rootScope, SearchService) {

  var self = this;
  self.$onInit = function() {

    self.casesensitiveactive = false;
    self.wholewordactive = false;
    self.onlyscenes = false;
    
    // show menu item
    $rootScope.$emit('SHOW_PAGE', {
      item: 'search'
    });

    self.results = null;   
  };

  self.toggleCaseSensitive = function () {
    self.casesensitiveactive = !self.casesensitiveactive;
  };

  self.toggleWholeWord = function () {
    self.wholewordactive = !self.wholewordactive;
  };

  self.searchOnlyScenes = function () {
    self.onlyscenes = true;
  };

  self.searchAll = function () {
    self.onlyscenes = false;
  };
}
