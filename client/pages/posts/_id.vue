<template>
  <v-container v-if="getPost" class="mt-3" flexbox center>
    <!-- Post Card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{ getPost.title }}</h1>
            <v-btn v-if="user" large icon>
              <v-icon large color="grey">favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">
              {{ getPost.likes }} {{ $t('likes').toUpperCase() }}
            </h3>
            <v-spacer></v-spacer>
            <v-icon color="info" large @click="goToPreviousPage"
              >arrow_back</v-icon
            >
          </v-card-title>

          <v-tooltip right>
            <span>{{ $t('clickToEnlargeImage') }}</span>
            <v-img
              id="post__image"
              slot="activator"
              :src="getPost.imageUrl"
              @click="toggleImageDialog"
            ></v-img>
          </v-tooltip>

          <!-- Post Image Dialog -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="80vh"></v-img>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="mb-3" color="accent" text-color="white">{{
                category
              }}</v-chip>
            </span>
            <h3>{{ getPost.description }}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Messages Section -->
    <div class="mt-3">
      <!-- Message Input -->
      <v-layout v-if="user" class="mb-3">
        <v-flex xs12>
          <v-form
            ref="form"
            v-model="isFormValid"
            lazy-validation
            @submit.prevent="handleAddPostMessage"
          >
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  v-model="messageBody"
                  :rules="messageRules"
                  clearable
                  :append-outer-icon="messageBody && 'send'"
                  :label="$t('addMessage')"
                  type="text"
                  prepend-icon="email"
                  required
                  @click:append-outer="handleAddPostMessage"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Messages -->
      <v-layout row wrap>
        <v-flex xs12>
          <v-list subheader two-line>
            <v-subheader
              >{{ $tc('message', 2) }} ({{
                getPost.messages.length
              }})</v-subheader
            >

            <template v-for="message in getPost.messages">
              <v-divider :key="message._id"></v-divider>

              <v-list-tile :key="message.title" avatar inset>
                <v-list-tile-avatar>
                  <img :src="message.messageUser.avatar" />
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title>
                    {{ message.messageBody }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title>
                    {{ message.messageUser.username }}
                    <span class="grey--text text--lighten-1 hidden-xs-only">{{
                      message.messageDate
                    }}</span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action class="hidden-xs-only">
                  <v-icon
                    :color="checkIfOwnMessage(message) ? 'accent' : 'grey'"
                    >chat_bubble</v-icon
                  >
                </v-list-tile-action>
              </v-list-tile>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>
<script>
import { mapGetters } from 'vuex'
import { getPost } from '~/gql/getPost.gql'
import { addPostMessage } from '~/gql/addPostMessage.gql'
import utils from '~/helpers/utils'

export default {
  name: 'Post',
  validate({ params }) {
    return utils.isValidObjectID(params.id)
  },
  data() {
    return {
      postId: this.$route.params.id,
      dialog: false,
      messageBody: '',
      isFormValid: true,
      messageRules: [
        message =>
          !!message ||
          this.$i18n.t('isRequired', { name: this.$i18n.tc('message', 1) }),
        message =>
          (message && message.length <= 75) ||
          this.$i18n.t('cannotBeMoreThanCharacters', {
            name: this.$i18n.tc('message', 1),
            number: 75
          })
      ]
    }
  },
  apollo: {
    getPost: {
      query: getPost,
      variables() {
        return {
          postId: this.postId
        }
      }
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  methods: {
    handleAddPostMessage() {
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          postId: this.postId
        }
        this.$apollo
          .mutate({
            mutation: addPostMessage,
            variables,
            update: (cache, { data: { addPostMessage } }) => {
              const data = cache.readQuery({
                query: getPost,
                variables: { postId: this.postId }
              })
              data.getPost.messages.unshift(addPostMessage)
              cache.writeQuery({
                query: getPost,
                variables: { postId: this.postId },
                data
              })
            }
          })
          .then(({ data }) => {
            this.$refs.form.reset()
            console.log(data.addPostMessage)
          })
          .catch(err => console.error(err))
      }
    },
    goToPreviousPage() {
      this.$router.go(-1)
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialogs
      }
    },
    checkIfOwnMessage(message) {
      return this.user && this.user._id === message.messageUser._id
    }
  }
}
</script>

<style scoped>
#post__image {
  height: 400px !important;
}
</style>
