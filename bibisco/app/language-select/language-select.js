angular.
module('bibiscoApp').
component('languageselect', {
  templateUrl: 'language-select/language-select.html',
  controller: LanguageSelectController
});


function LanguageSelectController(LocaleService) {
  console.log('Start LanguageSelectController...');
  this.currentLocaleDisplayName = LocaleService.getLocaleDisplayName();
  this.localesDisplayNames = LocaleService.getLocalesDisplayNames();
  this.locales = LocaleService.getLocales();
  this.visible = this.localesDisplayNames &&
  this.localesDisplayNames.length > 1;
  this.changeLanguage = function (locale) {
      LocaleService.setLocaleByDisplayName(locale);
  };
  console.log('End LanguageSelectController...');
}
