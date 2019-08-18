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
                    {{ post.createdDate }}</v-list-tile-sub-title
                  >
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
import { infiniteScrollPosts } from '~/gql/infiniteScrollPosts.gql'

const pageSize = 2

export default {
  name: 'Posts',
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      showPostCreator: false
    }
  },
  apollo: {
    infiniteScrollPosts: {
      query: infiniteScrollPosts,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  methods: {
    showMorePosts() {
      this.pageNum += 1
      // fetch more data and transform original result
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          // pageNum incremented by 1
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore
          this.showMoreEnabled = hasMore

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              // Merge previous posts with new posts
              posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
              hasMore
            }
          }
        }
      })
    },
    goToPost(postId) {
      this.$router.push(`${this.localePath('posts')}/${postId}`)
    }
  }
}
</script>
