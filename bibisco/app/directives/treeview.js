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

angular.module('bibiscoApp').directive('treeView',
  function ($compile, $location, SupporterEditionChecker) {
    return {
      restrict: 'E',
      scope: {},
      bindToController: {
        nodes: '='
      },
      controller: function () {

        let self = this;
        self.collapsed = [];

        this.isCollapsed = function(node) {
          return self.collapsed.indexOf(node) > -1;
        };

        // toggle when icon clicked
        this.toggleNode = function (node) {

          if (!node.children) return;

          // collapse / expand
          if (node.children && node.children.length > 0) {
          // add the node to our collapsed array
            let index = self.collapsed.indexOf(node);

            if (index === -1)
              self.collapsed.push(node);
            else
              self.collapsed.splice(index, 1);
          }
        };

        // select when name clicked
        this.selectNode = function (e, node) {
          if (node.supportersonly) {
            SupporterEditionChecker.filterAction(function() {
              $location.path(node.link);
            });
          } else  {
            $location.path(node.link);
          }

          e.stopPropagation();
          e.preventDefault();
        };
      },
      controllerAs: '$ctrl',
      link: function (scope, element, attrs, $ctrl) {
      
      // is root?
        let isRoot = (!attrs.treeRoot ? true : false);
        element.removeAttr('tree-root');

        // template
        let template = '<ul>';
        template += '<li ng-repeat="node in [REPLACENODES]">' +
                '<div class="node" ng-class="{\'selected\' : node.selected}">' +
                '<div>' +
                '<i ng-click="$ctrl.toggleNode(node)" ng-show="node.children && node.children.length > 0" ng-class="!$ctrl.isCollapsed(node) ? \'has-child\' : \'has-child-open\'"></i>' +
                '<i ng-click="$ctrl.toggleNode(node)" class="no-child fa-{{node.icon}}" ng-show="!node.children || node.children.length == 0"></i>' +
                '<span ng-click="$ctrl.selectNode($event, node)" ng-bind="node.name" ng-class="{\'selected\' : node.selected}"></span>' +
                '<span ng-if="$root.ed===\'ce\' && node.supportersfeature"><i class="fa fa-heart-o supportersFeaturesSymbol"></i></span>' +
                '</div>' +
                '</div>' +
                '<tree-view uib-collapse="!$ctrl.isCollapsed(node)" tree-root="false"></tree-view>' +
                '</li>' +
                '</ul>';
        template = !isRoot ? template.replace('[REPLACENODES]', '$parent.node.children') : template.replace('[REPLACENODES]', '$ctrl.nodes');

        let compiledHtml = $compile(template)(scope);
        element.append(compiledHtml);
      }
    };
  });