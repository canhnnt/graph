
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import jaTranslations from './locales/ja.json';
import LanguageDetector from 'i18next-browser-languagedetector';

export default () => i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslations
    },
    ja: {
      translation: jaTranslations
    }
  },
  fallbackLng: 'en',
  detection: {
    order: ['localStorage', 'navigator'],
    lookupLocalStorage: 'locale',
  }
});
