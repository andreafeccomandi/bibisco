/*
 * Copyright (C) 2014-2023 Andrea Feccomandi
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

function ChaptersController($location, $rootScope, $scope, hotkeys, ChapterService, 
  PopupBoxesService, ProjectService, SupporterEditionChecker) {
  var self = this;

  self.$onInit = function() {

    self.cardgriditems = self.getCardGridItems();
    self.partsExpansionStatus = [];
    self.updatePartsExpansionStatus();
    self.tipenabled = (self.cardgriditems && self.cardgriditems.length > 1);
    let totalWordsAndCharacters = ChapterService.getTotalWordsAndCharacters();
    self.pageheadercharacters = totalWordsAndCharacters.characters;
    self.pageheaderwords = totalWordsAndCharacters.words;

    // action items
    self.actionitems = [];
    if (!self.cardgriditems.prologue) {
      self.actionitems.push({
        label: 'create_prologue',
        itemfunction: function() {
          SupporterEditionChecker.filterAction(function() {
            $location.path('/chapters/new/prologue');
          });
        }
      });
    }
    if (!self.cardgriditems.epilogue) {
      self.actionitems.push({
        label: 'create_epilogue',
        itemfunction: function() {
          SupporterEditionChecker.filterAction(function() {
            $location.path('/chapters/new/epilogue');
          });
        }
      });
    }
    self.actionitems.push({
      label: 'create_part',
      itemfunction: function() {
        SupporterEditionChecker.filterAction(function() {
          $location.path('/parts/new');
        });
      }
    });

    // supporters check
    let wordsGoal = ProjectService.getProjectInfo().wordsGoal;
    self.showwordsgoalcounter = SupporterEditionChecker.isSupporterOrTrial() && wordsGoal;

    // hotkeys
    hotkeys.bindTo($scope)
      .add({
        combo: ['ctrl+n', 'command+n'],
        description: 'chaptercreate',
        callback: function ($event) {
          $event.preventDefault();
          self.create();
        }
      })
      .add({
        combo: ['ctrl+o', 'command+o'],
        description: 'readnovel',
        callback: function($event) {
          $event.preventDefault();
          self.showChaptersRead();
        }
      });
  };
  
  self.create = function() {
    $location.path('/chapters/new');
  };

  self.updatePartsExpansionStatus = function() {

    let partscount = ChapterService.getPartsCount();
    if (partscount > 0) {
      let parts = ChapterService.getParts();
      for (let i = 0; i < parts.length; i++) {
        if ($rootScope.partsExpansionStatus[parts[i].$loki] !== true && $rootScope.partsExpansionStatus[parts[i].$loki] !== false) {
          $rootScope.partsExpansionStatus[parts[i].$loki] = true; 
        }
      }
    }
  };

  self.getCardGridItems = function() {
    
    let partscount = ChapterService.getPartsCount();
    let chapterscount = ChapterService.getChaptersCount();
    let prologue = self.createChapterCardData(ChapterService.getPrologue(),'prologue');
    let epilogue = self.createChapterCardData(ChapterService.getEpilogue(),'epilogue');
    let result = {
      prologue: prologue,
      epilogue: epilogue,
      partscount: partscount,
      chapterscount: chapterscount
    };

    // prepare result structure
    if (partscount > 0) {
      let parts = ChapterService.getParts();
      result.parts = [];
      let lastchapterposition = 0;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        lastchapterposition += part.chaptersincluded;
        partactionitems = self.getPartActionItems(part.$loki);
        result.parts.push({
          id: part.$loki,
          title: part.title,
          lastchapterposition: lastchapterposition,
          chapters: [],
          partactionitems: partactionitems
        });
      }
    } else {
      result.whole = {
        chapters: []
      };
    }

    // populating result structure with chapters
    if (chapterscount  > 0) {
      let chapters = ChapterService.getChapters();    
      let part;
      for (let i=0; i < chapters.length; i++) {
        if (partscount > 0) {
          for (let j = 0; j < partscount; j++) {
            if (result.parts[j].lastchapterposition >= chapters[i].position) {
              part = result.parts[j];
              break;
            }
          }
        } else {
          part = result.whole;
        }
        part.chapters.push(self.createChapterCardData(chapters[i], 'chapter'));
      }
    }
    return result;
  };

  self.createChapterCardData = function(chapter, type) {

    if (!chapter) {
      return null;
    }

    let title = ChapterService.getChapterPositionDescription(chapter.position);
    let family;
    switch(type) {
    case 'prologue':
      family='prologue';
      break;
    case 'epilogue':
      family='epilogue';
      break;
    case 'chapter':
      family='chapters';
      break;
    }

    let tags = [];
    if (SupporterEditionChecker.isSupporterOrTrial()) {
      let chapterGroups = ChapterService.getChapterGroups(chapter.$loki);
      for (let i = 0; i < chapterGroups.length; i++) {
        tags.push({label: chapterGroups[i].name, color: chapterGroups[i].color});
      }
    }

    return {
      characters: chapter.characters,
      family: family,
      id: chapter.$loki,
      noimageicon: 'bookmark',
      position: chapter.position,
      status: chapter.status,
      tags: tags,
      text: chapter.title,
      title: title,
      words: chapter.words
    };
  };

  self.getPartActionItems = function(id) {
    let partactionitems = [];
    partactionitems.push({
      label: 'change_part_title',
      itemfunction: function() {
        self.renamepart(id);
      }
    }, {
      label: 'jsp.common.button.delete',
      itemfunction: function () {
        PopupBoxesService.confirm(function() {self.deletepart(id);}, 'delete_part_confirm');
      }
    });
    return partactionitems;
  };

  self.move = function(draggedObjectId, destinationObjectId) {
    ChapterService.move(draggedObjectId, destinationObjectId);
    self.cardgriditems = this.getCardGridItems();
    $scope.$apply();
  };

  self.movetopart = function(chapterId, partId) {
    ChapterService.moveToPart(chapterId, partId);
    self.cardgriditems = this.getCardGridItems();
    $scope.$apply();
  };

  self.select = function(id) {
    $location.path('/chapters/' + id);
  };

  self.reducepart = function(id) {
    SupporterEditionChecker.filterAction(function() {
      $rootScope.partsExpansionStatus[id] = false; 
    });
  };

  self.expandpart = function(id) {
    SupporterEditionChecker.filterAction(function() {
      $rootScope.partsExpansionStatus[id] = true; 
    });
  };

  self.renamepart = function(id) {
    SupporterEditionChecker.filterAction(function() {
      $location.path('/parts/'+id);
    });
  };

  self.deletepart = function(id) {
    SupporterEditionChecker.filterAction(function() {
      ChapterService.removePart(id);
      self.cardgriditems = self.getCardGridItems();
    });
  };

  self.showChaptersRead = function() {
    SupporterEditionChecker.filterAction(function() {
      let chapters = ChapterService.getChaptersWithPrologueAndEpilogue();
      $location.path('/chapters/read/'+chapters[0].$loki);
    });
  };
}
