import types from '../Type';//数据类型
import "whatwg-fetch";

// initial state
// shape: [{ id, quantity }]
const state = {
	HeaderIsHome: true,
	HeaderTitle:"身边订票",

	startCity:{
		Code:"110000",
		Name:"北京市"
	},//出发地
	endCity:{
		Code:"310000",
		Name:"上海市"
	},//到达地

	startDate:{
		date:"",
		week:""
	},//出发日期

	startCityList:null,//开始出发的城市列表
	endCityList:null,//到达的城市列表

	resultList:null,//结果
}

// getters,获取数据
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
	getCityList: state => {
		return {
			startCityList:state.startCityList,
			endCityList:state.endCityList,
		}
	},
	getResultList:state=>state.resultList
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
	},
	setStartCity({commit,state},data){
		commit(types.SET_STARTCITY,data)
	},
	setEndCity({commit,state},data){
		commit(types.SET_ENDCITY,data)
	},
	setStartDate({commit,state},data){
		commit(types.SET_STARTDATE,data)
	},
	setStartCityList({commit,state}){
		if(state.startCityList){
			// 列表空
			return new Promise((reslove,reject)=>{
				reslove();
			})
		}
		return getData("http://192.168.31.86/api/Busticket/GetStart",(data)=>{
			commit(types.SET_STARTCITYLIST,data);
		})
	},
	setEndCityList({commit,state}){
		if(state.endCityList){
			// 列表空
			return new Promise((reslove,reject)=>{
				reslove();
			})
		}
		else{
			return getData("http://192.168.31.86/api/Busticket/GetStart",(data)=>{
				commit(types.SET_ENDCITYLIST,data);
			})
		}
	},
	setResultList({commit,state}){
		if(state.resultList){
			// 列表空
			return new Promise((reslove,reject)=>{
				reslove();
			})
		}
		else{
			return fetch("http://192.168.31.116:12580/activeity")
			.then(result=>result.json())
			.then(result=>{
				commit(types.SET_RESULTLIST,result.return);
			})
		}
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
	,
	[types.SET_STARTCITYLIST] (state,data){
		state.startCityList = data;
	}
	,
	[types.SET_ENDCITYLIST] (state,data){
		state.endCityList = data;
	}
	,
	[types.SET_RESULTLIST] (state,data){
		state.resultList = data;
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}