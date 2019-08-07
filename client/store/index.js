import { getPosts } from '~/gql/getPosts.gql'
import { getCurrentUser } from '~/gql/getCurrentUser.gql'
import { signinUser } from '~/gql/signinUser.gql'

export const state = () => ({
  posts: [],
  user: null,
  loading: false
})
export const mutations = {
  setPosts: (state, payload) => {
    state.posts = payload
  },
  setUser: (state, payload) => {
    state.user = payload
  },
  setLoading: (state, payload) => {
    state.loading = payload
  },
  clearUser: state => (state.user = null)
}
export const actions = {
  async nuxtServerInit({ dispatch }) {
    await dispatch('getCurrentUser')
    await dispatch('getPosts')
  },
  async getPosts({ commit }) {
    commit('setLoading', true)
    try {
      const result = await this.app.apolloProvider.defaultClient.query({
        query: getPosts
      })
      commit('setPosts', result.data.getPosts)
    } catch (error) {
      console.log(error)
    }
    commit('setLoading', false)
  },
  async getCurrentUser({ commit }) {
    if (!this.app.$apolloHelpers.getToken()) {
      commit('clearUser')
      return
    }
    commit('setLoading', true)
    try {
      const result = await this.app.apolloProvider.defaultClient.query({
        query: getCurrentUser
      })
      // Add user data to state
      commit('setUser', result.data.getCurrentUser)
    } catch (error) {
      console.error(error)
    }
    commit('setLoading', false)
  },
  async signinUser({ commit, dispatch }, payload) {
    commit('setLoading', true)
    try {
      const result = await this.app.apolloProvider.defaultClient.mutate({
        mutation: signinUser,
        variables: payload
      })
      await this.app.$apolloHelpers.onLogin(result.data.signinUser.token)
      await dispatch('getCurrentUser')
      commit('setLoading', false)
    } catch (error) {
      console.error(error)
      commit('setLoading', false)
    }
  },
  async signoutUser({ commit }) {
    // clear user in state
    commit('clearUser')
    await this.app.$apolloHelpers.onLogout()
    // redirect home - kick users out of private pages (i.e. profile)
    this.app.router.push(this.app.localePath('index'))
  }
}
export const getters = {
  posts: state => state.posts,
  user: state => state.user,
  loading: state => state.loading
}
