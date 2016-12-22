angular.
module('bibiscoApp').
component('languageselect', {
  templateUrl: 'language-select/language-select.html',
  controller: LanguageSelectController
});


function LanguageSelectController(LocaleService) {
  console.log('Start LanguageSelectController...');
  this.currentLocale = LocaleService.getCurrentLocale();
  this.locales = LocaleService.getLocales();
  this.changeLanguage = function () {
      LocaleService.setCurrentLocale(this.currentLocale);
  };
  console.log('End LanguageSelectController...');
}
