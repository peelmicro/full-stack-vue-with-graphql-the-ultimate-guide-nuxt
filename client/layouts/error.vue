<template>
  <v-container>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink :to="localePath('index')">
      {{ $t('homePage') }}
    </NuxtLink>
  </v-container>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  data() {
    return {
      pageNotFound: this.$i18n.t('pageNotFound'),
      otherError: this.$i18n.t('otherError')
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
