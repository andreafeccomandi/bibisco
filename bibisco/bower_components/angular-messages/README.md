# angular-messages

This repo is for distribution on `bower`. The source for this module is in the
[main AngularJS repo](https://github.com/angular/angular.js/tree/master/src/ngMessages).
Please file issues and pull requests against that repo.

## Install

Install with `bower`:

```shell
bower install angular-messages
```

Add a `<script>` to your `index.html`:

```html
<script src="/bower_components/angular-messages/angular-messages.js"></script>
```

And add `ngMessages` as a dependency for your app:

```javascript
angular.module('myApp', ['ngMessages']);
```

## Documentation

### Basics of ngMessages
After including ngMessages in your application and attach the ngMessages module to the application module as a dependency

```html
<script type="text/javascript" src="angular.js"></script>
<script type="text/javascript" src="angular-messages.js"></script>
<script type="text/javascript">
  angular.module('myApp', ['ngMessages']);
</script>
```

Build your form with ng-messages div for each input you want to add validation to.

```html
<form name="myform">
    <div class="field">
      <label for="emailAddress">Enter your email address:</label>
      <input type="email" name="emailAddress" ng-model="data.email" required />
      <div ng-messages="myform.emailAddress.$error">
        <div ng-message="required">
          You forgot to enter your email address...
        </div>
        <div ng-message="email">
          You did not enter your email address correctly...
        </div>
      </div>
    </div>
  <input type="submit" />
</form>
```

###Reusing Error Messages

Error messages can be reused within a ngMessages block by including a remote (or inline template) using the ng-message-include attribute.
```html
<!-- remote file (error-messages.html) or blick insde the page -->
<div ng-message="required">You left the field blank...</div>
<div ng-message="minlength">Your field is too short</div>
<div ng-message="maxlength">Your field is too long</div>
<div ng-message="email">Your field has an invalid email address</div>
```
Inside the form

```html
<form name="myform">
    <div class="field">
      <label for="emailAddress">Enter your email address:</label>
      <input type="email" name="emailAddress" ng-model="data.email" required />
      
       <div ng-messages="myform.emailAddress.$error"
         ng-messages-include="error-messages.html"></div>
    </div>
  <input type="submit" />
</form>
```

More info available on the
[AngularJS docs site](https://docs.angularjs.org/api/ngMessages).

## License

The MIT License

Copyright (c) 2010-2012 Google, Inc. http://angularjs.org

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