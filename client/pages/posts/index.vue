<template>
  <v-container fluid grid-list-xl>
    <!-- Post Cards -->
    <v-layout v-if="infiniteScrollPosts" row wrap>
      <v-flex
        v-for="post in infiniteScrollPosts.posts"
        :key="post._id"
        xs12
        sm6
      >
        <v-card hover>
          <v-img
            :src="post.imageUrl"
            height="30vh"
            lazy
            @click.native="goToPost(post._id)"
          ></v-img>

          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline">{{ post.title }}</div>
                <span class="grey--text"
                  >{{ post.likes }} {{ $t('likes') }} -
                  {{ post.messages ? post.messages.length : 0 }}
                  {{ $t('comments') }}</span
                >
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="showPostCreator = !showPostCreator">
              <v-icon>{{
                `keyboard_arrow_${showPostCreator ? 'up' : 'down'}`
              }}</v-icon>
            </v-btn>
          </v-card-actions>

          <!-- Post Creator Tile -->
          <v-slide-y-transition>
            <v-card-text v-show="showPostCreator" class="grey lighten-4">
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="post.createdBy.avatar" />
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title class="text--primary">{{
                    post.createdBy.username
                  }}</v-list-tile-title>
                  <v-list-tile-sub-title class="font-weight-thin"
                    >{{ $t('added') }}
                    {{ $d(new Date(post.createdDate), 'short') }}
                  </v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Fetch More Button -->
    <v-layout v-if="showMoreEnabled" column>
      <v-flex xs12>
        <v-layout justify-center row>
          <v-btn color="info" @click="showMorePosts">{{
            $t('fetchMore')
          }}</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Posts',
  data() {
    return {
      pageNum: 1,
      showPostCreator: false
    }
  },
  computed: {
    ...mapGetters(['infiniteScrollPosts']),
    showMoreEnabled() {
      return this.infiniteScrollPosts && this.infiniteScrollPosts.hasMore
    }
  },
  async asyncData({ store }) {
    if (store.state.infiniteScrollPosts.posts.length === 0) {
      await store.dispatch('getInfiniteScrollPosts')
    }
  },
  // async mounted() {
  //   await this.$store.dispatch('getInfiniteScrollPosts')
  // },
  methods: {
    showMorePosts() {
      this.pageNum += 1
      this.$store.dispatch('getInfiniteScrollPosts', this.pageNum)
    },
    goToPost(postId) {
      this.$router.push(`${this.localePath('posts')}/${postId}`)
    }
  }
}
</script>
