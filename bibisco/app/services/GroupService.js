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

angular.module('bibiscoApp').service('GroupService', function($rootScope, ChapterService,
  CollectionUtilService, ImageService, LoggerService, ProjectDbConnectionService, UtilService
) {
  'use strict';

  return {
    addElementToGroups(type, id, groupids) {
      this.executeAddElementToGroups(type, id, groupids);
      ProjectDbConnectionService.saveDatabase();
    },
    addElementToGroupsWithoutCommit(type, id, groupids) {
      this.executeAddElementToGroups(type, id, groupids);
    },
    executeAddElementToGroups(type, id, groupids) {
      if(groupids && groupids.length>0) {
        for (let i = 0; i < groupids.length; i++) {
          let group = this.getGroup(groupids[i]);
          if (type==='maincharacter') {
            group.groupcharacters.push('m_' + id);
          } else if (type==='secondarycharacter') {
            group.groupcharacters.push('s_' + id);
          } else if (type==='location') {
            group.grouplocations.push(id);
          } else if (type==='object') {
            group.groupobjects.push(id);
          } else if (type==='strand') {
            group.groupstrands.push(id);
          }
          CollectionUtilService.updateWithoutCommit(this.getCollection(), group);
        }
      }
    },
    addImage: function (id, name, path) {
      let filename = ImageService.addImageToProject(path);
      LoggerService.info('Added image file: ' + filename + ' for element with $loki='
        + id + ' in groups');

      let group = this.getGroup(id);
      let images = group.images;
      images.push({
        name: name,
        filename: filename
      });
      group.images = images;
      CollectionUtilService.update(this.getCollection(), group);
      
      return filename;
    },
    deleteImage: function (id, filename) {

      // delete image file
      ImageService.deleteImage(filename);
      LoggerService.info('Deleted image file: ' + filename + ' for element with $loki='
        + id + ' in groups');

      // delete reference
      let group = this.getGroup(id);
      let images = group.images;
      let imageToRemovePosition;
      for (let i = 0; i < images.length; i++) {
        if (images[i].filename === filename) {
          imageToRemovePosition = i;
          break;
        }
      }
      images.splice(imageToRemovePosition, 1);
      group.images = images;

      // delete profile image reference
      if (group.profileimage === filename) {
        group.profileimage = null;
      }

      CollectionUtilService.update(this.getCollection(), group);

      return group;
    },
    getCollection: function() {
      return ProjectDbConnectionService.getProjectDb().getCollection(
        'groups');
    },
    getElementGroups: function (type, id) {
      let groups = this.getGroups();
      let groupsFound = [];
      for (let i = 0; i < groups.length; i++) {
        let group = groups[i];        
        if ( (type==='maincharacter' && UtilService.array.contains(group.groupcharacters, 'm_' + id))
          || (type==='secondarycharacter' && UtilService.array.contains(group.groupcharacters, 's_' + id))
          || (type==='location' && UtilService.array.contains(group.grouplocations, id)) 
          || (type==='object' && UtilService.array.contains(group.groupobjects, id))
          || (type==='strand' && UtilService.array.contains(group.groupstrands, id))) {
          groupsFound.push(group);
        } 
      }

      return groupsFound;
    },
    getGroup: function(id) {
      return this.getCollection().get(id);
    },
    getGroupsCount: function() {
      return this.getGroups().length;
    },
    getGroups: function() {
      return CollectionUtilService.getDataSortedByPosition(this.getCollection());
    },
    insert: function(group) {
      group.description = '';
      group.images = [];
      group.groupcharacters = [];
      group.grouplocations = [];
      group.groupobjects = [];
      group.groupstrands = [];
      CollectionUtilService.insert(this.getCollection(), group);
      // emit insert event
      $rootScope.$emit('INSERT_ELEMENT', {
        id: group.$loki,
        collection: 'groups'
      });
      return group;
    },
    isElementInGroup: function(type, elementId, groupId) {
      if (groupId==='all' || type==='architecture') {
        return true;
      } 
      else if (type==='group') {
        return elementId === groupId ? true : false;
      } 
      else if (type==='scene') {
        let sceneGroups = ChapterService.getSceneGroups(parseInt(elementId));
        for (let i = 0; i < sceneGroups.length; i++) {
          if (sceneGroups[i].$loki === groupId) {
            return true;
          }
        }
        return false;
      }
      else {
        let elementGroups = this.getElementGroups(type, elementId);
        for (let i = 0; i < elementGroups.length; i++) {
          if (elementGroups[i].$loki === groupId) {
            return true;
          }
        }
        return false;
      }
    },
    move: function(sourceId, targetId) {
      CollectionUtilService.move(this.getCollection(), sourceId, targetId);
      // emit move event
      $rootScope.$emit('MOVE_ELEMENT', {
        id: sourceId,
        collection: 'groups'
      });
    },
    remove: function(id) {
      CollectionUtilService.remove(this.getCollection(), id);
      // emit remove event
      $rootScope.$emit('DELETE_ELEMENT', {
        id: id,
        collection: 'groups'
      });
    },
    removeElementFromGroupsWithoutCommit: function (type, id) {
      let groups = this.getElementGroups(type, id);
      for (let i = 0; i < groups.length; i++) {
        let group = groups[i];     
        if (type==='maincharacter' && UtilService.array.contains(group.groupcharacters, 'm_' + id)) {
          UtilService.array.remove(group.groupcharacters, 'm_' + id);
        } else if (type==='secondarycharacter' && UtilService.array.contains(group.groupcharacters, 's_' + id)) {
          UtilService.array.remove(group.groupcharacters, 's_' + id);
        } else if (type==='location' && UtilService.array.contains(group.grouplocations, id)) {
          UtilService.array.remove(group.grouplocations, id);
        } else if (type==='object' && UtilService.array.contains(group.groupobjects, id)) {
          UtilService.array.remove(group.groupobjects, id);
        } else if (type==='strand' && UtilService.array.contains(group.groupstrands, id)) {
          UtilService.array.remove(group.groupstrands, id);
        }
        CollectionUtilService.updateWithoutCommit(this.getCollection(), group);
      }
    },
    setProfileImage: function (id, filename) {
      LoggerService.info('Set profile image file: ' + filename + ' for element with $loki='
        + id + ' in groups');

      let group = this.getGroup(id);
      group.profileimage = filename;
      CollectionUtilService.update(this.getCollection(), group);
    },
    update: function(group) {
      CollectionUtilService.update(this.getCollection(), group);
      // emit update event
      $rootScope.$emit('UPDATE_ELEMENT', {
        id: group.$loki,
        collection: 'groups'
      });
    },
    updateGroups: function(groups) {
      for (let i = 0; i < groups.length; i++) {
        CollectionUtilService.updateWithoutCommit(this.getCollection(), groups[i]);
      }
      ProjectDbConnectionService.saveDatabase();
    },
    updateWithoutCommit: function(group) {
      CollectionUtilService.updateWithoutCommit(this.getCollection(), group);
    }
  };
});
