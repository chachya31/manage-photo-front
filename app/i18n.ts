/* eslint-disable spellcheck/spell-checker */
import i18n from "i18next"
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from "react-i18next"

import ja from './locales/ja.json'
import ko from './locales/ko.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: ja },
      ko: { translation: ko }
    },
    fallbackLng: "ja",
    interpolation: { escapeValue: false },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'], // 言語の検出順序
      caches: ['localStorage', 'cookie'], // 言語を保存する場所
    }
  })

export default i18n