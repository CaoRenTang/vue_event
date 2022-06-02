import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '' // 保存token字符串
  },
  getters: {},
  mutations: {
    updateToken (state, val) {
      state.token = val
    }
  },
  actions: {},
  modules: {}
})
