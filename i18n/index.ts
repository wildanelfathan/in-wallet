import i18n from 'i18next';
import { useTranslation, withTranslation } from 'react-i18next';

import enTranslations from './locales/en.json';
import idTranslations from './locales/id.json';

const resources = {
  en: { translation: enTranslations },
  id: { translation: idTranslations }
};

i18n.init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // react already escapes values
  }
});

export { useTranslation, withTranslation };
export default i18n; 