## Changelog

### v0.5.0
* Upgrade to Angular 6.1, Typescript 2.9

Change ApiClientService as following
* Remove body params from delete$()
* Remove getOption param from get$()
* Change readHeaderResponse boolean param to headerResponse object param as optional to receive header response to itself
* Change required forward slash in request url e.g. `this.apiClientService.get('/posts')`

Change AuthService as following
* Re implement AuthService
* Rename `login$()` to `requestTokenWithPasswordFlow$()`
* Add remember_me option

Others:
* Add `[hideBackdrop]` in busyState directive
* Add Storage configs to set temporary and persistent storage `usePersistentAsDefault`, `persistentStorage`, `temporaryStorage`
* Add Popup params `agreeText`, `disagreeText`, `isAgreeFirst`

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
