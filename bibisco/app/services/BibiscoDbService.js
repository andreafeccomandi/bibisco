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

angular.module('bibiscoApp') .service('BibiscoDbService', function (LoggerService) {
    'use strict';

    var remote = require('electron').remote;
    var bibiscodb = remote.getGlobal('bibiscodb');
    var properties = bibiscodb.getCollection('properties');

    return {
        getProperty: function(name) {
          return properties.findOne({"name": name}).value;
        },
        setProperty: function(name, value) {
            var property = properties.findOne({"name": name});
            property.value = value;
            return properties.update(property);
        },
        saveDatabase: function(callback) {
          return bibiscodb.saveDatabase(callback);
        }
    };
});
