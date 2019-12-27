import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import translationsObject from 'langs/index';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: translationsObject, // được định nghĩa ở lang/vi.jsx
    lng: window.config.LANG,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n
export {
  i18n as I18n
}
