/* eslint-disable indent */
/*
 * Copyright (C) 2014-2024 Andrea Feccomandi
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

angular.module('bibiscoApp').service('MenuService', function ($injector,
  $translate, ChapterService, LocationService, MainCharacterService, SecondaryCharacterService, 
  StrandService, SupporterEditionChecker) {
  'use strict';

  let ObjectService = null;
  let GroupService = null;
  let MindmapService = null;
  let NoteService = null;

  return {

    getMenu: function() {
      
      let includeSupporterEditionItems = SupporterEditionChecker.isSupporterOrTrial();
      
      let menu = [];
      this.pushProject(menu);
      this.pushArchitecture(menu, includeSupporterEditionItems);
      this.pushCharacters(menu);
      this.pushLocations(menu);
      this.pushObjects(menu, includeSupporterEditionItems);
      this.pushGroups(menu, includeSupporterEditionItems);
      this.pushMindmaps(menu, includeSupporterEditionItems);
      this.pushNotes(menu, includeSupporterEditionItems); 
      this.pushChapters(menu);
      this.pushSearch(menu);
      this.pushTimeline(menu);
      this.pushAnalysis(menu);
      this.pushExport(menu);
      this.pushTips(menu);
      this.pushExitProject(menu);

      return menu;
    },

    pushProject: function(menu) {
      menu.push({
        id: 'project',
        name: $translate.instant('common_project'),
        icon: 'book',
        link: 'projecthome',
        children: []
      });
    },

    pushArchitecture: function(menu, includeSupporterEditionItems) {
      let children = [];
      children.push({
        id: 'premise',
        name: $translate.instant('jsp.architecture.thumbnail.premise.title'),
        icon: 'compass',
        link: '/architectureitems/premise/default'
      });
      children.push({
        id: 'fabula',
        name: $translate.instant('jsp.architecture.thumbnail.fabula.title'),
        icon: 'clock-o',
        link: '/architectureitems/fabula/default'
      });
      children.push({
        id: 'setting',
        name: $translate.instant('jsp.architecture.thumbnail.setting.title'),
        icon: 'globe',
        link: '/architectureitems/setting/default'
      });
      if (includeSupporterEditionItems) {
        children.push({
          id: 'globalnotes',
          name: $translate.instant('common_notes_title'),
          icon: 'thumb-tack',
          link: '/architectureitems/globalnotes/default',
          supportersfeature: true,
          supportersonly: true
        });
      }
      this.pushNarrativeStrands(children);

      menu.push({
        id: 'architecture',
        name: $translate.instant('common_architecture'),
        link: 'architecture',
        children: children
      });
    },

    pushNarrativeStrands: function(menu) {
      let children = [];
      let strands = StrandService.getStrands();
      if (strands && strands.length > 0) {
        for (let i = 0; i < strands.length; i++) {
          children.push({
            id: 'strands_' + strands[i].$loki,
            name: strands[i].name,
            icon: 'code-fork',
            link: '/strands/' + strands[i].$loki + '/default'
          });
        }
      }
      menu.push({
        id: 'strands',
        name: $translate.instant('common_strands'),
        link: 'architecture',
        children: children
      });
    },

    pushCharacters: function(menu) {
      let children = [];
      let mainCharacters = MainCharacterService.getMainCharacters();
      if (mainCharacters && mainCharacters.length > 0) {
        for (let i = 0; i < mainCharacters.length; i++) {
          children.push({
            id: 'maincharacters_' + mainCharacters[i].$loki,
            name: mainCharacters[i].name,
            icon: 'user',
            link: '/maincharacters/' + mainCharacters[i].$loki
          });
        }
      }

      let secondaryCharacters = SecondaryCharacterService.getSecondaryCharacters();
      if (secondaryCharacters && secondaryCharacters.length > 0) {
        for (let i = 0; i < secondaryCharacters.length; i++) {
          children.push({
            id: 'secondarycharacters_' + secondaryCharacters[i].$loki,
            name: secondaryCharacters[i].name,
            icon: 'user-o',
            link: '/secondarycharacters/' + secondaryCharacters[i].$loki + '/default'
          });
        }
      }

      menu.push({
        id: 'characters',
        name: $translate.instant('common_characters'),
        link: 'characters',
        children: children
      });
    },

    pushLocations: function(menu) {
      let children = [];
      let locations = LocationService.getLocations();
      if (locations && locations.length > 0) {
        for (let i = 0; i < locations.length; i++) {
          children.push({
            id: 'locations_' + locations[i].$loki,
            name: locations[i].location,
            icon: 'map-marker',
            link: '/locations/' + locations[i].$loki + '/default'
          });
        }
      }

      menu.push({
        id: 'locations',
        name: $translate.instant('common_locations'),
        link: 'locations',
        children: children
      });
    },

    pushObjects: function (menu, supporterEdition) {
      let children = [];
      if (supporterEdition) {
        let objects = this.getObjectService().getObjects();
        if (objects && objects.length > 0) {
          for (let i = 0; i < objects.length; i++) {
            children.push({
              id: 'objects_' + objects[i].$loki,
              name: objects[i].name,
              icon: 'magic',
              link: '/objects/' + objects[i].$loki + '/default',
              supportersonly: true
            });
          }
        }
      }

      menu.push({
        id: 'objects',
        name: $translate.instant('objects'),
        link: 'objects',
        supportersonly: true,
        supportersfeature: true,
        children: children
      });
    },

    pushGroups: function (menu, supporterEdition) {
      let children = [];
      if (supporterEdition) {
        let groups = this.getGroupService().getGroups();
        if (groups && groups.length > 0) {
          for (let i = 0; i < groups.length; i++) {
            children.push({
              id: 'groups_' + groups[i].$loki,
              name: groups[i].name,
              icon: 'group',
              link: '/groups/' + groups[i].$loki + '/default',
              supportersonly: true
            });
          }
        }
      }

      menu.push({
        id: 'groups',
        name: $translate.instant('groups'),
        link: 'groups',
        supportersonly: true,
        supportersfeature: true,
        children: children
      });
    },

    pushMindmaps: function (menu, supporterEdition) {
      let children = [];
      if (supporterEdition) {
        let mindmaps = this.getMindmapService().getMindmaps();
        if (mindmaps && mindmaps.length > 0) {
          for (let i = 0; i < mindmaps.length; i++) {
            children.push({
              id: 'mindmaps_' + mindmaps[i].$loki,
              name: mindmaps[i].name,
              icon: 'sitemap',
              link: '/relations/' + mindmaps[i].$loki + '/default',
              supportersonly: true
            });
          }
        }
      }

      menu.push({
        id: 'mindmaps',
        name: $translate.instant('common_mindmaps_title'),
        link: 'mindmaps',
        supportersonly: true,
        supportersfeature: true,
        children: children
      });
    },

    pushNotes: function (menu, supporterEdition) {
      let children = [];
      if (supporterEdition) {
        let notes = this.getNoteService().getNotes();
        if (notes && notes.length > 0) {
          for (let i = 0; i < notes.length; i++) {
            children.push({
              id: 'notes_' + notes[i].$loki,
              name: notes[i].name,
              icon: 'thumb-tack',
              link: '/notes/' + notes[i].$loki + '/default',
              supportersonly: true
            });
          }
        }
      }

      menu.push({
        id: 'notes',
        name: $translate.instant('common_notes_title'),
        link: 'notes',
        supportersonly: true,
        supportersfeature: true,
        children: children
      });
    },

    pushChapters: function(menu) {

      let children = [];
      
      // prologue
      let prologue = ChapterService.getPrologue();
      if (prologue) {
       this.pushChapter(prologue, false, children);
      }
      
      // chapters and parts
      let chapters = ChapterService.getChapters();
      let partsEnabled = ChapterService.getPartsCount()>0 ? true : false;
      let parts = ChapterService.getParts();
      let partChapters = [];

      if (partsEnabled) {
        for (let i = 0; i < parts.length; i++) {
          partChapters.push([]);
        }
      }
      if (chapters && chapters.length > 0) {
        for (let i = 0; i < chapters.length; i++) {
          if (partsEnabled) {
            let part = ChapterService.getPartByChapterPosition(chapters[i].position);
            this.pushChapter(chapters[i], true, partChapters[part.position-1]);
          } else {
            this.pushChapter(chapters[i], true, children);
          }          
        }
      }
      if (partsEnabled) {
        for (let i = 0; i < parts.length; i++) {
          children.push({
            id: 'parts_' + parts[i].$loki,
            name: parts[i].title,
            children: partChapters[i],
            link: 'chapters'
          });
        }
      }

      // epilogue
      let epilogue = ChapterService.getEpilogue();
      if (epilogue) {
        this.pushChapter(epilogue, false, children);
      }

      menu.push({
        id: 'chapters',
        name: $translate.instant('common_chapters'),
        link: 'chapters',
        children: children
      });
    },

    pushChapter: function(chapter, positionintitle, chapters) {

      let children = [];
      let scenes = ChapterService.getScenes(chapter.$loki);
      if (scenes && scenes.length > 0) {
        for (let i = 0; i < scenes.length; i++) {
          children.push({
            id: 'scenes_' + scenes[i].$loki,
            name: scenes[i].title,
            icon: 'bookmark-o',
            link: '/chapters/' + chapter.$loki + '/scenes/' + scenes[i].$loki + '/default'
          });
        }
      }
      children.push({
        id: 'chapterreason_' + chapter.$loki,
        name: $translate.instant('jsp.chapter.thumbnail.reason.title'),
        icon: 'map-o',
        link: '/chapters/' + chapter.$loki + '/chapterinfos/reason/default'
      });
      children.push({
        id: 'chapternotes_' + chapter.$loki,
        name: $translate.instant('common_notes_title'),
        icon: 'thumb-tack',
        link: '/chapters/' + chapter.$loki + '/chapterinfos/notes/default'

      });

      chapters.push({
        id: 'chapters_' + chapter.$loki,
        name: positionintitle ? ChapterService.getChapterPositionDescription(chapter.position) + ' ' + chapter.title : chapter.title,
        link: 'chapters/' + chapter.$loki,
        children: children
      });
    },

    pushSearch: function(menu) {
      menu.push({
        id: 'search',
        name: $translate.instant('search_title'),
        icon: 'search',
        link: 'search',
        supportersonly: true,
        supportersfeature: true,
        children: []
      });
    },

    pushTimeline: function(menu) {
      menu.push({
        id: 'timeline',
        name: $translate.instant('timeline_title'),
        icon: 'calendar',
        link: 'timeline',
        supportersonly: true,
        supportersfeature: true,
        children: []
      });
    },

    pushAnalysis: function(menu) {
      menu.push({
        id: 'analysis',
        name: $translate.instant('jsp.analysis.h1'),
        icon: 'bar-chart',
        link: 'analysis',
        children: []
      });
    },

    pushExport: function(menu) {
      menu.push({
        id: 'export',
        name: $translate.instant('common_export'),
        icon: 'rocket',
        link: 'export',
        children: []
      });
    },

    pushTips: function(menu) {
      menu.push({
        id: 'tips',
        name: $translate.instant('tips'),
        icon: 'lightbulb-o',
        link: 'tips',
        children: []
      });
    },

    pushExitProject: function(menu) {
      menu.push({
        id: 'exitproject',
        name: $translate.instant('jsp.project.a.exitProject'),
        icon: 'sign-out',
        link: 'exitproject',
        children: []
      });
    },

    getObjectService: function () {
      if (!ObjectService) {
        ObjectService = $injector.get('ObjectService');
      }
      return ObjectService;
    },

    getGroupService: function () {
      if (!GroupService) {
        GroupService = $injector.get('GroupService');
      }
      return GroupService;
    },

    getNoteService: function () {
      if (!NoteService) {
        NoteService = $injector.get('NoteService');
      }
      return NoteService;
    },

    getMindmapService: function () {
      if (!MindmapService) {
        MindmapService = $injector.get('MindmapService');
      }
      return MindmapService;
    },
  };
});
