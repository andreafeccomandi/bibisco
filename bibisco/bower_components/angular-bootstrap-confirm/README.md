# Angular bootstrap confirm
[![Build Status](https://travis-ci.org/mattlewis92/angular-bootstrap-confirm.svg?branch=master)](https://travis-ci.org/mattlewis92/angular-bootstrap-confirm)
[![Coverage Status](https://coveralls.io/repos/mattlewis92/angular-bootstrap-confirm/badge.svg)](https://coveralls.io/r/mattlewis92/angular-bootstrap-confirm)
[![npm version](https://badge.fury.io/js/angular-bootstrap-confirm.svg)](https://badge.fury.io/js/angular-bootstrap-confirm)
[![Bower version](https://badge.fury.io/bo/angular-bootstrap-confirm.svg)](http://badge.fury.io/bo/angular-bootstrap-confirm)
[![devDependency Status](https://david-dm.org/mattlewis92/angular-bootstrap-confirm/dev-status.svg)](https://david-dm.org/mattlewis92/angular-bootstrap-confirm?type=dev)
[![Codacy Badge](https://www.codacy.com/project/badge/f00fe7fdcfa04a38a31750bec12e142d)](https://www.codacy.com/app/matt-lewis-private/angular-bootstrap-confirm)
[![GitHub issues](https://img.shields.io/github/issues/mattlewis92/angular-bootstrap-confirm.svg)](https://github.com/mattlewis92/angular-bootstrap-confirm/issues)
[![GitHub stars](https://img.shields.io/github/stars/mattlewis92/angular-bootstrap-confirm.svg)](https://github.com/mattlewis92/angular-bootstrap-confirm/stargazers)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/mattlewis92/angular-bootstrap-confirm/master/LICENSE)

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Demo](#demo)
- [Development](#development)
- [License](#licence)

## About

A simple angular directive to display a bootstrap styled confirmation popover when an element is clicked.

Pull requests are welcome.

[Angular2 version](https://github.com/mattlewis92/angular2-bootstrap-confirm)

## Installation

This module has a few dependencies, and must be included BEFORE the plugin files:

* [AngularJS](https://angularjs.org/) 1.3+
* Angular sanitize
* [Bootstrap](http://getbootstrap.com/) 3+ (CSS only - optional if you use a custom template)
* [ui-bootstrap](http://angular-ui.github.io/bootstrap/) (Only the $uibPosition service is required. If you don't want to include the entire ui-bootstrap library the position service is included as a standalone file in this repo in src/ui-bootstrap-position.js)

You can install through bower:

```
bower install --save angular-bootstrap-confirm
```

You will then need to include the JS files for the plugin:

```
<script src="bower_components/angular-bootstrap-confirm/dist/angular-bootstrap-confirm.js"></script>
```

And finally add the module dependency in your AngularJS app:

```javascript
angular.module('myModule', ['mwl.confirm']);
```

Alternatively you can install through npm:
```
npm install --save angular-bootstrap-confirm
```

Then add as a dependency to your app:

```javascript
// Either require('angular-bootstrap-confirm/src/ui-bootstrap-position') OR require('angular-ui-bootstrap') first!
angular.module('myApp', [require('angular-bootstrap-confirm')]);
```

## Documentation

### mwl-confirm directive

There is a single directive exposed to create the confirmation popover, use it like so:
```javascript
<button
  class="btn btn-default"
  mwl-confirm
  title="{{ title }}"
  message="{{ message }}"
  confirm-text="{{ confirmText }}"
  cancel-text="{{ cancelText }}"
  placement="{{ placement }}"
  on-confirm="confirmClicked = true"
  on-cancel="cancelClicked = true"
  confirm-button-type="danger"
  cancel-button-type="default">
  Click me!
</button>
```

An explanation of the properties is as follows:

#### title
The title of the popover. This value is interpolated. Note, if you use an expression, you may want to consider using "data-title" instead of "title" so that the browser doesn't show native tooltips with the angular expression listed.

#### message
The body text of the popover. This value is interpolated.

#### confirm-text
The text of the confirm button. This value is interpolated. Default "Confirm"

#### cancel-text
The text of the cancel button. This value is interpolated. Default "Cancel"

#### placement
The placement of the popover. This value is interpolated. It can be either "top", "right", "bottom" or "left". Default "top"

#### on-confirm
An angular expression that is called when the confirm button is clicked.

#### on-cancel
An angular expression that is called when the cancel button is clicked.

#### confirm-button-type
The bootstrap button type of the confirm button. This value is interpolated. It can be any supported bootstrap color type e.g. default, warning, danger etc. Default "success"

#### cancel-button-type
The bootstrap button type of the cancel button. This value is interpolated. It can be any supported bootstrap color type e.g. default, warning, danger etc. Default "default"

#### is-open
A 2-way bound variable to control if the popover is currently open or not.

#### focus-button
Set to either `confirm` or `cancel` to focus the confirm or cancel button. If omitted, by default it will not focus either button.

#### is-disabled
Whether to disable showing the popover. Default `false`.

#### template-url
A custom popover template. Useful for if you're not using bootstrap. It can be configured globally by setting `confirmationPopoverDefaults.templateUrl`

#### hide-confirm-button
When set will hide the confirm button.

#### hide-cancel-button
When set will hide the cancel button.

#### popover-class
A CSS class that will be set on the popover that is opened.

#### animation
Whether to animate the popover as it fades in and out. Default `false`.

### confirmationPopoverDefaults
There is also a value you can use to set the defaults like so:
```javascript
angular.module('myModule').run(function(confirmationPopoverDefaults) {
  console.log(confirmationPopoverDefaults); // View all the defaults you can change
  confirmationPopoverDefaults.confirmButtonType = 'danger'; // Set the default confirm button type to be danger
});
```

## Demo

http://mattlewis92.github.io/angular-bootstrap-confirm/

## Development

### Prepare your environment
* Install [Node.js](http://nodejs.org/) and NPM (should come with)
* Install local dev dependencies: `npm install` while current directory is this repo

### Development server
Run `npm start` to start a development server on port 8000 with auto reload + tests. 

### Testing
Run `npm test` to run tests once or `npm run test:watch` to continually run tests (this is automatic when you do `npm start`). 

### Build
Run `npm run build` to build the project files in the dist folder

## License

The MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
