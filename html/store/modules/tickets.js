import types from '../Type';//数据类型

// initial state
// shape: [{ id, quantity }]
const state = {
  HeaderIsHome: true,
}

// getters,获取HeaderIsHome
const getters = {
  getHeaderState: state => state.HeaderIsHome
}

// actions
const actions = {
  ChangeHeaderState ({ commit, state }, status) {
    commit(types.CHANGE_HEADER,status)
  }
}

// mutations
const mutations = {
  [types.CHANGE_HEADER] (state,status) {
    // 设置头部状态显示
    state.HeaderIsHome = status;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}