<template>
  <v-app style="background: #E3E3EE">
    <!-- Side Navbar -->
    <v-navigation-drawer v-model="sideNav" fixed app temporary>
      <v-toolbar color="accent" dark flat>
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
        <nuxt-link :to="localePath('index')" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">VueShare</h1>
        </nuxt-link>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- Side Navbar Links -->
      <v-list>
        <v-list-tile
          v-for="(item, i) in sideNavItems"
          :key="i"
          :to="localePath(item.link)"
          ripple
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            {{ item.title }}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- Horizontal Navbar -->
    <v-toolbar fixed color="primary" dark>
      <!-- App Title -->
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <nuxt-link :to="localePath('index')" tag="span" style="cursor: pointer">
          VueShare
        </nuxt-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search Input -->
      <v-text-field
        flex
        prepend-icon="search"
        color="accent"
        single-line
        hide-details
        :placeholder="$t('searchposts')"
      ></v-text-field>

      <v-spacer></v-spacer>

      <!-- Horizontal Navbar Links -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          v-for="(item, i) in horizontalNavItems"
          :key="i"
          :to="localePath(item.link)"
          flat
        >
          <v-icon class="hidden-sm-only" left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-title class="hidden-xs-only">
        <nuxt-link
          v-for="(locale, i) in showLocales"
          :key="i"
          tag="span"
          style="cursor: pointer"
          class="lang-switcher"
          :to="switchLocalePath(locale.code)"
        >
          {{ locale.name }}
        </nuxt-link>
      </v-toolbar-title>
    </v-toolbar>

    <v-content>
      <v-container class="mt-4">
        <transition name="fade">
          <nuxt />
        </transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  head() {
    return this.$nuxtI18nSeo()
  },
  data() {
    return {
      sideNav: false
    }
  },
  computed: {
    horizontalNavItems() {
      return [
        { icon: 'chat', title: this.$i18n.t('posts'), link: 'posts' },
        { icon: 'lock_open', title: this.$i18n.t('signin'), link: 'signin' },
        { icon: 'create', title: this.$i18n.t('signup'), link: 'signup' }
      ]
    },
    sideNavItems() {
      return [
        { icon: 'chat', title: this.$i18n.t('posts'), link: 'posts' },
        { icon: 'lock_open', title: this.$i18n.t('signin'), link: 'signin' },
        { icon: 'create', title: this.$i18n.t('signup'), link: 'signup' }
      ]
    },
    showLocales() {
      return this.$i18n.locales.filter(
        locale => locale.code !== this.$i18n.locale
      )
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav
    }
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
