## Changelog

### v0.4.1
* Add helper classes .is-single-line, .is-double-line, .has-shadow, .has-shadow-hovered, .is-clickable, .is-disabled 
* Add .section.is-fit class
* Add .section.has-background class
* Change .section.is-short to has small vertical gap

### v0.4.0
* Upgrade to Angular 6, Rxjs 6
* Fix: IE has no break-word
* Fix: too long text on modal card title should display dot dot dot
* Add: support popup message newline character
* Add: Api client - allow to send body in delete() as optional
* Add: ApiClientModule - allow to use custom AuthService class
* Add: provide AuthServiceInterface for implement custom AuthService class

### v0.3.0
* Remove: .container-fluid class
* Remove: bulma fix for .icon, .icon + span, .icon ~ span
* Remove: .has-text-bold use bulma standard .has-text-weight-bold instead
* Add: .icon-em class
* Add: .box-detail class
* Add: .section.is-short class
* Add: .has-text-size-{xxx} class
* Add: .has-text-light, .has-text-strong class
* Add: non-responsive sass file
* Change: container width calculation to support veritical scrollbar width
* Change: default responsive breakpoint
* Change: .is-margin-xxx helper from 2rem to 1.5rem
* Fix: textarea style for IE

### v0.2.3
* Fix: body zoom out when small screen

### v0.2.2
* Add: option to custom confirmDelete's message
* Fix: checkbox disabled=false style
* Fix: file-model validation

### v0.2.1
* Override Bulma function
* Add: `$color-invert-to-dark` and `$color-invert-to-light` for setting color returned from findColorInvert()
* Add: style to support angular2-dropdown-multiselect

### v0.2.0
* Remove: AuthHelperService
* Add: authAdditionalData to ApiClientConfig
* Add: Export ModalComponent

### v0.1.0
* Create lib based on robisim74/angular-library-starter (Nov 2, 2017)
