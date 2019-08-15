<template>
  <v-container text-xs-center mt-5 pt-5>
    <!-- Add Post Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="primary--text">{{ $t('addPost') }}</h1>
      </v-flex>
    </v-layout>

    <!-- Error Alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error"></form-alert>
      </v-flex>
    </v-layout>

    <!-- Add Post Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-form
          ref="form"
          v-model="isFormValid"
          lazy-validation
          @submit.prevent="handleAddPost"
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

          <v-layout row>
            <v-flex xs12>
              <v-btn
                :loading="loading"
                :disabled="!isFormValid || loading"
                color="info"
                type="submit"
              >
                <span slot="loader" class="custom-loader">
                  <v-icon light>cached</v-icon>
                </span>
                {{ $t('submit') }}</v-btn
              >
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'AddPost',
  middleware: 'auth',
  data() {
    return {
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
    ...mapGetters(['loading', 'error', 'user'])
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        // add post action
        this.$store.dispatch('addPost', {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        })
        this.$router.push(this.localePath('index'))
      }
    }
  }
}
</script>
