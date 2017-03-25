<a name="2.5.0"></a>
# [2.5.0](https://github.com/mattlewis92/angular-bootstrap-confirm/compare/2.4.1...v2.5.0) (2016-11-20)


### Features

* **animation:** add animation support ([5229a30](https://github.com/mattlewis92/angular-bootstrap-confirm/commit/5229a30)), closes [#32](https://github.com/mattlewis92/angular-bootstrap-confirm/issues/32)



<a name="2.4.1"></a>
## [2.4.1](https://github.com/mattlewis92/angular-bootstrap-confirm/compare/2.4.0...v2.4.1) (2016-10-05)


### Bug Fixes

* ensure the popover is always destroyed after its loaded ([1f4e81d](https://github.com/mattlewis92/angular-bootstrap-confirm/commit/1f4e81d)), closes [#31](https://github.com/mattlewis92/angular-bootstrap-confirm/issues/31)
* remove dependency on bootstrap ([76cff9c](https://github.com/mattlewis92/angular-bootstrap-confirm/commit/76cff9c)), closes [#30](https://github.com/mattlewis92/angular-bootstrap-confirm/issues/30)



<a name="2.4.0"></a>
# [2.4.0](https://github.com/mattlewis92/angular-bootstrap-confirm/compare/2.3.0...v2.4.0) (2016-09-25)


### Features

* **customTemplate:** allow passing local values to the confirm and cancel outputs ([b3e650c](https://github.com/mattlewis92/angular-bootstrap-confirm/commit/b3e650c))



<a name="2.3.0"></a>
# [2.3.0](https://github.com/mattlewis92/angular-bootstrap-confirm/compare/2.2.0...v2.3.0) (2016-06-15)


### Features

* **bootstrap4:** add bootstrap 4 popover classes ([4557217](https://github.com/mattlewis92/angular-bootstrap-confirm/commit/4557217))
* **popoverClass:** allow a custom CSS class to be set on the popover ([6863067](https://github.com/mattlewis92/angular-bootstrap-confirm/commit/6863067)), closes [#25](https://github.com/mattlewis92/angular-bootstrap-confirm/issues/25)



<a name="2.2.0"></a>
# [2.2.0](https://github.com/mattlewis92/angular-bootstrap-confirm/compare/2.1.0...v2.2.0) (2016-06-08)


### Features

* **isOpen:** warn the user when attempting to assign the value to a boolean value ([3243b8f](https://github.com/mattlewis92/angular-bootstrap-confirm/commit/3243b8f)), closes [#24](https://github.com/mattlewis92/angular-bootstrap-confirm/issues/24)



<a name="2.1.0"></a>
# [2.1.0](https://github.com/mattlewis92/angular-bootstrap-confirm/compare/2.0.0...v2.1.0) (2016-05-06)


### Features

* **buttons:** allow the confirm or cancel buttons to be hidden ([975f053](https://github.com/mattlewis92/angular-bootstrap-confirm/commit/975f053)), closes [#22](https://github.com/mattlewis92/angular-bootstrap-confirm/issues/22)



<a name="2.0.0"></a>
# [2.0.0](https://github.com/mattlewis92/angular-bootstrap-confirm/compare/1.0.1...v2.0.0) (2016-05-01)


### Features

* **focusButton:** allow either the confirm or cancel button to be focused when the popover is open ([a1328a7](https://github.com/mattlewis92/angular-bootstrap-confirm/commit/a1328a7)), closes [#20](https://github.com/mattlewis92/angular-bootstrap-confirm/issues/20)
* **isolateScope:** the directive no longer requires an isolate scope ([72ce933](https://github.com/mattlewis92/angular-bootstrap-confirm/commit/72ce933))


### BREAKING CHANGES

* focusButton: `focus-confirm-button` has been removed and replaced with `focus-button`

Now by default neither button will be focused, compared to previously where the confirm button would always be focused.

Before:
```
<button mwl-confirm focus-confirm-button="true"></button>
```

After:
```
<button mwl-confirm focus-button="confirm"></button>
```

Can also be configured globally with setting the `focusButton` property of the `confirmationPopoverDefaults` to either `confirm` or `cancel` like so:

```
.run(function(confirmationPopoverDefaults) {
  confirmationPopoverDefaults.focusButton = 'confirm'; // restore the old behaviour in 1.x
});
```
* isolateScope: The directive will only function as an attribute directive and not an element
directive. This was undocumented so shouldn't affect any apps

The template has also changed, so if you were using a custom template then you will need to update it.



<a name="1.0.1"></a>
## [1.0.1](https://github.com/mattlewis92/angular-bootstrap-confirm/compare/1.0.0...v1.0.1) (2016-04-20)


### Bug Fixes

* mark `focusConfirmButton` and `isDisabled` as optional ([7c3dc30](https://github.com/mattlewis92/angular-bootstrap-confirm/commit/7c3dc30))
* **isOpen:** only update `isOpen` when the popover visibility is actually changed ([6d78209](https://github.com/mattlewis92/angular-bootstrap-confirm/commit/6d78209)), closes [#18](https://github.com/mattlewis92/angular-bootstrap-confirm/issues/18)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/mattlewis92/angular-bootstrap-confirm/compare/0.7.0...v1.0.0) (2015-12-16)


### Features

* Stable API!
* **focus-confirm-button:** Rename handle-focus option to focus-confirm-button ([6455cc2](https://github.com/mattlewis92/angular-bootstrap-confirm/commit/6455cc2))

### BREAKING CHANGES

* focus-confirm-button: The handle-focus directive option has been renamed to focus-confirm-button.

confirmationPopoverDefaults.handleFocus has been renamed to confirmationPopoverDefaults.focusConfirmButton



<a name="0.7.0"></a>
# [0.7.0](https://github.com/mattlewis92/angular-bootstrap-confirm/compare/0.7.0...v0.6.0) (2015-11-16)
* Add an `is-disabled` attribute for disabling the popover.

# 0.6.0 (2015-11-05)
* Allow the default popover template to be changed either globally in the `confirmationPopoverDefaults.templateUrl` property or by passing a `template-url` property to the popover.
* Expose the popover element on the controller so other directives can access it

# 0.5.2 (2015-10-24)
* Don't leak the module name characters into the global space

# 0.5.1 (2015-10-09)
* Support ui-bootstrap 0.14.0 onwards

# 0.5.0 (2015-10-06)
* BREAKING (for npm users only): Use dist files when installing through npm. You will now need to require the `angular-bootstrap-confirm/src/ui-bootstrap-position` file or the full `angular-ui-bootstrap` module first (See the readme for an example)

# 0.4.2 (2015-10-04)
* Ignore bower source files

# 0.4.1 (2015-10-02)
* Allow handle-focus to be set to false if set as an attribute.

# 0.4.0 (2015-09-28)
* Auto focus the confirm button when opening the popover. Thanks to @andreptb! 

# 0.3.1 (2015-08-29)
* Make `is-open` optional for angular 1.3 compatibility

# 0.3.0 (2015-07-28)
* Add is-open property to control the visibility of the popover

# 0.2.0 (2015-07-12)
* BREAKING: Replace the confirmationPopover provider with a much simpler confirmationPopoverDefaults value
* Remove the off click dependency
* Build with webpack and publish to npm

# 0.1.1 (2015-06-22)
* Mark angular sanitize as a dependency and not a dev dependency
* Ensure angular 1.4 compatibility

# 0.1.0 (2015-05-09)
_Very first, initial release_
