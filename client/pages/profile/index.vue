<template>
  <v-container class="text-xs-center">
    <!-- User Details Card -->
    <v-flex sm6 offset-sm3>
      <v-card class="white--text" color="secondary">
        <v-layout>
          <v-flex xs5>
            <v-img height="125px" contain :src="user.avatar"></v-img>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{ user.username }}</div>
                <div>{{ $t('joined') }} {{ user.joinDate }}</div>
                <div class="hidden-xs-only font-weight-thin">
                  {{ user.favorites.length }} {{ $t('favorites') }}
                </div>
                <div class="hidden-xs-only font-weight-thin">
                  {{ userPosts.length }} {{ $t('postsAdded') }}
                </div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- Posts Favorited by User -->
    <v-container v-if="!userFavorites.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>{{ $t('noFavoritesCurrently') }} {{ $t('goAndAddSome') }}</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container v-else class="mt-3">
      <v-flex xs12>
        <h2 class="font-weight-light">
          {{ $t('favorited') }}
          <span class="font-weight-regular">({{ userFavorites.length }})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex v-for="favorite in userFavorites" :key="favorite._id" sm6 xs12>
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-img height="30vh" :src="favorite.imageUrl"></v-img>
            <v-card-text>{{ favorite.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Posts Created By user -->
    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>{{ $t('noPostCurrently') }} {{ $t('goAndAddSome') }}</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container v-else class="mt-3">
      <v-flex xs12>
        <h2 class="font-weight-light">
          {{ $t('yourPosts') }}
          <span class="font-weight-regular">({{ userPosts.length }})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex v-for="post in userPosts" :key="post._id" sm6 xs12>
          <v-card class="mt-3 ml-1 mr-2" hover>
            <v-btn color="info" floating fab small dark @click="loadPost(post)">
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn
              color="error"
              floating
              fab
              small
              dark
              @click="handleDeleteUserPost(post)"
            >
              <v-icon>delete</v-icon>
            </v-btn>

            <v-img height="30vh" :src="post.imageUrl"></v-img>
            <v-card-text>{{ post.title }}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- Edit Post Dialog -->
    <v-dialog v-model="editPostDialog" xs12 sm6 offset-sm3 persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2">{{
          $t('updatePost')
        }}</v-card-title>
        <v-container>
          <v-form
            ref="form"
            v-model="isFormValid"
            lazy-validation
            @submit.prevent="handleUpdateUserPost"
          >
            <!-- Title Input -->
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  v-model="title"
                  :rules="titleRules"
                  :label="$t('postTitle')"
                  type="text"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Image Url Input -->
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  v-model="imageUrl"
                  :rules="imageRules"
                  :label="$t('imageUrl')"
                  type="text"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>

            <!-- Image Preview -->
            <v-layout row>
              <v-flex xs12>
                <img :src="imageUrl" height="300px" />
              </v-flex>
            </v-layout>

            <!-- Categories Select -->
            <v-layout row>
              <v-flex xs12>
                <v-select
                  v-model="categories"
                  :rules="categoriesRules"
                  item-text="text"
                  item-value="value"
                  :items="categoryItems"
                  multiple
                  :label="$tc('category', 2)"
                ></v-select>
              </v-flex>
            </v-layout>

            <!-- Description Text Area -->
            <v-layout row>
              <v-flex xs12>
                <v-textarea
                  v-model="description"
                  :rules="descRules"
                  :label="$t('description')"
                  type="text"
                  required
                ></v-textarea>
              </v-flex>
            </v-layout>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :disabled="!isFormValid"
                type="submit"
                class="success--text"
                flat
                >{{ $t('update') }}</v-btn
              >
              <v-btn class="error--text" flat @click="editPostDialog = false">{{
                $t('cancel')
              }}</v-btn>
            </v-card-actions>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  middleware: 'auth',
  data() {
    return {
      editPostDialog: false,
      isFormValid: true,
      title: '',
      imageUrl: '',
      categories: [],
      categoryItems: [
        { value: 'Art', text: this.$i18n.t('categoryItems.art') },
        { value: 'Education', text: this.$i18n.t('categoryItems.education') },
        { value: 'Food', text: this.$i18n.t('categoryItems.food') },
        { value: 'Furniture', text: this.$i18n.t('categoryItems.furniture') },
        { value: 'Travel', text: this.$i18n.t('categoryItems.travel') },
        {
          value: 'Photography',
          text: this.$i18n.t('categoryItems.photography')
        },
        {
          value: 'Technology',
          text: this.$i18n.t('categoryItems.technology')
        }
      ],
      description: '',
      titleRules: [
        title =>
          !!title ||
          this.$i18n.t('isRequired', { name: this.$i18n.t('postTitle') }),
        title =>
          title.length <= 20 ||
          this.$i18n.t('cannotBeMoreThanCharacters', {
            name: this.$i18n.t('postTitle'),
            number: 20
          })
      ],
      imageRules: [
        image =>
          !!image ||
          this.$i18n.t('isRequired', { name: this.$i18n.t('imageUrl') })
      ],
      categoriesRules: [
        categories =>
          categories.length >= 1 ||
          this.$i18n.t('isRequired', {
            name: `${this.$i18n.t('atLeastOne')} ${this.$i18n.tc(
              'category',
              1
            )}`
          })
      ],
      descRules: [
        desc =>
          !!desc ||
          this.$i18n.t('isRequired', { name: this.$i18n.t('description') }),
        desc =>
          desc.length <= 200 ||
          this.$i18n.t('cannotBeMoreThanCharacters', {
            name: this.$i18n.t('description'),
            number: 200
          })
      ]
    }
  },
  computed: {
    ...mapGetters(['user', 'userFavorites', 'userPosts'])
  },
  created() {
    this.handleGetUserPosts()
  },
  methods: {
    handleGetUserPosts() {
      this.$store.dispatch('getUserPosts', {
        userId: this.user._id
      })
    },
    handleUpdateUserPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('updateUserPost', {
          postId: this.postId,
          userId: this.user._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
        })
        this.editPostDialog = false
      }
    },
    handleDeleteUserPost(post) {
      this.loadPost(post, false)
      const deletePost = window.confirm(this.$i18n.t('sureDeleteThisPost'))
      if (deletePost) {
        this.$store.dispatch('deleteUserPost', {
          postId: this.postId
        })
      }
    },
    loadPost(
      { _id, title, imageUrl, categories, description },
      editPostDialog = true
    ) {
      this.editPostDialog = editPostDialog
      this.postId = _id
      this.title = title
      this.imageUrl = imageUrl
      this.categories = categories
      this.description = description
    }
  }
}
</script>
