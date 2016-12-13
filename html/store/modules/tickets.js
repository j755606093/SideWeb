import types from '../Type';//数据类型
import "whatwg-fetch";

// initial state
// shape: [{ id, quantity }]
const state = {
	HeaderIsHome: true,
	HeaderTitle:"身边订票",

	startCity:{
		Code:"3385299",
		Name:"五经富",
	},//出发地
	endCity:{
		Code:"3385290",
		Name:"深圳罗湖",
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
	getBusInfo:state=>state.busInfo,
	Development:state=>state
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
		return fetch("http://wx.1yhp.net/api/Transport/GetPoints/1").then(result=>result.json())
			.then(result=>{
				commit(types.SET_STARTCITYLIST,result.Data);
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
			return fetch("http://wx.1yhp.net/api/Transport/GetPoints/2").then(result=>result.json())
			.then(result=>{
				commit(types.SET_ENDCITYLIST,result.Data);
				return result.Data;
			})
		}
	},
	setResultList({commit,state}){
		return fetch("http://wx.1yhp.net/api/Transport/GetLines",{
			method: 'POST',
			headers: {
		    'Content-Type': 'application/json'
		  },
			body:JSON.stringify({
				SPointId:state.startCity.Code,
				EPointId:state.endCity.Code,
				// SPointId:state.startCity.Code,
				// EPointId:state.endCity.Code,
				Date:state.startDate.server
			})
		})
		.then(result=>result.json())
		.then(result=>{
			if(result.Code===204){
				// 没有更多数据
				commit(types.SET_RESULTLIST,[]);
				return;
			}
			commit(types.SET_RESULTLIST,result.Data);
		})
	},
	setBusInfo({commit,state},data){
		commit(types.SET_BUSINFO,data);
	},
	payMoney({commit,state},data){
		// 微信付款
		return fetch("http://wx.1yhp.net/api/Transport/GenerateOrderInfo",{
			method: 'POST',
			headers: {
		    'Content-Type': 'application/json'
		  },
			body:JSON.stringify({
				UsrId:data.UsrId,
				Name:data.Name,//使用点号链接
				Mobile:data.Mobile,
				LineId:state.busInfo.LineId,
				SPointId:state.busInfo.StartPointId,
				EPointId:state.busInfo.EndPointId,
				Date:state.startDate.server
			})
		})
		.then(result=>result.json())
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