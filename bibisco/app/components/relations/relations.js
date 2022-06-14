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
  component('relations', {
    templateUrl: 'components/relations/relations.html',
    controller: RelationsController
  });

/*
How relations works.

Actions on nodes:
- insert: open modal on double click event; programmatically add entry to DataVis, passing: 
	x and y coordinate from double click
	id from UUIDService
	label and group from modal
- update: open modal on double click event; programmatically update entry in DataVis, passing: 
	label and group from modal
- delete: open modal on double click event; done by vis.js (self.network.deleteSelected())
- move: done by vis.js (self.network.disableEditMode()), programmatically update positions of all entries in DataVis on drag end event

Actions on edges:
- insert: always active (self.network.addEdgeMode()); on addEdge event (network.manipulation.addEdge):
	1) add entry to DataVis, passing id from UUIDService
	2) select edge on network by id (self.network.selectEdges([data.id]))
	3) open modal
	4) update entry in Datavis passing label from modal
- update: open modal on double click event; update entry in Datavis passing label from modal
- delete: open modal on double click event; done by vis.js (self.network.deleteSelected())
*/
function RelationsController($injector, $location, $rootScope, $routeParams, $scope, $timeout, 
  $translate, $uibModal, hotkeys, BibiscoPropertiesService, PopupBoxesService, ProjectService, 
  RichTextEditorPreferencesService, TextDimensionService, UuidService) {

  var self = this;
  var RelationsService = $injector.get('RelationsService');

  self.$onInit = function () {

    self.editMode = $routeParams.mode === 'view' ? false: true;
    self.autosaveenabled;
    self.lastsave = ProjectService.getProjectInfo().lastRelationsSave;

    self.checkExit = {
      active: false
    };

    let relationNodes = RelationsService.getRelationsNodes();
    let relationEdges = RelationsService.getRelationsEdges();

    self.emptyRelations = false;
    if (!relationNodes || relationNodes.length === 0) {
      self.emptyRelations = true;
    } 
    self.atLeast2NodesPresent = (relationNodes && relationNodes.length > 1) ? true : false;

    self.nodes = new vis.DataSet(relationNodes);
    self.edges = new vis.DataSet(relationEdges);
    
    let container = document.getElementById('mynetwork');
    
    let data = {
      nodes: self.nodes,
      edges: self.edges
    };

    let options = {
      edges: {
        arrows: 'to',
        color: '#AECF00',
        font: {
          strokeWidth: 0, // px
        },
        smooth: false
      },
      groups: {
        objects: {},
        main_characters: {},
        secondary_characters: {},
        locations: {}
      },
      interaction: {
        dragNodes: false,
        dragView: false,
        navigationButtons: false,
        keyboard: {
          enabled: false,
          bindToWindow: false
        },
        zoomView: false
      }, 
      layout: {
        randomSeed: 2
      }, 
      nodes: {
        font: {
          bold: 'true'
        }
      },
      physics: {
        enabled: false
      }
    };

    self.network = new vis.Network(container, data, options);

    // hotkeys
    hotkeys.bindTo($scope)
      .add({
        combo: ['left'],
        description: 'move left',
        callback: function ($event) {
          self.moveLeft();
        }
      })
      .add({
        combo: ['right'],
        description: 'move right',
        callback: function ($event) {
          self.moveRight();
        }
      })
      .add({
        combo: ['up'],
        description: 'move up',
        callback: function ($event) {
          self.moveUp();
        }
      })
      .add({
        combo: ['down'],
        description: 'move down',
        callback: function ($event) {
          self.moveDown();
        }
      })
      .add({
        combo: ['+'],
        description: 'zoom out',
        callback: function ($event) {
          self.zoomOut();
        }
      })
      .add({
        combo: ['-'],
        description: 'zoom in',
        callback: function ($event) {
          self.zoomIn();
        }
      });

    // Manage dark theme
    self.theme = BibiscoPropertiesService.getProperty('theme');
    if (self.theme === 'dark') {
      self.setDarkThemeNodesEdgesFontColor();
    }

    if (self.editMode) {
      self.initEditMode();
    } else {
      self.initViewMode();
    }

    self.editsavebackbuttonbarspace = self.calculateEditSaveBackButtonbarSpace();

    if (self.editMode && BibiscoPropertiesService.getProperty('relationsTip') === 'true') {
      PopupBoxesService.showTip('relationsTip', 'relationstip');
    }
  };

  self.initViewMode = function() {
    // hotkeys
    hotkeys.bindTo($scope)
      .add({
        combo: ['ctrl+e', 'command+e'],
        description: 'edit',
        callback: function ($event) {
          $event.preventDefault();
          self.edit();
        }
      }).add({
        combo: ['ctrl+n', 'command+n'],
        description: 'start create relation',
        callback: function ($event) {
          $event.preventDefault();
          if (self.emptyRelations) {
            self.edit();
          } 
        }
      });
  };

  self.initEditMode = function() {

    // init flags    
    self.selectedNode = false;
    self.selectedEdge = false;
    $rootScope.dirty = false;
    self.checkExit = {
      active: true
    };

    // init network for editing
    self.network.setOptions({
      interaction: {
        dragNodes: true,
      },
      manipulation: {
        enabled: false,
        addEdge: function(data, callback) {
          if ((data.from === data.to) || (self.isRelationAlreadyPresent(data.from, data.to))) {
            return false;
          }
          data.id = UuidService.generateUuid();
          self.saveEdgeData(data, function() { 
            self.edges.add(data);
          });
          self.network.selectEdges([data.id]);
          self.editEdge(data, function() { 
            self.edges.update(data);
          });
        }
      },
    });

    // click event
    self.network.on('click', function (params) {
      self.selectedNode = false;
      self.selectedEdge = false;
      if (params.nodes.length === 1) { 
        self.selectedNode = true;         
      } else if (params.edges.length === 1) {
        self.selectedNode = false;
        self.selectedEdge = true;
      } else {
        self.selectedNode = false;
        self.selectedEdge = false;
      }
      $scope.$apply();
    });

    // double click event
    self.network.on('doubleClick', function (params) {
      
      // edit node
      if (self.selectedNode) {
        self.updateNodePositions(); // not really necessary, just to make it more robust!
        let data = self.nodes.get(params.nodes[0]);
        
        self.editNode(data, function() { 
          self.nodes.update(data);
        }, 'edit');
      } 
      
      // edit edge
      else if (self.selectedEdge) {
        let data = self.edges.get(params.edges[0]);
        self.editEdge(data, function() { 
          self.edges.update(data);
        });
      } 
      
      // add node
      else {
        let data = {};
        data.id = UuidService.generateUuid();
        data.x = params.pointer.canvas.x;
        data.y = params.pointer.canvas.y;
        self.editNode(data, function() { 
          self.nodes.add(data);
        }, 'add');
      }
    });
    
    // drag end event
    self.network.on('dragEnd', function (params) {
      $rootScope.dirty = true;
      $scope.$apply();
      $timeout(function(){
        self.updateNodePositions(); // here is really necessary: I just dragged a node!
      }, 0);
    });

    // keydown
    $rootScope.keyDownFunction = function(event) {
      self.keyCode = event.keyCode;

      // When SHIFT key is pressed it's possible to move nodes
      if (event.keyCode === 16) {
        self.network.disableEditMode();
        let nodes =  self.network.body.nodes;
        for (node in nodes) {
          nodes[node].options.fixed = {x: false, y: false};
        }
      }
    };

    // keyup
    $rootScope.keyUpFunction = function(event) {
      self.keyCode = null;
      if (event.keyCode === 16) {
        self.network.addEdgeMode();
      }
    };

    self.initRelationsEditor();
  };

  self.initRelationsEditor = function() {
    self.network.addEdgeMode();
  };

  self.edit = function () {
    $location.path('/relations/edit');
  }; 

  self.setClassicThemeNodesEdgesFontColor = function() {
    self.network.setOptions({
      edges: {
        font: {
          color: '#343434',
        }
      },
      nodes: {
        font: {
          color: '#343434',
        }
      }
    });
  };

  self.setDarkThemeNodesEdgesFontColor = function() {
    self.network.setOptions({
      edges: {
        font: {
          color: '#DDD',
        }
      },
      nodes: {
        font: {
          color: '#DDD',
        }
      }
    });
  }; 

  self.export = function(exportpath) {
    $location.path('/relations/export');
  };

  self.save = function () {
    self.updateNodePositions(); // not really necessary, just to make it more robust!
    RelationsService.updateRelations(self.nodes.get(), self.edges.get());
    self.lastsave = ProjectService.getProjectInfo().lastRelationsSave;
    $rootScope.dirty = false;
  };

  self.updateNodePositions = function() {
    let positions = self.network.getPositions();
    if (positions) {
      self.nodes.get().forEach(node => {
        node.x = positions[node.id].x;
        node.y = positions[node.id].y;
        self.nodes.update(node);
      });
    } 
  };

  self.editNode = function (data, callback, mode) {

    let modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'nodedetail',
      resolve: {
        name: function () {
          if (mode === 'add') {
            return null;
          } else if (mode === 'edit') {
            return data.label;
          }
        }, 
        group: function () {
          if (mode === 'add') {
            return null;
          } else if (mode === 'edit') {
            return data.group;
          }
        }, 
      },
      size: 'nodedetail',
    });

    $rootScope.$emit('OPEN_POPUP_BOX');

    modalInstance.result.then(function (node) {

      // edit node
      if (node.action === 'edit') {
        data.label=node.name;
        data.group=node.group;
        if (data.group === 'objects') {
          data.color='#7E0021'; // dark red
          data.shape= 'triangle';
        } else if (data.group === 'main_characters') {
          data.color='#004586'; // blue
          data.shape= 'dot';
        } else if (data.group === 'secondary_characters') {
          data.color='#0084D1'; // light blue
          data.shape= 'dot';
        } else if (data.group === 'locations') {
          data.color='#579D1C'; // green
          data.shape= 'square';
        }
        self.saveNodeData(data,callback);
      }

      // delete
      else if (node.action === 'delete') {
        self.network.deleteSelected();
        self.selectedNode = false;
        self.selectedEdge = false;
        if (self.nodes.get().length === 0) {
          self.emptyRelations = true;
        } 
        if (self.nodes.get().length < 2) {
          self.atLeast2NodesPresent = false;
        }
        $rootScope.dirty = true;
  
      }

      $rootScope.$emit('CLOSE_POPUP_BOX');
      self.initRelationsEditor();
    }, function () {
      $rootScope.$emit('CLOSE_POPUP_BOX');
      self.initRelationsEditor();
    });
  };  

  self.editEdge = function (data, callback, mode) {

    let modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'relationdetail',
      resolve: {
        name: function () {
          return data.label;
        }, 
        usedrelations: function () {
          let usedrelations = [];
          let relations = self.edges.get();
          if (relations) {
            let set = new Set();
            for (let i = 0; i < relations.length; i++) {
              if (relations[i].label) {
                set.add(relations[i].label);
              }
            }
            for (let item of set.values()) {
              usedrelations.push(item);
            }
          }
          return usedrelations;
        }, 
      },
      size: 'relationdetail',
    });

    $rootScope.$emit('OPEN_POPUP_BOX');

    modalInstance.result.then(function (relation) {

      // edit relation
      if (relation.action === 'edit') {
        data.label=relation.name;
        self.saveEdgeData(data,callback);
      }

      // delete
      else if (relation.action === 'delete') {
        self.network.deleteSelected();
        self.selectedNode = false;
        self.selectedEdge = false;
        $rootScope.dirty = true;
      }
      
      $rootScope.$emit('CLOSE_POPUP_BOX');
      self.initRelationsEditor();
    }, function (relation) {
      
      // press back or ESC button when adding relation
      if (!data.label) {
        self.network.deleteSelected();
        self.selectedNode = false;
        self.selectedEdge = false;
        $rootScope.dirty = true;
      }

      $rootScope.$emit('CLOSE_POPUP_BOX');
      self.initRelationsEditor();
    });
  };  

  self.moveUp = function() {
    self.move({x:0, y:50});
  };

  self.moveDown = function() {
    self.move({x:0, y:-50});
  };

  self.moveLeft = function() {
    self.move({x:50, y:0});
  };

  self.moveRight = function() {
    self.move({x:-50, y:0});
  };

  self.move = function(movement) {
    self.network.moveTo({
      offset: movement,
      animation: { 
        duration: 100,
        easingFunction: 'linear'
      }
    });
  };

  self.zoomIn = function() {
    self.zoom(-0.2);
  };

  self.zoomOut = function() {
    self.zoom(0.2);
  };

  self.zoom = function(scale) {
    let actualScale = self.network.getScale();
    let newScale = actualScale+scale;
    self.network.moveTo({
      scale: newScale,
      animation: { 
        duration: 100,
        easingFunction: 'linear'
      }
    });
  };

  self.fit = function() {
    self.network.fit();
  };

  self.isRelationAlreadyPresent = function(from, to) {
    let relationEdges = self.edges.get();
    if (!relationEdges || relationEdges.length === 0) {
      return false;
    } else {
      for (let i = 0; i < relationEdges.length; i++) {
        let edge = relationEdges[i];
        if ((edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)) {
          return true;
        }
      }
      return false;
    }
  };

  self.saveNodeData = function (data, callback) {
    callback(data);
    self.emptyRelations = false;
    if (self.nodes.get().length > 1) {
      self.atLeast2NodesPresent = true;
    }
    $rootScope.dirty = true;
  };
  
  self.saveEdgeData = function(data, callback) {
    if (typeof data.to === 'object') data.to = data.to.id;
    if (typeof data.from === 'object') data.from = data.from.id;
    self.selectedNode = false;
    self.selectedEdge = false;
    callback(data);
    $rootScope.dirty = true;
  };

  self.opensettings = function() {

    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'richtexteditorsettings',
      resolve: {
        context: function () {
          return 'relations';
        }
      },
      size: 'richtexteditorsettings',
    });

    $rootScope.$emit('OPEN_POPUP_BOX');

    modalInstance.result.then(function() {
      self.autosaveenabled = RichTextEditorPreferencesService.isAutoSaveEnabled();
      $rootScope.$emit('CLOSE_POPUP_BOX');
      self.initRelationsEditor();
    }, function () {
      $rootScope.$emit('CLOSE_POPUP_BOX');
      self.initRelationsEditor();
    });
  };

  self.help = function() {

    var modalInstance = $uibModal.open({
      animation: true,
      backdrop: 'static',
      component: 'relationshelp',
      size: 'relationstip',
    });

    $rootScope.$emit('OPEN_POPUP_BOX');

    modalInstance.result.then(function() {
      $rootScope.$emit('CLOSE_POPUP_BOX');
      self.initRelationsEditor();
    }, function () {
      $rootScope.$emit('CLOSE_POPUP_BOX');
      self.initRelationsEditor();
    });
  };

  self.calculateEditSaveBackButtonbarSpace = function() {
    let space = 0;
    if (self.editMode) {
      space += TextDimensionService.calculateElementDimension($translate.instant('jsp.common.button.save')) + TextDimensionService.BUTTON_STANDARD_MARGIN;
    } else {
      space += TextDimensionService.calculateElementDimension($translate.instant('jsp.common.button.edit')) + TextDimensionService.BUTTON_STANDARD_MARGIN;
      space += TextDimensionService.calculateElementDimension($translate.instant('common_export_button')) + TextDimensionService.BUTTON_STANDARD_MARGIN;
    }
    space += TextDimensionService.calculateElementDimension($translate.instant('jsp.common.button.back')) + TextDimensionService.BUTTON_STANDARD_MARGIN;
    return space+40;
  };

  $scope.$on('$locationChangeStart', function (event) {
    PopupBoxesService.locationChangeConfirm(event, $rootScope.dirty, self.checkExit, 
      null, self.initRelationsEditor);
  });


  $scope.$on('$locationChangeSuccess', function (event) {
    $rootScope.keyDownFunction = null;
    $rootScope.keyUpFunction = null;
  });
}