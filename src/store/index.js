import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

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
  // 配置为 vuex 的插件
  plugins: [createPersistedState()],
  actions: {},
  modules: {}
})
