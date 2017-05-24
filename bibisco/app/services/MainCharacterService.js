/*
 * Copyright (C) 2014-2017 Andrea Feccomandi
 *
 * Licensed under the terms of GNU GPL License;
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.gnu.org/licenses/gpl-2.0.html
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY.
 * See the GNU General Public License for more details.
 *
 */

angular.module('bibiscoApp').service('MainCharacterService', function(
  CollectionUtilService, LoggerService, ProjectDbConnectionService
) {
  'use strict';

  var collection = ProjectDbConnectionService.getProjectDb().getCollection(
    'maincharacters');
  var dynamicView = collection.addDynamicView(
    'all_maincharacters').applySimpleSort('position');

  return {
    getMainCharacter: function(id) {
      return collection.get(id);
    },
    getMainCharactersCount: function() {
      return collection.count();
    },
    getMainCharacters: function() {
      return dynamicView.data();
    },
    insert: function(maincharacter) {
      CollectionUtilService.insert(collection, maincharacter);
    },
    move: function(sourceId, targetId) {
      return CollectionUtilService.move(collection, sourceId, targetId,
        this.getMainCharacters);
    }
  }
});
