import Vue from 'vue';
import Vuex from 'vuex';
// import * as actions from './action';
// import * as getters from './getters';//获取数据的通用函数(进行处理)
import video from './modules/video.js';

Vue.use(Vuex);

export default new Vuex.Store({
	// actions,
	// getters,
	modules: {
		video,
	},
	strict: "development",
})
