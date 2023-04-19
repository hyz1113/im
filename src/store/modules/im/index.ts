const im = {
  namespaced: true,
  state: {
    $tim: null,
  },
  getters: {
    getTim (state: any) {
      const { $tim } = state;
      return $tim
    }
  },
  mutations: {
    tim (state: any, value: any) {
      state.$tim = value;
    }
  },
  actions: {
    setTim (context: any, value: any) {
      context.commit('tim', value)
    }
  },
  modules: {
  }
}

export default im;
