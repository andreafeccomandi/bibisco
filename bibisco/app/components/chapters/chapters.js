/*
 * Copyright (C) 2014-2020 Andrea Feccomandi
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
  component('chapters', {
    templateUrl: 'components/chapters/chapters.html',
    controller: ChaptersController,
    bindings: {

    }
  });

function ChaptersController($injector, $location, $routeParams, $rootScope, $scope, 
  CardUtilService, ChapterService, ProjectService, SupporterEditionChecker) {
  var self = this;

  self.$onInit = function() {

    // show menu item
    $rootScope.$emit('SHOW_PAGE', {
      item: 'chapters'
    });

    self.cardgriditems = this.getCardGridItems();
    self.tipenabled = (self.cardgriditems && self.cardgriditems.length > 1);
    let totalWordsAndCharacters = ChapterService.getTotalWordsAndCharacters();
    self.pageheadercharacters = totalWordsAndCharacters.characters;
    self.pageheaderwords = totalWordsAndCharacters.words;

    // supporters check
    let supporterEdition = false;
    if (SupporterEditionChecker.check()) {
      $injector.get('IntegrityService').ok();
      supporterEdition = true;
    } 
    let wordsGoal = ProjectService.getProjectInfo().wordsGoal;
    self.showwordsgoalcounter = supporterEdition && wordsGoal;

    // focus element
    CardUtilService.focusElementInPath($routeParams.params);

    // hotkeys
    self.hotkeys = ['ctrl+n', 'command+n'];
  };
  
  self.create = function() {
    $location.path('/chapters/new');
  };

  self.getCardGridItems = function() {
    let items;
    if (ChapterService.getChaptersCount() > 0) {
      let chapters = ChapterService.getChapters();
      items = [];
      for (let i = 0; i < chapters.length; i++) {
        items.push({
          characters: chapters[i].characters,
          id: chapters[i].$loki,
          position: chapters[i].position,
          status: chapters[i].status,
          text: chapters[i].title,
          title: '#' + chapters[i].position,
          words: chapters[i].words
        });
      }
    }
    return items;
  };

  self.move = function(draggedObjectId, destinationObjectId) {
    ChapterService.move(draggedObjectId, destinationObjectId);
    self.cardgriditems = this.getCardGridItems();
    $scope.$apply();
  };

  self.select = function(id) {
    $location.path('/chapters/' + id);
  };
}
