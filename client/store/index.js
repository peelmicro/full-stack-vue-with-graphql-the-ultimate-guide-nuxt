import { getPosts } from '~/gql/getPosts.gql'
import { searchPosts } from '~/gql/searchPosts.gql'
import { getCurrentUser } from '~/gql/getCurrentUser.gql'
import { signinUser } from '~/gql/signinUser.gql'
import { signupUser } from '~/gql/signupUser.gql'
import { addPost } from '~/gql/addPost.gql'
import utils from '~/helpers/utils'

export const state = () => ({
  posts: [],
  searchResults: [],
  user: null,
  loading: false,
  error: null,
  authError: null
})
export const mutations = {
  setPosts: (state, payload) => {
    state.posts = payload
  },
  setSearchResults: (state, payload) => {
    if (payload !== null && payload.length > 0) {
      state.searchResults = payload
    }
  },
  addPost: (state, payload) => {
    const posts = state.posts
    posts.unshift(payload)
    state.posts = posts
  },
  setUser: (state, payload) => {
    state.user = payload
  },
  setLoading: (state, payload) => {
    state.loading = payload
  },
  clearUser: state => (state.user = null),
  setError: (state, payload) => {
    state.error = payload
  },
  clearError: state => (state.error = null),
  setAuthError: (state, payload) => {
    state.authError = payload
  },
  clearAuthError: state => (state.authError = null),
  clearSearchResults: state => (state.searchResults = [])
}
export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('getCurrentUser')
    await dispatch('getPosts')
  },
  async getPosts({ commit }) {
    commit('clearError')
    commit('setLoading', true)
    try {
      const result = await this.app.apolloProvider.defaultClient.query({
        query: getPosts
      })
      commit('setPosts', result.data.getPosts)
    } catch (error) {
      const currentError = utils.getCurrentGraphQLError(error)
      commit('setError', currentError)
      console.error(utils.getFirstGraphQLError(error))
    }
    commit('setLoading', false)
  },
  async searchPosts({ commit }, payload) {
    commit('clearError')
    // commit('setLoading', true)
    try {
      const result = await this.app.apolloProvider.defaultClient.query({
        query: searchPosts,
        variables: payload
      })
      commit('setSearchResults', result.data.searchPosts)
    } catch (error) {
      const currentError = utils.getCurrentGraphQLError(error)
      commit('setError', currentError)
      console.error(utils.getFirstGraphQLError(error))
    }
    // commit('setLoading', false)
  },
  async addPost({ commit }, payload) {
    commit('clearError')
    commit('setLoading', true)
    try {
      await this.app.apolloProvider.defaultClient.mutate({
        mutation: addPost,
        variables: payload
      })
      const { _id, title, imageUrl } = payload
      const newPost = {
        _id,
        title,
        imageUrl
      }
      commit('addPost', newPost)
    } catch (error) {
      const currentError = utils.getCurrentGraphQLError(error)
      commit('setError', currentError)
      console.error(utils.getFirstGraphQLError(error))
    }
    commit('setLoading', false)
  },
  async logOut({ commit }) {
    this.app.$cookies.remove('apollo-token')
    await this.app.$apolloHelpers.onLogout()
    commit('clearUser')
  },
  async getCurrentUser({ commit, dispatch }) {
    if (!utils.isJwtTokenValid(this.app.$apolloHelpers.getToken())) {
      console.log('Invalid Token', this.app.i18n.t('sessionExpiredSignInAgain'))
      commit('setAuthError', this.app.i18n.t('sessionExpiredSignInAgain'))
      await dispatch('logOut')
      return
    }
    commit('setLoading', true)
    try {
      const result = await this.app.apolloProvider.defaultClient.query({
        query: getCurrentUser
      })
      // Add user data to state
      commit('setUser', result.data.getCurrentUser)
      commit('clearError')
      commit('clearAuthError')
    } catch (error) {
      const currentError = utils.getCurrentGraphQLError(error)
      if (currentError === 'Unauthorized') {
        console.log('Error', this.app.i18n.t('sessionExpiredSignInAgain'))
        commit('setAuthError', this.app.i18n.t('sessionExpiredSignInAgain'))
        await dispatch('logOut')
      } else {
        commit('setError', currentError)
      }
      console.error(utils.getFirstGraphQLError(error))
    }
    commit('setLoading', false)
  },
  async signinUser({ commit, dispatch }, payload) {
    commit('clearError')
    commit('setLoading', true)
    try {
      const result = await this.app.apolloProvider.defaultClient.mutate({
        mutation: signinUser,
        variables: payload
      })
      await this.app.$apolloHelpers.onLogin(result.data.signinUser.token)
      await dispatch('getCurrentUser')
    } catch (error) {
      const currentError = utils.getCurrentGraphQLError(error)
      commit('setError', currentError)
      console.error(utils.getFirstGraphQLError(error))
    }
    commit('setLoading', false)
  },
  async signupUser({ commit, dispatch }, payload) {
    commit('clearError')
    commit('setLoading', true)
    try {
      const result = await this.app.apolloProvider.defaultClient.mutate({
        mutation: signupUser,
        variables: payload
      })
      await this.app.$apolloHelpers.onLogin(result.data.signupUser.token)
      await dispatch('getCurrentUser')
    } catch (error) {
      const currentError = utils.getCurrentGraphQLError(error)
      commit('setError', currentError)
      console.error(utils.getFirstGraphQLError(error))
    }
    commit('setLoading', false)
  },
  async signoutUser({ dispatch }) {
    await dispatch('logOut')
    // redirect home - kick users out of private pages (i.e. profile)
    this.app.router.push(this.app.localePath('index'))
  }
}
export const getters = {
  posts: state => state.posts,
  searchResults: state => state.searchResults,
  user: state => state.user,
  userFavorites: state => state.user && state.user.favorites,
  loading: state => state.loading,
  error: state => state.error,
  authError: state => state.authError
}
