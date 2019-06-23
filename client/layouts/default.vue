<template>
  <v-app style="background: #E3E3EE">
    <!-- Side Navbar -->
    <v-navigation-drawer v-model="sideNav" fixed app temporary>
      <v-toolbar color="accent" dark flat>
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
        <nuxt-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">VueShare</h1>
        </nuxt-link>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- Side Navbar Links -->
      <v-list>
        <v-list-tile
          v-for="(item, i) in sideNavItems"
          :key="i"
          :to="item.link"
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
        <nuxt-link to="/" tag="span" style="cursor: pointer">
          VueShare
        </nuxt-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search Input -->
      <v-text-field
        flex
        prepend-icon="search"
        placeholder="Search posts"
        color="accent"
        single-line
        hide-details
      ></v-text-field>

      <v-spacer></v-spacer>

      <!-- Horizontal Navbar Links -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          v-for="(item, i) in horizontalNavItems"
          :key="i"
          :to="item.link"
          flat
        >
          <v-icon class="hidden-sm-only" left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

export default class Layout extends Vue {
  sideNav: boolean = false

  // computed
  get horizontalNavItems() {
    return [
      { icon: 'chat', title: 'Posts', link: '/posts' },
      { icon: 'lock_open', title: 'Sign In', link: '/signin' },
      { icon: 'create', title: 'Sign Up', link: '/signup' }
    ]
  }

  get sideNavItems() {
    return [
      { icon: 'chat', title: 'Posts', link: '/posts' },
      { icon: 'lock_open', title: 'Sign In', link: '/signin' },
      { icon: 'create', title: 'Sign Up', link: '/signup' }
    ]
  }

  // methods
  toggleSideNav() {
    this.sideNav = !this.sideNav
  }
}
</script>
