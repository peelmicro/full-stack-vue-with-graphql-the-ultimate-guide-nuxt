export default function({ app }) {
  app.i18n.beforeLanguageSwitch = (_oldLocale, newLocale) => {
    app.$moment.locale(newLocale)
  }
}
