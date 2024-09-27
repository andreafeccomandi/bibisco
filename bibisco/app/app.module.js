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

// Define the 'bibisco' module
angular.module('bibiscoApp', ['ngRoute',
  'cfp.hotkeys',
  'chart.js',
  'Chronicle',
  'focus-if',
  'mwl.confirm',
  'ngSanitize',
  'ngMessages',
  'pascalprecht.translate', // angular-translate
  'tmh.dynamicLocale', // angular-dynamic-locale
  'ui.bootstrap',
  'ui.bootstrap.datetimepicker',
  'ui.select'
]).controller('indexController', function ($interval, $injector, $rootScope, $scope, $timeout) {

  const ipc = require('electron').ipcRenderer;

  let BibiscoDbConnectionService = $injector.get('BibiscoDbConnectionService'); 
  let BibiscoPropertiesService = $injector.get('BibiscoPropertiesService'); 
  let LoggerService = $injector.get('LoggerService'); 
  let ProjectService = $injector.get('ProjectService'); 
  let NavigationService = $injector.get('NavigationService'); 
  let SupporterEditionChecker = $injector.get('SupporterEditionChecker'); 

  $scope.theme = BibiscoPropertiesService.getProperty('theme');
  if (($scope.theme === 'dark' || $scope.theme === 'darkhc' ) && SupporterEditionChecker.isTrialExpired()) {
    BibiscoPropertiesService.setProperty('theme', 'classic');
    BibiscoDbConnectionService.saveDatabase();
    $scope.theme = 'classic';
  }

  if ($scope.theme === 'classic') {
    Chart.defaults.global.defaultFontColor = '#333';
  } else if ($scope.theme === 'dark' && !SupporterEditionChecker.isTrialExpired()) {
    Chart.defaults.global.defaultFontColor = '#DDD';
  } else if ($scope.theme === 'darkhc' && !SupporterEditionChecker.isTrialExpired()) {
    Chart.defaults.global.defaultFontColor = '#FFF';
  }

  $scope.zoomLevel = BibiscoPropertiesService.getProperty('zoomLevel');
  if ($scope.zoomLevel === 100) {
    Chart.defaults.global.defaultFontSize = 12;
  } else if ($scope.zoomLevel === 115) {
    Chart.defaults.global.defaultFontSize = 14;
  } else if ($scope.zoomLevel === 130) {
    Chart.defaults.global.defaultFontSize = 16;
  }
  let font = BibiscoPropertiesService.getProperty('font');
  if (font!=='courier' && font!=='times' && font!=='arial' && SupporterEditionChecker.isTrialExpired()) {
    BibiscoPropertiesService.setProperty('font', 'courier');
    BibiscoDbConnectionService.saveDatabase();
  }

  $rootScope.$on('SWITCH_CLASSIC_THEME', function () {
    $scope.theme = 'classic';
    Chart.defaults.global.defaultFontColor = '#333';
  });

  $rootScope.$on('SWITCH_DARK_THEME', function () {
    $scope.theme = 'dark';
    Chart.defaults.global.defaultFontColor = '#DDD';
  });

  $rootScope.$on('SWITCH_DARKHC_THEME', function () {
    $scope.theme = 'darkhc';
    Chart.defaults.global.defaultFontColor = '#FFF';
  });

  $rootScope.$on('CHANGE_ZOOM_LEVEL', function (event, args) {
    $scope.zoomLevel = args.level;
    if ($scope.zoomLevel === 100) {
      Chart.defaults.global.defaultFontSize = 12;
    } else if ($scope.zoomLevel === 115) {
      Chart.defaults.global.defaultFontSize = 14;
    } else if ($scope.zoomLevel === 130) {
      Chart.defaults.global.defaultFontSize = 16;
    }
  });

  $rootScope.$on('OPEN_RICH_TEXT_EDITOR', function () {
    $rootScope.richtexteditorSearchActiveOnOpen = false;
  });

  let ContextService = $injector.get('ContextService');

  // global variables
  $rootScope.actualPath = null;
  $rootScope.bibiscoStarted = false;
  $rootScope.cursorPositionCache = new Map();
  $rootScope.dirty = false;
  $rootScope.ceSuffix = SupporterEditionChecker.isSupporter() ? '' : '_ce';
  $rootScope.ed = SupporterEditionChecker.isSupporter() ? 'se' : 'ce';
  $rootScope.exitfullscreenmessage = false;
  $rootScope.fullscreen = false;
  $rootScope.groupFilter = null;
  $rootScope.keyDownFunction = null;
  $rootScope.keyUpFunction = null;
  $rootScope.os = ContextService.getOs() === 'darwin' ? '_mac' : '';
  $rootScope.partsExpansionStatus = [];
  $rootScope.popupBoxOpen = false;
  $rootScope.previouslyFullscreen = false;
  $rootScope.previousPath = null;
  $rootScope.projectExplorerCache = new Map();
  $rootScope.readNovelDblClickChapterId = null;
  $rootScope.readNovelDblClickOffsetY = 0;
  $rootScope.richtexteditorSearchActiveOnOpen = false;
  $rootScope.searchCasesensitiveactive = false;
  $rootScope.searchOnlyscenes = false;
  $rootScope.searchWholewordactive = false;
  $rootScope.showprojectexplorer = false;
  $rootScope.text2search = null;
  $rootScope.textSelected = null;
  $rootScope.trialmessageopen = false;

  $rootScope.$on('OPEN_POPUP_BOX', function () {
    $rootScope.popupBoxOpen = true;
  });
  $rootScope.$on('CLOSE_POPUP_BOX', function () {
    $rootScope.popupBoxOpen = false;
  });

  if(SupporterEditionChecker.isTrialExpired()) {
    $timeout(function() {
      if (!$rootScope.popupBoxOpen) {
        SupporterEditionChecker.showSupporterMessage();
      }
      $interval(function() {
        if (!$rootScope.popupBoxOpen) {
          SupporterEditionChecker.showSupporterMessage();
        } 
      }, 1200000); // 20 minutes in milliseconds: 1200000
    }, 300000); // 5 minutes in milliseconds: 300000
  } 
  
  // location change success
  $rootScope.$on('$locationChangeSuccess', 
    function (event, newUrl, oldUrl) {
      $rootScope.actualPath = newUrl.split('!')[1];
      if (NavigationService.getProjectExplorerCacheEntry($rootScope.actualPath)) {
        $rootScope.showprojectexplorer = true;
      } else {
        $rootScope.showprojectexplorer = false;
      }
      if (oldUrl) {
        $rootScope.previousPath = oldUrl.split('!')[1];
      }
    });

  // keydown
  $scope.keydown = function(event) {
    if ($rootScope.keyDownFunction) {
      $rootScope.keyDownFunction(event);
    }
  };

  // keyup
  $scope.keyup = function(event) {
    if ($rootScope.keyUpFunction) {
      $rootScope.keyUpFunction(event);
    }
  };

  // closing application listenet
  ipc.on('APP_CLOSING', (event) => {
    let autoBackupOnExit = BibiscoPropertiesService.getProperty('autoBackupOnExit') === 'true';
    let projectactive = ProjectService.getProjectInfo() ? true : false;
    LoggerService.debug('Catched APP_CLOSING event! Auto backup on exit? ' + autoBackupOnExit + ' - Project active ? ' + projectactive);
    
    // if I am inside a project I make a backup
    if (projectactive && autoBackupOnExit) {
      ProjectService.executeBackupIfSomethingChanged({
        showWaitingModal: true,
        callback: function() {
          ipc.sendSync('closeApp');
        }
      });
    } else {
      ipc.sendSync('closeApp');
    }

  });
  
}).config(['$locationProvider', '$routeProvider',
  function config($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider.
      when('/analysis', {
        template: '<analysis></analysis>'
      }).
      when('/architecture', {
        template: '<architecture></architecture>'
      }).
      when('/architectureitems/:id/events', {
        template: '<architectureevents></architectureevents>'
      }).
      when('/architectureitems/:id/events/new', {
        template: '<architectureevent></architectureevent>'
      }).
      when('/architectureitems/:id/events/:eventid', {
        template: '<architectureevent></architectureevent>'
      }).
      when('/architectureitems/:id/:mode', {
        template: '<architecturedetail></architecturedetail>'
      }).
      when('/chapters', {
        template: '<chapters></chapters>'
      }).
      when('/chapters/new', {
        template: '<chaptertitle></chaptertitle>'
      }).
      when('/chapters/new/epilogue', {
        template: '<chaptertitle></chaptertitle>'
      }).
      when('/chapters/new/prologue', {
        template: '<chaptertitle></chaptertitle>'
      }).
      when('/chapters/read/:chapterid', {
        template: '<chaptersread></chaptersread>'
      }).
      when('/chapters/:id', {
        template: '<chapterdetail></chapterdetail>'
      }).
      when('/chapters/:id/title', {
        template: '<chaptertitle></chaptertitle>'
      }).
      when('/chapters/:chapterid/chapterinfos/:type/:mode', {
        template: '<chapterinfodetail></chapterinfodetail>'
      }).
      when('/chapters/:chapterid/scenes/new', {
        template: '<scenetitle></scenetitle>'
      }).
      when('/chapters/read/:chapterid/scenes/new', {
        template: '<scenetitle></scenetitle>'
      }).
      when('/chapters/:chapterid/scenes/:sceneid/move', {
        template: '<chapterselect></chapterselect>'
      }).
      when('/timeline/chapters/:chapterid/scenes/:sceneid/move', {
        template: '<chapterselect></chapterselect>'
      }).
      when('/chapters/:chapterid/scenes/:sceneid/tags', {
        template: '<scenetags></scenetags>'
      }).
      when('/chapters/:chapterid/scenes/:sceneid/tags/scenecharacters/maincharacters/new', {
        template: '<maincharactercreate></maincharactercreate>'
      }).
      when('/chapters/:chapterid/scenes/:sceneid/tags/povcharacter/maincharacters/new', {
        template: '<maincharactercreate></maincharactercreate>'
      }).
      when('/chapters/:chapterid/scenes/:sceneid/tags/scenecharacters/secondarycharacters/new', {
        template: '<secondarycharactercreate></secondarycharactercreate>'
      }).
      when('/chapters/:chapterid/scenes/:sceneid/tags/povcharacter/secondarycharacters/new', {
        template: '<secondarycharactercreate></secondarycharactercreate>'
      }).
      when('/chapters/:chapterid/scenes/:sceneid/tags/location/new', {
        template: '<locationcreate></locationcreate>'
      }).
      when('/chapters/:chapterid/scenes/:sceneid/tags/objects/new', {
        template: '<objectcreate></objectcreate>'
      }).
      when('/chapters/:chapterid/scenes/:sceneid/tags/strands/new', {
        template: '<strandcreate></strandcreate>'
      }).
      when('/timeline/chapters/:chapterid/scenes/:sceneid/tags', {
        template: '<scenetags></scenetags>'
      }).
      when('/chapters/:chapterid/scenes/:sceneid/title', {
        template: '<scenetitle></scenetitle>'
      }).
      when('/timeline/chapters/:chapterid/scenes/:sceneid/title', {
        template: '<scenetitle></scenetitle>'
      }).
      when('/chapters/:chapterid/scenes/:sceneid/:mode', {
        template: '<scenedetail></scenedetail>'
      }).
      when('/timeline/chapters/:chapterid/scenes/:sceneid/:mode', {
        template: '<scenedetail></scenedetail>'
      }).
      when('/characters', {
        template: '<characters></characters>'
      }).
      when('/createproject', {
        template: '<createproject></createproject>'
      }).
      when('/createsequel', {
        template: '<createsequel></createsequel>'
      }).
      when('/error', {
        template: '<error></error>'
      }).
      when('/export', {
        template: '<export></export>'
      }).
      when('/exporttoepub', {
        template: '<exporttoepub></exporttoepub>'
      }).
      when('/exporttoepub/images', {
        template: '<exporttoepubimages></exporttoepubimages>'
      }).
      when('/exporttoepub/images/new', {
        template: '<exporttoepubaddimage></exporttoepubaddimage>'
      }).
      when('/exporttoformat/:format', {
        template: '<exporttoformat></exporttoformat>'
      }).
      when('/exportlogs', {
        template: '<exportlogs></exportlogs>'
      }).
      when('/groups', {
        template: '<groups></groups>'
      }).
      when('/groups/new', {
        template: '<groupcreate></groupcreate>'
      }).
      when('/groups/:id/events', {
        template: '<groupevents></groupevents>'
      }).
      when('/groups/:id/events/new', {
        template: '<groupevent></groupevent>'
      }).
      when('/groups/:id/events/:eventid', {
        template: '<groupevent></groupevent>'
      }).
      when('/groups/:id/images', {
        template: '<groupimages></groupimages>'
      }).
      when('/groups/:id/images/addprofile', {
        template: '<groupaddimage></groupaddimage>'
      }).
      when('/groups/:id/images/new', {
        template: '<groupaddimage></groupaddimage>'
      }).
      when('/groups/:id/members', {
        template: '<groupmembers></groupmembers>'
      }).
      when('/groups/:id/members/maincharacters/new', {
        template: '<maincharactercreate></maincharactercreate>'
      }).
      when('/groups/:id/members/secondarycharacters/new', {
        template: '<secondarycharactercreate></secondarycharactercreate>'
      }).
      when('/groups/:id/members/location/new', {
        template: '<locationcreate></locationcreate>'
      }).
      when('/groups/:id/members/objects/new', {
        template: '<objectcreate></objectcreate>'
      }).
      when('/groups/:id/members/strands/new', {
        template: '<strandcreate></strandcreate>'
      }).
      when('/groups/:id/title', {
        template: '<grouptitle></grouptitle>'
      }).
      when('/groups/:id/color', {
        template: '<groupcolor></groupcolor>'
      }).
      when('/groups/:id/:mode', {
        template: '<groupdetail></groupdetail>'
      }).
      when('/importproject', {
        template: '<importproject></importproject>'
      }).
      when('/info', {
        template: '<info></info>'
      }).
      when('/loading', {
        template: '<loading></loading>'
      }).
      when('/locations', {
        template: '<locations></locations>'
      }).
      when('/locations/:id/events', {
        template: '<locationevents></locationevents>'
      }).
      when('/locations/:id/events/new', {
        template: '<locationevent></locationevent>'
      }).
      when('/locations/:id/events/:eventid', {
        template: '<locationevent></locationevent>'
      }).
      when('/locations/:id/groupsmembership', {
        template: '<locationgroupsmembership></locationgroupsmembership>'
      }).
      when('/locations/:id/groupsmembership/new', {
        template: '<groupcreate></groupcreate>'
      }).
      when('/locations/new', {
        template: '<locationcreate></locationcreate>'
      }).
      when('/locations/:id/images', {
        template: '<locationimages></locationimages>'
      }).
      when('/locations/:id/images/addprofile', {
        template: '<locationaddimage></locationaddimage>'
      }).
      when('/locations/:id/images/new', {
        template: '<locationaddimage></locationaddimage>'
      }).
      when('/locations/:id/title', {
        template: '<locationtitle></locationtitle>'
      }).
      when('/locations/:id/:mode', {
        template: '<locationdetail></locationdetail>'
      }).
      when('/main', {
        template: '<main></main>'
      }).
      when('/maincharacters/new', {
        template: '<maincharactercreate></maincharactercreate>'
      }).
      when('/maincharacters/:id', {
        template: '<maincharacterdetail></maincharacterdetail>'
      }).
      when('/maincharacters/:id/customquestions', {
        template: '<customquestions></customquestions>'
      }).
      when('/maincharacters/:id/customquestions/new', {
        template: '<customquestion></customquestion>'
      }).
      when('/maincharacters/:id/customquestions/:questionid', {
        template: '<customquestion></customquestion>'
      }).
      when('/maincharacters/:id/events', {
        template: '<maincharacterevents></maincharacterevents>'
      }).
      when('/maincharacters/:id/events/new', {
        template: '<maincharacterevent></maincharacterevent>'
      }).
      when('/maincharacters/:id/events/:eventid', {
        template: '<maincharacterevent></maincharacterevent>'
      }).
      when('/maincharacters/:id/groupsmembership', {
        template: '<maincharactergroupsmembership></maincharactergroupsmembership>'
      }).
      when('/maincharacters/:id/groupsmembership/new', {
        template: '<groupcreate></groupcreate>'
      }).
      when('/maincharacters/:id/infowithoutquestion/:info/:mode', {
        template: '<maincharacterinfowithoutquestion></maincharacterinfowithoutquestion>'
      }).
      when('/maincharacters/:id/infowithquestion/:info/:mode', {
        template: '<maincharacterinfowithquestion></maincharacterinfowithquestion>'
      }).
      when('/maincharacters/:id/infowithquestion/:info/edit/question/:question', {
        template: '<maincharacterinfowithquestion></maincharacterinfowithquestion>'
      }).
      when('/maincharacters/:id/images', {
        template: '<maincharacterimages></maincharacterimages>'
      }).
      when('/maincharacters/:id/images/addprofile', {
        template: '<maincharacteraddimage></maincharacteraddimage>'
      }).
      when('/maincharacters/:id/images/new', {
        template: '<maincharacteraddimage></maincharacteraddimage>'
      }).
      when('/maincharacters/:id/title', {
        template: '<maincharactertitle></maincharactertitle>'
      }).
      when('/mindmaps', {
        template: '<mindmaps></mindmaps>'
      }).
      when('/mindmaps/new', {
        template: '<mindmaptitle></mindmaptitle>'
      }).
      when('/mindmaps/:id/title', {
        template: '<mindmaptitle></mindmaptitle>'
      }).
      when('/notes', {
        template: '<notes></notes>'
      }).
      when('/notes/new', {
        template: '<notetitle></notetitle>'
      }).
      when('/notes/:id/images', {
        template: '<noteimages></noteimages>'
      }).
      when('/notes/:id/images/new', {
        template: '<noteaddimage></noteaddimage>'
      }).
      when('/notes/:id/title', {
        template: '<notetitle></notetitle>'
      }).
      when('/notes/:id/:mode', {
        template: '<notedetail></notedetail>'
      }).
      when('/objects', {
        template: '<objects></objects>'
      }).
      when('/objects/new', {
        template: '<objectcreate></objectcreate>'
      }).
      when('/objects/:id/events', {
        template: '<objectevents></objectevents>'
      }).
      when('/objects/:id/events/new', {
        template: '<objectevent></objectevent>'
      }).
      when('/objects/:id/events/:eventid', {
        template: '<objectevent></objectevent>'
      }).
      when('/objects/:id/groupsmembership', {
        template: '<objectgroupsmembership></objectgroupsmembership>'
      }).
      when('/objects/:id/groupsmembership/new', {
        template: '<groupcreate></groupcreate>'
      }).
      when('/objects/:id/images', {
        template: '<itemimages></itemimages>'
      }).
      when('/objects/:id/images/addprofile', {
        template: '<itemaddimage></itemaddimage>'
      }).
      when('/objects/:id/images/new', {
        template: '<itemaddimage></itemaddimage>'
      }).
      when('/objects/:id/title', {
        template: '<objecttitle></objecttitle>'
      }).
      when('/objects/:id/:mode', {
        template: '<itemdetail></itemdetail>'
      }).
      when('/openproject', {
        template: '<openproject></openproject>'
      }).
      when('/parts/new', {
        template: '<parttitle></parttitle>'
      }).
      when('/parts/:id', {
        template: '<parttitle></parttitle>'
      }).
      when('/tips', {
        template: '<tips></tips>'
      }).
      when('/project/goals', {
        template: '<goals></goals>'
      }).
      when('/project/author', {
        template: '<projectauthor></projectauthor>'
      }).
      when('/project/title', {
        template: '<projecttitle></projecttitle>'
      }).
      when('/project/history', {
        template: '<wordswrittenhistory></wordswrittenhistory>'
      }).
      when('/projecthome', {
        template: '<projecthome></projecthome>'
      }).
      when('/relations/:id/export', {
        template: '<relationexport></relationexport>'
      }).
      when('/relations/:id/:mode', {
        template: '<relations></relations>'
      }).
      when('/readnovel/beginning', {
        template: '<readnovel></readnovel>'
      }).
      when('/readnovel/:chapterid', {
        template: '<readnovel></readnovel>'
      }).
      when('/search', {
        template: '<globalsearch></globalsearch>'
      }).
      when('/secondarycharacters/new', {
        template: '<secondarycharactercreate></secondarycharactercreate>'
      }).
      when('/secondarycharacters/:id/events', {
        template: '<secondarycharacterevents></secondarycharacterevents>'
      }).
      when('/secondarycharacters/:id/events/new', {
        template: '<secondarycharacterevent></secondarycharacterevent>'
      }).
      when('/secondarycharacters/:id/events/:eventid', {
        template: '<secondarycharacterevent></secondarycharacterevent>'
      }).
      when('/secondarycharacters/:id/groupsmembership', {
        template: '<secondarycharactergroupsmembership></secondarycharactergroupsmembership>'
      }).
      when('/secondarycharacters/:id/groupsmembership/new', {
        template: '<groupcreate></groupcreate>'
      }).
      when('/secondarycharacters/:id/images', {
        template: '<secondarycharacterimages></secondarycharacterimages>'
      }).
      when('/secondarycharacters/:id/images/addprofile', {
        template: '<secondarycharacteraddimage></secondarycharacteraddimage>'
      }).
      when('/secondarycharacters/:id/images/new', {
        template: '<secondarycharacteraddimage></secondarycharacteraddimage>'
      }).
      when('/secondarycharacters/:id/title', {
        template: '<secondarycharactertitle></secondarycharactertitle>'
      }).
      when('/secondarycharacters/:id/:mode', {
        template: '<secondarycharacterdetail></secondarycharacterdetail>'
      }).
      when('/settings', {
        template: '<settings></settings>'
      }).
      when('/start', {
        template: '<start></start>'
      }).
      when('/exitproject', {
        template: '<start></start>'
      }).
      when('/strands/new', {
        template: '<strandcreate></strandcreate>'
      }).
      when('/strands/:id/groupsmembership', {
        template: '<strandgroupsmembership></strandgroupsmembership>'
      }).
      when('/strands/:id/groupsmembership/new', {
        template: '<groupcreate></groupcreate>'
      }).
      when('/strands/:id/title', {
        template: '<strandtitle></strandtitle>'
      }).
      when('/strands/:id/:mode', {
        template: '<stranddetail></stranddetail>'
      }).
      when('/timeline', {
        template: '<timeline></timeline>'
      }).
      when('/welcome', {
        template: '<welcome></welcome>'
      }).
      otherwise('/main');
  }
])
  .config(function($translateProvider) {

    $translateProvider
      .useStaticFilesLoader({
        prefix: 'resources/locale-', // path to translations files
        suffix: '.json' // suffix, currently- extension of the translations
      })
      .registerAvailableLanguageKeys(['cs', 'de', 'en', 'en-us',
        'es', 'fr', 'it', 'nl', 'pl', 'pt-br', 'pt-pt', 'ru', 'sl', 'sr', 'tr', 'uk'
      ], {
        'cs': 'cs',
        'de': 'de',
        'en-ca': 'en-us',
        'en_CA': 'en-us',
        'en-gb': 'en',
        'en_GB': 'en',
        'en-us': 'en-us',
        'en_US': 'en-us',
        'es': 'es',
        'fr': 'fr',
        'it': 'it',
        'nl': 'nl',
        'pl': 'pl',
        'pt-br': 'pt-br',
        'pt_BR': 'pt-br',
        'pt-pt': 'pt-pt',
        'pt_PT': 'pt-pt',
        'ru': 'ru',
        'sl': 'sl',
        'sr': 'sr',
        'tr': 'tr',
        'uk': 'uk',
        '*': 'en'
      }) // register available languages
      .determinePreferredLanguage() // is applied on first load
      .fallbackLanguage(['en']) // fallback language
      .useSanitizeValueStrategy(null) // sanitize strategy: null until 'sanitize' mode is fixed
    ;
  })
  .config(function(tmhDynamicLocaleProvider) {
    tmhDynamicLocaleProvider.localeLocationPattern(
      'lib/angular-i18n/angular-locale_{{locale}}.js');
  })
  .config(function($uibTooltipProvider) {
    $uibTooltipProvider.options({
      'appendToBody': true
    });
    $uibTooltipProvider.setTriggers({
      'mouseenter': 'mouseleave'
    });
  })
  .config(function (ChartJsProvider) {
 
    let colors = [];
    for (let i = 0; i < 100; i++) {
      colors.push.apply(colors, ['#0084D1', '#004586', '#FF420E', '#FFD320', '#579D1C', '#7E0021', '#83CAFF', '#314004', '#AECF00', '#4B1F6F', '#FF950E', '#C5000B']);
    }  

    ChartJsProvider.setOptions({
      global: {
        colors: colors
      }
    });
  })

// By default, AngularJS will catch errors and log them to
// the Console. I want to keep that behavior; however, I
// want to intercept it so that I can also log the errors
// to file for later analysis and I want to redirect to error page.
// So I have to override the $exceptionHandler
// provider and replace it with a custom one
  .factory('$exceptionHandler', ['$injector', function($injector) {

    var $location;
    var $log;
    var ContextService;
    var LoggerService;

    return function(exception, cause) {

    // Pass off the error to the default error handler
    // on the AngularJS logger. This will output the
    // error to the console (and let the application
    // keep running normally for the user).
      $log = $log || $injector.get('$log');
      $log.error.apply($log, arguments);

      // Now, we need to try and log the error using the file logger.
      LoggerService = LoggerService || $injector.get('LoggerService');
      LoggerService.error('***EXCEPTION CAUSE*** : ' + cause);
      LoggerService.error('***EXCEPTION STACKTRACE*** : ' + exception.stack);

      // Put cause and exception in application context
      ContextService = ContextService || $injector.get('ContextService');
      ContextService.setLastError({
        cause: cause,
        exception: exception
      });

      // Redirect to error page
      $location = $location || $injector.get('$location');
      $location.path('/error');
    };
  }])

  // trusted html filter
  .filter('trusted', function ($sce) { return $sce.trustAsHtml; })

// Set confirm dialog default
  .run(function(confirmationPopoverDefaults) {
    confirmationPopoverDefaults.cancelButtonType = 'default';
    confirmationPopoverDefaults.confirmButtonType = 'danger';
    confirmationPopoverDefaults.templateUrl =
    'adapters/angular-bootstrap-confirm/angular-bootstrap-confirm.html';
  });
