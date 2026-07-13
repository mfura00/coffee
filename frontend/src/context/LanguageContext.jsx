import { createContext, useContext, useState, useEffect } from 'react';
import translations from './translations';

const LanguageContext = createContext();
export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] ?? translations.en?.[key] ?? key;
  };

  const tDynamic = (key, replace = {}) => {
    let s = t(key);
    for (const [k, v] of Object.entries(replace)) s = s.replace(`{${k}}`, v);
    return s;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tDynamic }}>
      {children}
    </LanguageContext.Provider>
  );
};
