import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from '../locales/en.json';
import id from '../locales/id.json';
import am from '../locales/am.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      id: {
        translation: id
      },
      am: {
        translation: am
      }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    },
    // Enable key interpolation
    keySeparator: '.',
    nsSeparator: false,
  });

export default i18n;
