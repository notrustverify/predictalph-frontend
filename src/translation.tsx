import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import frTranslation from './translation/fr.json';
import enTranslation from './translation/en.json';

const userLanguage = navigator.language.split('-')[0];

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation
            },
            fr: {
                translation: frTranslation
            }
        },
        lng: userLanguage , // Langue par défaut
        fallbackLng: 'en', // Langue de secours si la langue demandée n'est pas disponible
        interpolation: {
            escapeValue: false // Ne pas échapper les valeurs HTML dans les traductions
        }
    });

export default i18n;
