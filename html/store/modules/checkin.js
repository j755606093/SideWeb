import types from '../Type';//数据类型
import "whatwg-fetch";

const state = {
	
}

// getters,获取数据
const getters = {
	getIsFirst:state=>state.isFirst,
}

let getData = (url,callback)=>{
	return fetch(url,{method:"POST"})
		.then(result=>result.json())
		.then(result=>{
			callback(result.Data);
			Promise.resolve(result.Data);
		})
		.catch(error=>{
			console.log("error:",error)
		})
}

// actions
const actions = {
	ChangeHeader ({ commit, state }, data) {
		commit(types.CHANGE_HEADER,data)
	}
}

// mutations
const mutations = {
	[types.CHANGE_HEADER] (state,data) {
		// 设置头部状态显示
		state.HeaderIsHome = data.isHome;
		state.HeaderTitle = data.Title;
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}