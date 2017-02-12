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

angular.module('bibiscoApp').service('ExceptionHandlerService', function ($log, LoggerService) {
    'use strict';

    // I log the given error to log file.
    function log( exception, cause ) {

        // Pass off the error to the default error handler
        // on the AngularJS logger. This will output the
        // error to the console (and let the application
        // keep running normally for the user).
        $log.error.apply( $log, arguments );

        // Now, we need to try and log the error using the file logger.
        LoggerService.error('***EXCEPTION CAUSE*** : ' + cause);
        LoggerService.error('***EXCEPTION STACKTRACE*** : ' + exception.stack);
    }
    // Return the logging function.
    return( log );
});
