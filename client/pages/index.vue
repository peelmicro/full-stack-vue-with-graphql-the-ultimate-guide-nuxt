<template>
  <v-container v-if="getPosts" text-xs-center>
    <v-flex xs12>
      <v-carousel v-bind="{ cycle: true }" interval="3000">
        <v-carousel-item
          v-for="post in getPosts"
          :key="post._id"
          :src="post.imageUrl"
        >
          <h1 id="carousel__title">{{ post.title }}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
import { getPosts } from '~/gql/getPosts.gql'
export default {
  name: 'Home',
  apollo: {
    getPosts: {
      query: getPosts
    }
  }
}
</script>

<style>
#carousel__title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 5px 5px 0 0;
  padding: 0.5em;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
}
</style>
