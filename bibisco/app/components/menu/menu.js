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
  component('menu', {
    templateUrl: 'components/menu/menu.html',
    controller: MenuController
  });

function MenuController($location, $rootScope, MenuService, ProjectService) {

  var self = this;
  self.$onInit = function () {

    self.menu = null;

    // INSERT ELEMENT
    $rootScope.$on('INSERT_ELEMENT', function (event, args) {
      self.updateMenu('INSERT_ELEMENT', args.id, args.collection); 
    });

    // UPDATE ELEMENT
    $rootScope.$on('UPDATE_ELEMENT', function (event, args) {
      self.updateMenu('UPDATE_ELEMENT', args.id, args.collection); 
    });

    // MOVE ELEMENT
    $rootScope.$on('MOVE_ELEMENT', function (event, args) {
      self.updateMenu('MOVE_ELEMENT', args.id, args.collection); 
    });

    // DELETE ELEMENT
    $rootScope.$on('DELETE_ELEMENT', function (event, args) {
      self.updateMenu('DELETE_ELEMENT', args.id, args.collection); 
    });

    // ADD ELEMENT IMAGE
    $rootScope.$on('ADD_ELEMENT_IMAGE', function () {
      self.loadMenu();
    });

    // ADD ELEMENT EVENT
    $rootScope.$on('ADD_ELEMENT_EVENT', function () {
      self.loadMenu();
    });

    // EXPORT SELECT DIRECTORY
    $rootScope.$on('EXPORT_SELECT_DIRECTORY', function () {
      self.loadMenu();
    });

    // MOVE SCENE SELECT CHAPTER
    $rootScope.$on('MOVE_SCENE_SELECT_CHAPTER', function () {
      self.loadMenu();
    });

    // SHOW START EVENT
    $rootScope.$on('SHOW_START', function () {
      self.menu = null;
    });

    // SHOW CREATE PROJECT EVENT
    $rootScope.$on('SHOW_CREATE_PROJECT', function () {
      self.menu = null;
    });

    // SHOW CREATE SEQUEL
    $rootScope.$on('SHOW_CREATE_SEQUEL', function () {
      self.menu = null;
    });

    // SHOW ERROR PAGE
    $rootScope.$on('SHOW_ERROR_PAGE', function () {
      self.menu = null;
    });

    // SHOW IMPORT PROJECT EVENT
    $rootScope.$on('SHOW_IMPORT_PROJECT', function () {
      self.menu = null;
    });

    // SHOW ELEMENT detail
    $rootScope.$on('SHOW_ELEMENT_DETAIL', function () {
      self.loadMenu();
    });

    // SHOW ELEMENT IMAGES
    $rootScope.$on('SHOW_ELEMENT_IMAGES', function () {
      self.loadMenu();
    });

    // SHOW ELEMENT EVENTS
    $rootScope.$on('SHOW_ELEMENT_EVENTS', function () {
      self.loadMenu();
    });

    // SHOW ELEMENT TITLE
    $rootScope.$on('SHOW_ELEMENT_TITLE', function () {
      self.loadMenu();
    });

    // SHOW ELEMENT AUTHOR
    $rootScope.$on('SHOW_ELEMENT_AUTHOR', function () {
      self.loadMenu();
    });

    // SHOW OPEN PROJECT EVENT
    $rootScope.$on('SHOW_OPEN_PROJECT', function () {
      self.menu = null;
    });

    // SHOW SETTINGS
    $rootScope.$on('SHOW_SETTINGS', function () {
      self.menu = null;
    });

    // SHOW TIPS
    $rootScope.$on('SHOW_TIPS', function () {
      self.loadMenu();
    });

    // SHOW WELCOME EVENT
    $rootScope.$on('SHOW_WELCOME', function () {
      self.menu = null;
    });

    // SHOW PROJECT
    $rootScope.$on('SHOW_PAGE', function (event, args) {
      self.loadMenu();
    });
  };

  self.getNode = function(nodes, nodeId) {
    let result = null;
    for (let i = 0; result === null && i < nodes.length; i++) {
      result = self.findNode(nodes[i], nodeId);
    }
    return result;
  };

  self.findNode = function(node, nodeId) {
    if (node.id === nodeId){
      return node;
    } else if (node.children) {
      let i;
      let result = null;
      for(i=0; result === null && i < node.children.length; i++){
        result = self.findNode(node.children[i], nodeId);
      }
      return result;
    }
    return null;
  };

  self.getParentNode = function(nodes, nodeId) {
    let result = null;
    for (let i = 0; result === null && i < nodes.length; i++) {
      result = self.findParentNode(null, nodes[i], nodeId);
    }
    return result;
  };

  self.findParentNode = function(parentNode, node, nodeId) {
    if (node.id === nodeId){
      return parentNode;
    } else if (node.children) {
      let i;
      let result = null;
      for(i=0; result === null && i < node.children.length; i++){
        result = self.findParentNode(node, node.children[i], nodeId);
      }
      return result;
    }
    return null;
  };

  self.loadMenu = function() {
    if (!self.menu) {
      self.menu = MenuService.getMenu();
    }
  };

  self.updateMenu = function(action, id, collection) {

    let nodeId = collection+'_'+id;
    let updatedMenu = MenuService.getMenu();

    if (action === 'INSERT_ELEMENT') {
      let node = self.getNode(updatedMenu, nodeId);
      if (node) {
        // update parent node 
        let parentNodeId = self.getParentNode(updatedMenu, nodeId).id;
        let parentNode = self.getNode(self.menu, parentNodeId);
        parentNode.children = self.getUpdatedChildren(parentNode.children, 
          self.getNode(updatedMenu, parentNodeId).children);
      }
    } else if (action === 'UPDATE_ELEMENT' || action === 'MOVE_ELEMENT')  {
      let updatedNode = self.getNode(updatedMenu, nodeId);
      if (updatedNode) {

        // update element name
        let node = self.getNode(self.menu, nodeId);
        node.name = updatedNode.name;
        
        // update parent node before update if necessary
        let parentNodeBeforeUpdate = self.getParentNode(self.menu, nodeId);
        parentNodeBeforeUpdate.children = self.getUpdatedChildren(parentNodeBeforeUpdate.children, 
          self.getNode(updatedMenu, parentNodeBeforeUpdate.id).children);

        // update parent node after update if necessary
        let parentNodeAfterUpdate = self.getNode(self.menu, self.getParentNode(updatedMenu, nodeId).id);
        if (parentNodeBeforeUpdate.id !== parentNodeAfterUpdate.id) { // is node changing parent?
          parentNodeAfterUpdate.children = self.getUpdatedChildren(parentNodeAfterUpdate.children, 
            self.getNode(updatedMenu, parentNodeAfterUpdate.id).children);
        }
   
      }
    } else if (action === 'DELETE_ELEMENT') {
      let node = self.getNode(self.menu, nodeId);
      if (node) {
        // update parent node 
        let parentNodeBeforeUpdate = self.getParentNode(self.menu, nodeId);
        parentNodeBeforeUpdate.children = self.getUpdatedChildren(parentNodeBeforeUpdate.children, 
          self.getNode(updatedMenu, parentNodeBeforeUpdate.id).children);
      }
    }
  };

  self.getUpdatedChildren = function(childrenBeforeUpdate, childrenAfterUpdate) {
    let needToUpdate = false;
    if ((childrenBeforeUpdate && !childrenAfterUpdate) ||
        (!childrenBeforeUpdate && childrenAfterUpdate) ||
        (childrenBeforeUpdate.length !== childrenAfterUpdate.length)){
      needToUpdate = true;
    } else {
      for (let i = 0; i < childrenBeforeUpdate.length; i++) {
        const childBeforeUpdate = childrenBeforeUpdate[i];
        const childAfterUpdate = childrenAfterUpdate[i];
        if (childBeforeUpdate.id !== childAfterUpdate.id) {
          needToUpdate = true;
          break;
        }
      }
    }

    if (needToUpdate) {
      return childrenAfterUpdate;
    } else {
      return childrenBeforeUpdate;
    }
  };
}
