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
  component('detailheader', {
    templateUrl: 'components/common/uielements/detail-header/detail-header.html',
    controller: DetailHeaderController,
    bindings: {
      breadcrumbitems: '<',
      buttonhotkey: '<',
      buttonlabel: '@',
      buttonfunction: '&',
      buttonshow: '<',
      buttonstyle: '@', 
      buttontooltip: '@',
      characters: '<',
      headertipcode: '@',
      headertipenabled: '<',
      headertitle: '@',
      headersubtitle: '@',
      image: '@',
      imageaddenabled: '<',
      imageenabled: '<',
      imagefunction: '&',
      noimageicon: '@',
      tags: '<',
      taskstatus: '<',
      taskstatuschangefunction: '&',
      taskstatusreadonly: '<',
      words: '<'
    }
  });


function DetailHeaderController() {}
