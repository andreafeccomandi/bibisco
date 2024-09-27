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

angular.module('bibiscoApp').service('NavigationService', function($location, $rootScope, BibiscoPropertiesService) {
  'use strict';

  return {
    calculateMode: function(mode) {
      if (mode === 'default') {
        let currentPath = $location.path();
        let defaultElementOpeningMode = BibiscoPropertiesService.getProperty('defaultElementOpeningMode');
        currentPath = currentPath.replace('default', defaultElementOpeningMode);  
        $location.path(currentPath).replace();
      } else {
        return mode;
      }
    },

    getProjectExplorerCacheEntry: function(path) {
      let key = this.cleanProjectExplorerCachePath(path);
      return $rootScope.projectExplorerCache.get(key);
    },

    setProjectExplorerCacheEntry: function(path, entry) {
      let key = this.cleanProjectExplorerCachePath(path);
      $rootScope.projectExplorerCache.set(key, entry);
    },

    deleteProjectExplorerCacheKey: function(path) {
      let key = this.cleanProjectExplorerCachePath(path);
      $rootScope.projectExplorerCache.delete(key);
    },

    cleanProjectExplorerCachePath: function(path) {

      if (!path) {
        return;
      }

      // Remove trailing slashes
      path = path.replace(/\/+$/, '');
  
      // Split the URL into parts
      const parts = path.split('/');
  
      // Check the last part of the URL
      const lastPart = parts[parts.length - 1];
  
      // If the last part is 'view' or 'edit', remove it
      if (lastPart === 'view' || lastPart === 'edit' || lastPart === 'default') {
        parts.pop();
      }
  
      // Reassemble the URL
      const newUrl = parts.join('/');
  
      return newUrl;
    }
  };
});
