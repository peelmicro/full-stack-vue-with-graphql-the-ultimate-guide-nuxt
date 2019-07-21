import { getPosts } from '~/gql/getPosts.gql'

export const state = () => ({
  posts: [],
  loading: false
})
export const mutations = {
  setPosts: (state, payload) => {
    state.posts = payload
  },
  setLoading: (state, payload) => {
    state.loading = payload
  }
}
export const actions = {
  async nuxtServerInit({ dispatch }) {
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
  }
}
export const getters = {
  posts: state => state.posts,
  loading: state => state.loading
}
