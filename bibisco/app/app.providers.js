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

// By default, AngularJS will catch errors and log them to
// the Console. I want to keep that behavior; however, I
// want to intercept it so that I can also log the errors
// to file for later analysis. So I have to override the $exceptionHandler
// provider and replace it with a custom one: ExceptionHandlerService
angular.module('bibiscoApp').provider(
    "$exceptionHandler", {
        $get: function( ExceptionHandlerService ) {
            return( ExceptionHandlerService );
        }
    }
)
