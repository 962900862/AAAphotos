module.exports = {
  entry: ['app'],
  exclude: [],
  output: ['app'],
  disableAutoTranslate: true,
  extractOnly: false,
  translator: null,
  ignoreComponents: [],
  ignoreMethods: [],
  primaryLocale: 'zh-CN',
  supportedLocales: ['zh-CN', 'en-US'],
  importCode: "import { intl } from 'di18n-react';",
  i18nObject: 'intl',
  i18nMethod: 't',
  prettier: { singleQuote: true, trailingComma: 'es5', endOfLine: 'lf', parser: 'typescript' },
  localeConf: { type: 'file', folder: 'locales' },
};
