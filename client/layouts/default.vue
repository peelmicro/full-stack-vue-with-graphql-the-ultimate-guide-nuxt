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

        <!-- Signout Button -->
        <v-list-tile v-if="user" @click="handleSignoutUser">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>{{ $t('signout') }}</v-list-tile-content>
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
        v-model="searchTerm"
        flex
        prepend-icon="search"
        color="accent"
        single-line
        hide-details
        :placeholder="$t('searchposts')"
        @input="handleSearchPosts"
      ></v-text-field>

      <!-- Search Results Card -->
      <v-card v-if="searchResults.length" id="search__card" dark>
        <v-list>
          <v-list-tile
            v-for="result in searchResults"
            :key="result._id"
            @click="goToSearchResult(result._id)"
          >
            <v-list-tile-title>
              {{ result.title }} -
              <span class="font-weight-thin">{{
                formatDescription(result.description)
              }}</span>
            </v-list-tile-title>

            <!-- Show Icon if Result Favorited by User -->
            <v-list-tile-action v-if="checkIfUserFavorite(result._id)">
              <v-icon>favorite</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>

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

      <!-- Profile Button -->
      <v-btn v-if="user" flat :to="localePath('profile')">
        <v-icon class="hidden-sm-only" left>account_box</v-icon>
        <v-badge right color="blue darken-2" :class="{ bounce: badgeAnimated }">
          <span v-if="userFavorites.length" slot="badge">{{
            userFavorites.length
          }}</span>
          {{ $t('profile') }}
        </v-badge>
      </v-btn>

      <!-- Signout Button -->
      <v-btn v-if="user" flat @click="handleSignoutUser">
        <v-icon class="hidden-sm-only" left>exit_to_app</v-icon>
        {{ $t('signout') }}
      </v-btn>

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

    <!-- App Content -->
    <main>
      <v-container class="mt-4">
        <transition name="fade">
          <nuxt />
        </transition>

        <!-- Auth Snackbar -->
        <v-snackbar
          v-model="authSnackbar"
          color="success"
          :timeout="5000"
          bottom
          left
        >
          <v-icon class="mr-3">check_circle</v-icon>
          <h3>{{ $t('yourAreNowSignedIn') }}</h3>
          <v-btn dark flat @click="authSnackbar = false">{{
            $t('close')
          }}</v-btn>
        </v-snackbar>

        <!-- Auth Error Snackbar -->
        <v-snackbar
          v-if="authError"
          v-model="authErrorSnackbar"
          color="info"
          :timeout="5000"
          bottom
          left
        >
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{ authError }}</h3>
          <v-btn dark flat :to="localePath('signin')">{{ $t('signin') }}</v-btn>
        </v-snackbar>
      </v-container>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  head() {
    return this.$nuxtI18nSeo()
  },
  data() {
    return {
      searchTerm: '',
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      badgeAnimated: false
    }
  },
  computed: {
    ...mapGetters(['searchResults', 'authError', 'user', 'userFavorites']),
    horizontalNavItems() {
      let items = [
        { icon: 'chat', title: this.$i18n.t('posts'), link: 'posts' },
        { icon: 'lock_open', title: this.$i18n.t('signin'), link: 'signin' },
        { icon: 'create', title: this.$i18n.t('signup'), link: 'signup' }
      ]
      if (this.user) {
        items = [{ icon: 'chat', title: this.$i18n.t('posts'), link: 'posts' }]
      }
      return items
    },
    sideNavItems() {
      let items = [
        { icon: 'chat', title: this.$i18n.t('posts'), link: 'posts' },
        { icon: 'lock_open', title: this.$i18n.t('signin'), link: 'signin' },
        { icon: 'create', title: this.$i18n.t('signup'), link: 'signup' }
      ]
      if (this.user) {
        items = [
          { icon: 'chat', title: this.$i18n.t('posts'), link: 'posts' },
          {
            icon: 'stars',
            title: this.$i18n.t('createPost'),
            link: 'posts-add'
          },
          {
            icon: 'account_box',
            title: this.$i18n.t('profile'),
            link: 'profile'
          }
        ]
      }
      return items
    },
    showLocales() {
      return this.$i18n.locales.filter(
        locale => locale.code !== this.$i18n.locale
      )
    }
  },
  watch: {
    user(newValue, oldValue) {
      // if we had no value for user before, show snackbar
      if (oldValue === null) {
        this.authSnackbar = true
      }
    },
    authError(value) {
      // if auth error is not null, show auth error snackbar
      if (value !== null) {
        this.authErrorSnackbar = true
      }
    },
    userFavorites(value) {
      // if user favorites value changed at all
      if (value) {
        this.badgeAnimated = true
        setTimeout(() => (this.badgeAnimated = false), 1000)
      }
    }
  },
  mounted() {
    if (this.user) {
      this.authSnackbar = true
    }
    if (this.authError !== null) {
      this.authErrorSnackbar = true
    }
  },
  methods: {
    handleSearchPosts() {
      this.$store.dispatch('searchPosts', {
        searchTerm: this.searchTerm
      })
    },
    goToSearchResult(resultId) {
      // Clear search term
      this.searchTerm = ''
      // Go to desired result
      this.$router.push(`${this.localePath('posts')}/${resultId}`)
      // Clear search results
      this.$store.commit('clearSearchResults')
    },
    formatDescription(desc) {
      return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc
    },
    checkIfUserFavorite(resultId) {
      return (
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === resultId)
      )
    },
    handleSignoutUser() {
      this.$store.dispatch('signoutUser')
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav
    }
  }
}
</script>

<style>
h1 {
  font-weight: 400;
  font-size: 2.5rem;
}

h2 {
  font-weight: 400;
  font-size: 2rem;
}
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

/* Search Results Card */
#search__card {
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}

/* User Favorite Animation */
.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
