import es from './lang/es-ES.js'
import en from './lang/en-US.js'
// import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@plugins/shared-components.js', '@plugins/i18n-moment.js'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    [
      'nuxt-i18n',
      {
        seo: false,
        locales: [
          {
            name: 'ESP',
            code: 'es',
            iso: 'es-ES'
          },
          {
            name: 'ENG',
            code: 'en',
            iso: 'en-US'
          }
        ],
        strategy: 'prefix_and_default',
        langDir: 'lang/',
        defaultLocale: 'es',
        vueI18n: {
          fallbackLocale: 'es',
          messages: { es, en },
          dateTimeFormats: {
            es: {
              short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              },
              long: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric'
              }
            },
            en: {
              short: {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              },
              long: {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                weekday: 'short',
                hour: 'numeric',
                minute: 'numeric'
              }
            }
          }
        }
      }
    ],
    ['@nuxtjs/moment', { locales: ['es'], defaultLocale: 'es' }],
    '@nuxtjs/vuetify',
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
    '@nuxtjs/apollo',
    `cookie-universal-nuxt`
  ],
  apollo: {
    authenticationType: '',
    errorHandler: '~/apollo/customErrorHandler.js',
    clientConfigs: {
      default: {
        httpEndpoint:
          process.env.HTTP_ENDPOINT || 'http://localhost:4000/graphql'
      }
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    theme: {
      // primary: colors.blue.darken2,
      // accent: colors.grey.darken3,
      // secondary: colors.amber.darken3,
      // info: colors.teal.lighten1,
      // warning: colors.amber.base,
      // error: colors.deepOrange.accent4,
      // success: colors.green.accent3
      primary: '#3B125F',
      secondary: '#8B5FBF',
      accent: '#BF653F',
      error: '#722530',
      warning: '#A37513',
      info: '#396893',
      success: '#4caf50'
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {}
  }
}
