import { getPosts } from '~/gql/getPosts.gql'
import { infiniteScrollPosts } from '~/gql/infiniteScrollPosts.gql'
import { searchPosts } from '~/gql/searchPosts.gql'
import { getUserPosts } from '~/gql/getUserPosts.gql'
import { getCurrentUser } from '~/gql/getCurrentUser.gql'
import { signinUser } from '~/gql/signinUser.gql'
import { signupUser } from '~/gql/signupUser.gql'
import { addPost } from '~/gql/addPost.gql'
import { updateUserPost } from '~/gql/updateUserPost.gql'
import { deleteUserPost } from '~/gql/deleteUserPost.gql'
import utils from '~/helpers/utils'

export const state = () => ({
  posts: [],
  infiniteScrollPosts: {
    posts: [],
    hasMore: false
  },
  userPosts: [],
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
  setInfiniteScrollPosts: (state, payload) => {
    const infiniteScrollPosts = state.infiniteScrollPosts.posts
    state.infiniteScrollPosts = {
      posts: [...infiniteScrollPosts, ...payload.posts],
      hasMore: payload.hasMore
    }
  },
  clearInfiniteScrollPosts: state => {
    state.clearInfiniteScrollPosts = {
      posts: [],
      hasMore: false
    }
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
  setUserPosts: (state, payload) => {
    state.userPosts = payload
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
      if (process.env.NODE_ENV === 'development')
        console.error(utils.getFirstGraphQLError(error))
    }
    commit('setLoading', false)
  },
  async getInfiniteScrollPosts({ commit }, payload) {
    const pageSize = 2
    commit('clearError')
    commit('setLoading', true)
    try {
      const pageNum = payload || 1
      const variables = {
        pageNum,
        pageSize
      }
      const result = await this.app.apolloProvider.defaultClient.query({
        query: infiniteScrollPosts,
        variables
      })
      commit('setInfiniteScrollPosts', result.data.infiniteScrollPosts)
    } catch (error) {
      const currentError = utils.getCurrentGraphQLError(error)
      commit('setError', currentError)
      if (process.env.NODE_ENV === 'development')
        console.error(utils.getFirstGraphQLError(error))
    }
    commit('setLoading', false)
  },
  async getUserPosts({ commit }, payload) {
    commit('clearError')
    commit('setLoading', true)
    try {
      const result = await this.app.apolloProvider.defaultClient.query({
        query: getUserPosts,
        variables: payload
      })
      commit('setUserPosts', result.data.getUserPosts)
    } catch (error) {
      const currentError = utils.getCurrentGraphQLError(error)
      commit('setError', currentError)
      if (process.env.NODE_ENV === 'development')
        console.error(utils.getFirstGraphQLError(error))
    }
    commit('setLoading', false)
  },
  async searchPosts({ commit }, payload) {
    commit('clearError')
    try {
      const result = await this.app.apolloProvider.defaultClient.query({
        query: searchPosts,
        variables: payload
      })
      commit('setSearchResults', result.data.searchPosts)
    } catch (error) {
      const currentError = utils.getCurrentGraphQLError(error)
      commit('setError', currentError)
      if (process.env.NODE_ENV === 'development')
        console.error(utils.getFirstGraphQLError(error))
    }
  },
  async addPost({ commit, dispatch, state }, payload) {
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
      if (state.infiniteScrollPosts.posts.length > 0) {
        commit('clearInfiniteSrollPosts')
        await dispatch('getInfiniteScrollPosts')
      }
    } catch (error) {
      const currentError = utils.getCurrentGraphQLError(error)
      commit('setError', currentError)
      if (process.env.NODE_ENV === 'development')
        console.error(utils.getFirstGraphQLError(error))
    }
    commit('setLoading', false)
  },
  async updateUserPost({ state, commit, dispatch }, payload) {
    commit('clearError')
    commit('setLoading', true)
    try {
      const result = await this.app.apolloProvider.defaultClient.mutate({
        mutation: updateUserPost,
        variables: payload
      })
      const index = state.userPosts.findIndex(
        post => post._id === result.data.updateUserPost._id
      )
      const userPosts = [
        ...state.userPosts.slice(0, index),
        result.data.updateUserPost,
        ...state.userPosts.slice(index + 1)
      ]
      commit('setUserPosts', userPosts)
      await dispatch('getPosts')
      if (state.infiniteScrollPosts.posts.length > 0) {
        commit('clearInfiniteSrollPosts')
        await dispatch('getInfiniteScrollPosts')
      }
    } catch (error) {
      const currentError = utils.getCurrentGraphQLError(error)
      commit('setError', currentError)
      if (process.env.NODE_ENV === 'development')
        console.error(utils.getFirstGraphQLError(error))
    }
    commit('setLoading', false)
  },
  async deleteUserPost({ state, commit, dispatch }, payload) {
    commit('clearError')
    commit('setLoading', true)
    try {
      const result = await this.app.apolloProvider.defaultClient.mutate({
        mutation: deleteUserPost,
        variables: payload
      })
      const index = state.userPosts.findIndex(
        post => post._id === result.data.updateUserPost._id
      )
      const userPosts = [
        ...state.userPosts.slice(0, index),
        ...state.userPosts.slice(index + 1)
      ]
      commit('setUserPosts', userPosts)
      await dispatch('getPosts')
      if (state.infiniteScrollPosts.posts.length > 0) {
        commit('clearInfiniteSrollPosts')
        await dispatch('getInfiniteScrollPosts')
      }
    } catch (error) {
      const currentError = utils.getCurrentGraphQLError(error)
      commit('setError', currentError)
      if (process.env.NODE_ENV === 'development')
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
    const token = this.app.$apolloHelpers.getToken()
    if (!token) {
      return
    }
    if (!utils.isJwtTokenValid(token)) {
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
      if (currentError && currentError.error === 'Unauthorized') {
        const sessionExpiredSignInAgain = this.app.i18n.t(
          'sessionExpiredSignInAgain'
        )
        commit('setAuthError', sessionExpiredSignInAgain)
        await dispatch('logOut')
      } else {
        commit('setError', currentError)
      }
      if (process.env.NODE_ENV === 'development')
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
      if (process.env.NODE_ENV === 'development')
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
      if (process.env.NODE_ENV === 'development')
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
  infiniteScrollPosts: state => state.infiniteScrollPosts,
  userPosts: state => state.userPosts,
  searchResults: state => state.searchResults,
  user: state => state.user,
  userFavorites: state => state.user && state.user.favorites,
  loading: state => state.loading,
  error: state => state.error,
  authError: state => state.authError
}
