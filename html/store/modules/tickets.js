import types from '../Type';//数据类型
import "whatwg-fetch";

// initial state
// shape: [{ id, quantity }]
const state = {
	HeaderIsHome: true,
	HeaderTitle:"身边订票",

	startCity:{
		Code:"3385295",
		Name:"布吉",
	},//出发地
	endCity:{
		Code:"3385285",
		Name:"黄木岗",
	},//到达地

	startDate:{
		date:"",
		week:"",
		server:null
	},//出发日期

	startCityList:null,//开始出发的城市列表
	endCityList:null,//到达的城市列表

	resultList:null,//结果

	busInfo:null,//乘坐车辆的信息,大概都是上面resultList的一个数据
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
	getResultList:state=>state.resultList,
	getBusInfo:state=>state.busInfo
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
		return fetch("http://wx.1yhp.net/api/Transport/GetPoints").then(result=>result.json())
			.then(result=>{
				commit(types.SET_STARTCITYLIST,result.Data);
				commit(types.SET_ENDCITYLIST,result.Data);
				return result.Data;
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
			return fetch("http://wx.1yhp.net/api/Transport/GetPoints").then(result=>result.json())
			.then(result=>{
				commit(types.SET_ENDCITYLIST,result.Data);
				commit(types.SET_STARTCITYLIST,result.Data);
				return result.Data;
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
			return fetch("http://wx.1yhp.net/api/Transport/GetLines",{
				method: 'POST',
				headers: {
			    'Content-Type': 'application/json'
			  },
				body:JSON.stringify({
					SPointId:"3385299",
					EPointId:"3385291",
					// SPointId:state.startCity.Code,
					// EPointId:state.endCity.Code,
					Date:state.startDate.server
				})
			})
			.then(result=>result.json())
			.then(result=>{
				commit(types.SET_RESULTLIST,result.Data);
			})
		}
	},
	setBusInfo({commit,state},data){
		commit(types.SET_BUSINFO,data);
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
	},
	[types.SET_STARTCITYLIST] (state,data){
		state.startCityList = data;
	},
	[types.SET_ENDCITYLIST] (state,data){
		state.endCityList = data;
	},
	[types.SET_RESULTLIST] (state,data){
		state.resultList = data;
	},
	[types.SET_BUSINFO] (state,data){
		state.busInfo = data;
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}