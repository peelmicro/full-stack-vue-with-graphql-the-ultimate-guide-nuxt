<template>
  <v-container>
    <h1>Profile</h1>
  </v-container>
</template>

<script>
export default {
  name: 'Profile',
  middleware: 'auth'
}
</script>
