'use strict';

const webpack = require('webpack');
const MIN = process.argv.indexOf('-p') > -1;

function getBanner() {
  const pkg = require('./bower.json');
  return `
  /**
   * ${pkg.name} - ${pkg.description}
   * @version v${pkg.version}
   * @link ${pkg.homepage}
   * @license ${pkg.license}
   */
`.trim();
}

module.exports = {
  entry: __dirname + '/src/angular-bootstrap-confirm.js',
  output: {
    path: __dirname + '/dist',
    filename: MIN ? 'angular-bootstrap-confirm.min.js' : 'angular-bootstrap-confirm.js',
    libraryTarget: 'umd',
    library: 'angularBootstrapConfirmModuleName'
  },
  externals: {
    angular: 'angular',
    'angular-sanitize': 'angular-sanitize',
    './ui-bootstrap-position': 'angular'
  },
  devtool: MIN ? 'source-map' : null,
  module: {
    preLoaders: [{
      test: /.*\.js$/,
      loader: 'eslint',
      exclude: /node_modules/
    }],
    loaders: [{
      test: /.*\.js$/,
      loader: 'ng-annotate',
      exclude: /node_modules/
    }, {
      test: /\.html$/,
      loader: 'raw'
    }]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.BannerPlugin(getBanner(), {
      raw: true,
      entryOnly: true
    })
  ]
};
