import types from '../Type';//数据类型
import "whatwg-fetch";
const _ = require("underscore");

const debug = (function(){
	let debug = false;
	let url = window.location.href;
	if(url.slice(0,5)==="https"){
		debug = false;
	}
	else{
		debug = true;
	}
	return debug;
})()

// initial state
// shape: [{ id, quantity }]
const state = {
	isFirst:true,//第一次启动
	HeaderIsHome: true,
	HeaderTitle:"身边订票",
	showFooter:true,//显示底部tab
	
	// 正式数据库
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

	resultList:[],//搜索结果
	locationResult:null,//定位结果
	haveLocation:false,//没有定位结果

	passenger:[],//乘客信息
	rebate:null,//优惠信息
	phone:null,//取票人手机号

	busInfo:null,//乘坐车辆的信息,大概都是上面resultList的一个数据,
	serverUrl:debug?"http://192.168.31.80":"",//服务器地址
	Authorization:debug?"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDE1OTE5MDIwMDYwMzEiLCJqdGkiOiJlNGNhY2U1NC0wZDJkLTQwOGYtOGIzMC1lM2FiYmJhYjUwMTYiLCJpYXQiOjE0ODMzNTAxMzAsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4MzM1MDEzMCwiZXhwIjoxNDg0NTU5NzMwLCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.cmj1ZyP3OWnbwuexFwW05_4xYHZ4D7LgTZhrl_He9Rs":"",
}

// getters,获取数据
const getters = {
	getIsFirst:state=>state.isFirst,
	getHeaderState: state => state.HeaderIsHome,
	getFooter:state=>state.showFooter,
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
	Development:state=>state,
	getLocationResult:state=>state.locationResult,
	getHaveLocation:state=>state.haveLocation,
	getPassenger:state=>state.passenger,
	getRebate:state=>state.rebate,
	getPhone:state=>state.phone,
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
	ChangeFooter ({ commit, state }, data) {
		commit("CHANGE_FOOTER",data)
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
	getCityDefault({commit,state}){
		return fetch(state.serverUrl+"/api/Transport/Index")
			.then(result=>result.json())
			.then(result=>{
				let data = result.Data;
				commit(types.SET_STARTCITY,{
					Code:data.Start.Id,
					Name:data.Start.Name
				});
				if(!data.End){
					// 如果为空,后台不保证传回来的是真实的数据
					commit(types.SET_ENDCITY,{
						Code:"000",
						Name:"请选择"
					})
					return {End:false};
				}
				commit(types.SET_ENDCITY,{
					Code:data.End.Id,
					Name:data.End.Name
				});
				return data;
			})
	},
	setStartCityList({commit,state}){
		if(state.startCityList){
			// 列表空
			return new Promise((reslove,reject)=>{
				reslove();
			})
		}
		return fetch(state.serverUrl+"/api/Transport/GetStartPoints").then(result=>result.json())
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
			return fetch(state.serverUrl+"/api/Transport/GetEndPoints/"+state.startCity.Code).then(result=>result.json())
			.then(result=>{
				commit(types.SET_ENDCITYLIST,result.Data);
				return result.Data;
			})
		}
	},
	setResultList({commit,state}){
		return fetch(state.serverUrl+"/api/Transport/GetLines",{
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
			if(result.Code!==200){
				// 没有更多数据
				commit(types.SET_RESULTLIST,[]);
				return [];
			}
			else{
				commit(types.SET_RESULTLIST,result.Data);
				return result.Data;
			}
		})
	},
	setBusInfo({commit,state},data){
		commit(types.SET_BUSINFO,data);
	},
	payMoney({commit,state},data){
		// 微信付款
		return fetch(state.serverUrl+"/api/Order/Create",{
			method: 'POST',
			headers: {
		    'Content-Type': 'application/json',
		    Authorization:state.Authorization
		  },
			body:JSON.stringify({
				LineId:state.busInfo.LineId,
				SPointId:state.busInfo.StartPointId,
				EPointId:state.busInfo.EndPointId,
				Date:state.startDate.date,
				LinkmanId:data.LinkmanId,
				PassengerIds:data.PassengerIds,
				RebateId:data.RebateId,
				StartAddress:data.StartAddress
			})
		})
		.then(result=>result.json())
	},
	showWXpay({commit,state},data){
		// 微信付款
		return fetch(state.serverUrl+"/api/Order/PayOrder",{
			method: 'POST',
			headers: {
		    'Content-Type': 'application/json',
		    Authorization:state.Authorization
		  },
			body:JSON.stringify({
				OrderId:data
			})
		})
		.then(result=>result.json())
	},
	setLocationResult({commit,state},data){
		return fetch(state.serverUrl+"/api/Transport/NearestStartPoints",{
			method: 'POST',
			headers: {
		    'Content-Type': 'application/json',
		    Authorization:state.Authorization
		  },
			body:JSON.stringify({
				Lat:data.latitude,
				Lng:data.longitude
			})
		})
		.then(result=>result.json())
		.then(data=>{
			if(data.Data){
				commit(types.SET_LOCATIONRESULT,data.Data);
				return data.Data;
			}
			else{
				commit(types.SET_LOCATIONRESULT,null);
				return null;//没有找到数据
			}
		})
	},
	setHaveLocation({commit,state},data){
		commit(types.SET_HAVELOCATION,data);
	},
	setisFirst({commit,state},data){
		commit("SET_ISFIRST",data);
	},
	getPassenger({commit,state}){
		return fetch(state.serverUrl+"/api/Transport/UserRelevant/0",{
			headers:{
				Authorization:state.Authorization
			}
		})
			.then(result=>result.json())
			.then(result=>{
				let data = result.Data;
				// _.map(data,item=>{
				// 	if(data.Mobile!==''){
				// 		item.isGetTicket = false;
				// 	}
				// })
				commit("SET_PASSENGER",data.Passengers);
				commit("SET_REBATES",data.Rebates);
				commit("SET_PHONE",data.Phone?data.Phone:'');
				return data;
			})
	},
	setPassenger({commit,state},data){
		commit("SET_PASSENGER",data);
	},
	addPassenger({commit,state},data){
		return fetch(state.serverUrl+"/api/Passenger/Add",{
			method: 'POST',
			headers: {
		    'Content-Type': 'application/json',
		    Authorization:state.Authorization
		  },
			body:JSON.stringify({
				Name:data.Name,
				Mobile:data.Mobile,
				// UsrId:"9264122"
			})
		})
		.then(result=>result.json())
		.then(result=>{
			return result;
		})
	},
	setPhone({commit,state},data){
		commit("SET_PHONE",data);
	},
	checkRebateStatus({commit,state},data){
		return fetch(state.serverUrl+"/api/Transport/CheckRebateCode/"+data,{
			headers:{
				Authorization:state.Authorization
			}
		})
		.then(result=>result.json())
		.then(result=>{
			return result;
		})
	},
	deletePassenger({commit,state},data){
		return fetch(state.serverUrl+"/api/Passenger/Delete/"+data,{
			headers:{
				Authorization:state.Authorization
			}
		})
		.then(result=>result.json())
		.then(result=>{
			return result;
		})
	},
	getWXconfig({commit,state}){
		return fetch(state.serverUrl+"/api/WxBasis/GetJsPackage/",{
			method:"POST",
			headers:{
				Authorization:state.Authorization
			},
			body:JSON.stringify({
				Url:window.location.href.split("#")[0]
			})
		})
		.then(result=>result.json())
		.then(result=>{
			return result;
		})
	}
}

// mutations
const mutations = {
	[types.CHANGE_HEADER] (state,data) {
		// 设置头部状态显示
		state.HeaderIsHome = data.isHome;
		state.HeaderTitle = data.Title;
	},
	["CHANGE_FOOTER"] (state,data){
		state.showFooter = data;
	},
	[types.SET_STARTCITY] (state,data){
		state.startCity = data;
	},
	[types.SET_ENDCITY] (state,data){
		state.endCity = data;
	},
	[types.SET_STARTDATE] (state,data){
		let newData = Object.assign({},state.startDate,data);
		state.startDate = newData;
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
	},
	[types.SET_LOCATIONRESULT](state,data){
		state.locationResult = data;
	},
	[types.SET_HAVELOCATION](state,data){
		state.haveLocation = data;
	},
	["SET_ISFIRST"](state,data){
		state.isFirst = data;
	},
	["SET_PASSENGER"](state,data){
		state.passenger = data;
	},
	["SET_REBATES"](state,data){
		state.rebate = data;
	},
	["SET_PHONE"](state,data){
		state.phone = data;
	}
}

export default {
	state,
	getters,
	actions,
	mutations
}