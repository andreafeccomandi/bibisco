// Karma configuration
// Generated on Thu Mar 19 2015 17:35:54 GMT+0000 (GMT)

var WATCH = process.argv.indexOf('--watch') > -1;
var MIN = process.argv.indexOf('--min') > -1;

var webpackConfig = {
  devtool: 'inline-source-map',
  module: {
    preLoaders: [{
      test: /.*\.js$/,
      loader: 'eslint',
      exclude: /node_modules/
    }],
    loaders: [{
      test: /\.html$/,
      loader: 'raw'
    }],
    postLoaders: [{
      test: /\.js$/,
      exclude: /(test|node_modules|ui-bootstrap-position)/,
      loader: 'istanbul-instrumenter'
    }]
  }
};

if (MIN) {
  webpackConfig.module.loaders.push({
    test: /.*src.*\.js$/,
    loaders: ['uglify', 'ng-annotate'],
    exclude: /node_modules/
  });
}

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: './',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai', 'chai-as-promised', 'sinon-chai', 'chai-things'],

    // list of files / patterns to load in the browser
    files: [
      'test/angular-bootstrap-confirm.spec.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/angular-bootstrap-confirm.spec.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    coverageReporter: {
      reporters: [{
        type: 'text-summary'
      }, {
        type: 'lcov',
        dir : 'test/coverage/',
      }]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage', 'coveralls'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: WATCH,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: !WATCH
  });
};
