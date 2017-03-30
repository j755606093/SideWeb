import Vue from 'vue';
import Vuex from 'vuex';
// import * as actions from './action';
// import * as getters from './getters';//获取数据的通用函数(进行处理)
import checkin from './modules/checkin.js';

Vue.use(Vuex);

export default new Vuex.Store({
	// actions,
	// getters,
	modules: {
		checkin,
	},
	strict: "development",
})
