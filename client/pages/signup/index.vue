<template>
  <v-container text-xs-center mt-5 pt-5>
    <!-- Signup Title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>{{ $t('getStartedHere') }}</h1>
      </v-flex>
    </v-layout>

    <!-- Error Alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error"></form-alert>
      </v-flex>
    </v-layout>

    <!-- Signup Form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="accent" dark>
          <v-container>
            <v-form
              ref="form"
              v-model="isFormValid"
              lazy-validation
              @submit.prevent="handleSignupUser"
            >
              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="username"
                    :rules="usernameRules"
                    prepend-icon="face"
                    :label="$t('username')"
                    type="text"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    prepend-icon="email"
                    :label="$t('email')"
                    type="email"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="password"
                    :rules="passwordRules"
                    prepend-icon="extension"
                    :label="$t('password')"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    v-model="passwordConfirmation"
                    :rules="passwordRules"
                    prepend-icon="gavel"
                    :label="$t('confirmPassword')"
                    type="password"
                    required
                  ></v-text-field>
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
                    {{ $t('signup') }}</v-btn
                  >
                  <h3>
                    {{ $t('alreadyHaveAnAccount') }}
                    <router-link :to="localePath('signin')">{{
                      $t('signin')
                    }}</router-link>
                  </h3>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Signup',
  data() {
    return {
      isFormValid: false,
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
      usernameRules: [
        username =>
          !!username ||
          this.$i18n.t('isRequired', { name: this.$i18n.t('username') }),
        username =>
          username.length < 10 ||
          this.$i18n.t('cannotBeMoreThanCharacters', {
            name: this.$i18n.t('username'),
            number: 10
          })
      ],
      emailRules: [
        email =>
          !!email ||
          this.$i18n.t('isRequired', { name: this.$i18n.t('email') }),
        email =>
          /.@+./.test(email) ||
          this.$i18n.t('mustBeValid', { name: this.$i18n.t('email') })
      ],
      passwordRules: [
        password =>
          !!password ||
          this.$i18n.t('isRequired', { name: this.$i18n.t('password') }),
        password =>
          password.length >= 4 ||
          this.$i18n.t('mustBeAtLeast', {
            name: this.$i18n.t('password'),
            number: 4
          }),
        confirmation =>
          confirmation === this.password || this.$i18n.t('passwordsMustMatch')
      ]
    }
  },
  computed: {
    ...mapGetters(['loading', 'error', 'user'])
  },
  watch: {
    user(value) {
      // if user value changes, redirect to home page
      if (value) {
        this.$router.push(this.localePath('index'))
      }
    }
  },
  methods: {
    handleSignupUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('signupUser', {
          username: this.username,
          email: this.email,
          password: this.password
        })
      }
    }
  }
}
</script>

<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
