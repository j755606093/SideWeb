import types from '../Type';//数据类型

// initial state
// shape: [{ id, quantity }]
const state = {
  HeaderIsHome: true,
  HeaderTitle:"身边订票",

  startCity:"",//出发地
  endCity:"",//到达地

  startDate:"",//出发日期
}

// getters,获取HeaderIsHome
const getters = {
  getHeaderState: state => state.HeaderIsHome,
  getHeaderTitle: state => state.HeaderTitle,
  getInfo: state => {
    return {
      startCity:state.startCity,
      endCity:state.endCity,
      startDate:state.startDate
    }
  },
}

// actions
const actions = {
  ChangeHeader ({ commit, state }, data) {
    commit(types.CHANGE_HEADER,data)
  },
  setStartCity({commit,state},data){
    commit(types.SET_STARTCITY,data)
  },
  setEndCity({commit,state},data){
    commit(types.SET_ENDCITY,data)
  },
  setStartDate({commit,state},data){
    commit(types.SET_STARTDATE,data)
  }
}

// mutations
const mutations = {
  [types.CHANGE_HEADER] (state,data) {
    // 设置头部状态显示
    state.HeaderIsHome = data.isHome;
    state.HeaderTitle = data.Title;
  },
  [types.SET_STARTCITY] (state,data){
    state.startCity = data;
  },
  [types.SET_ENDCITY] (state,data){
    state.endCity = data;
  },
  [types.SET_STARTDATE] (state,data){
    state.startDate = data;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}