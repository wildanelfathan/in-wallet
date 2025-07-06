import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import path from 'path';

// Initialize i18next
i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    // Backend configuration
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
    },
    
    // Language detection
    detection: {
      order: ['header', 'querystring', 'cookie'],
      lookupQuerystring: 'lng',
      lookupCookie: 'i18nextLng',
      lookupHeader: 'accept-language',
      caches: ['cookie'],
    },
    
    // Interpolation
    interpolation: {
      escapeValue: false,
    },
    
    // Supported languages
    supportedLngs: ['en', 'id', 'es'],
    
    // Preload languages
    preload: ['en', 'id', 'es'],
    
    // Namespace
    ns: ['translation'],
    defaultNS: 'translation',
  });

export default i18next;