import types from '../Type'; //数据类型
import "whatwg-fetch";
const _ = require("underscore");
import { Toast } from 'mint-ui';

const debug = (function() {
	let debug = false;
	let url = window.location.href;
	if (url.slice(0, 5) === "https") {
		debug = false;
	} else {
		debug = true;
	}
	return debug;
})();

/**
 * 从cookie中拿tooken,兼容有些浏览器没有设置cookie
 * @param  {[type]} ) {	let        cookie [description]
 * @return {[type]}   [description]
 */
const Authorization = (function() {
	let cookie = document.cookie;
	if (cookie === "") {
		return cookie;
	}

	let arrayCookie = cookie.splite(";");

	for (let i = 0; i < arrayCookie.length; i++) {
		let item = arrayCookie[i].split("=");

		let key = item[0];
		if (key === "access_token") {
			return item[1];
		}
	}

	return ""; //如果没有就返回这个
})();

//检查请求返回的状态
function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response
	} else {
		if (response.status === 401) {
			// window.location.href = "https://ticket.samecity.com.cn/api/oauth2/Index?returnUrl=https://ticket.samecity.com.cn/wx/ticket.html#/";
		}
		Toast({
			message: "服务器繁忙,请稍后重试...",
			position: 'bottom',
			duration: 3000
		});
		// var error = new Error(response.statusText)
		// error.response = response
		// throw error
		return null;
	}
}

// initial state
// shape: [{ id, quantity }]
const state = {
	isFirst: true, //第一次启动
	HeaderIsHome: true,
	HeaderTitle: "身边订票",
	showFooter: true, //显示底部tab

	// 正式数据库
	startCity: {
		Code: "3385299",
		Name: "五经富",
	}, //出发地
	endCity: {
		Code: "3385290",
		Name: "深圳罗湖",
	}, //到达地

	startDate: {
		date: "",
		week: "",
		server: null
	}, //出发日期

	startCityList: [], //开始出发的城市列表
	endCityList: [], //到达的城市列表

	resultList: [], //搜索结果
	locationResult: null, //定位结果
	haveLocation: false, //没有定位结果

	passenger: [], //乘客信息
	rebate: [], //优惠信息
	nopay: 0, //未支付订单数量
	phone: null, //取票人手机号

	busInfo: null, //乘坐车辆的信息,大概都是上面resultList的一个数据,
	serverUrl: debug ? "http://192.168.31.80" : "", //服务器地址
	Authorization: debug ? "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDE1OTE5MDIwMDYwMzEiLCJqdGkiOiI3YjA5YmUzMy1mNmE5LTRhYWEtOGQ1OS00M2MwNTQ1NWFlMjciLCJpYXQiOjE0ODQ1NjQyNTMsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4NDU2NDI1MiwiZXhwIjoxNDg1NzczODUyLCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.BKUUCZKNKyAfayx2qfYFbdLOLa8123L6jvjHGwj1t3Y" : Authorization,
}

// getters,获取数据
const getters = {
	getIsFirst: state => state.isFirst,
	getHeaderState: state => state.HeaderIsHome,
	getFooter: state => state.showFooter,
	getHeaderTitle: state => state.HeaderTitle,
	getInfo: state => {
		return {
			startCity: state.startCity,
			endCity: state.endCity,
			startDate: state.startDate
		}
	},
	getCityList: state => {
		return {
			startCityList: state.startCityList,
			endCityList: state.endCityList,
		}
	},
	getResultList: state => state.resultList,
	getBusInfo: state => state.busInfo,
	Development: state => state,
	getLocationResult: state => state.locationResult,
	getHaveLocation: state => state.haveLocation,
	getPassenger: state => state.passenger,
	getRebate: state => state.rebate,
	getPhone: state => state.phone,
	getNoPay: state => state.nopay
}

let getData = (url, callback) => {
	return fetch(url, { method: "POST" })
		.then(checkStatus)
		.then(result => result.json())
		.then(result => {
			callback(result.Data);
			Promise.resolve(result.Data);
		})
		.catch(error => {
			console.log("error:", error)
		})
}

// actions
const actions = {
	ChangeHeader({ commit, state }, data) {
		commit(types.CHANGE_HEADER, data)
	},
	ChangeFooter({ commit, state }, data) {
		commit("CHANGE_FOOTER", data)
	},
	setStartCity({ commit, state }, data) {
		commit(types.SET_STARTCITY, data)
	},
	setEndCity({ commit, state }, data) {
		commit(types.SET_ENDCITY, data)
	},
	setStartDate({ commit, state }, data) {
		commit(types.SET_STARTDATE, data)
	},
	getCityDefault({ commit, state }) {
		return fetch(state.serverUrl + "/api/Transport/Index")
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				let data = result.Data;
				commit(types.SET_STARTCITY, {
					Code: data.Start.CityId,
					Name: data.Start.Name
				});
				if (!data.End) {
					// 如果为空,后台不保证传回来的是真实的数据
					commit(types.SET_ENDCITY, {
						Code: "000",
						Name: "请选择"
					})
					return { End: false };
				}
				commit(types.SET_ENDCITY, {
					Code: data.End.CityId,
					Name: data.End.Name
				});
				return data;
			})
	},
	setStartCityList({ commit, state }) {
		// if(state.startCityList){
		// 	// 列表空
		// 	return new Promise((reslove,reject)=>{
		// 		reslove();
		// 	})
		// }
		return fetch(state.serverUrl + "/api/Transport/GetStartPoints").then(result => result.json())
			.then(result => {
				commit(types.SET_STARTCITYLIST, result.Data);
				return result.Data;
			})
	},
	setEndCityList({ commit, state }) {
		// if(state.endCityList){
		// 	// 列表空
		// 	return new Promise((reslove,reject)=>{
		// 		reslove();
		// 	})
		// }
		return fetch(state.serverUrl + "/api/Transport/GetEndPoints/" + state.startCity.Code)
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				commit(types.SET_ENDCITYLIST, result.Data);
				return result.Data;
			})
	},
	setResultList({ commit, state }) {
		return fetch(state.serverUrl + "/api/Transport/GetLines", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					SPoint: state.startCity.Name,
					EPoint: state.endCity.Name,
					// SPointId:state.startCity.Code,
					// EPointId:state.endCity.Code,
					Date: state.startDate.server
				})
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				if (result.Code !== 200) {
					// 没有更多数据
					commit(types.SET_RESULTLIST, []);
					return [];
				} else {
					commit(types.SET_RESULTLIST, result.Data);
					return result.Data;
				}
			})
	},
	setBusInfo({ commit, state }, data) {
		commit(types.SET_BUSINFO, data);
	},
	payMoney({ commit, state }, data) {
		// 微信付款
		return fetch(state.serverUrl + "/api/Order/Create", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				},
				body: JSON.stringify({
					LineId: state.busInfo.LineId,
					SPointId: state.busInfo.StartPointId,
					EPointId: state.busInfo.EndPointId,
					Date: state.startDate.date,
					LinkmanId: data.LinkmanId,
					PassengerIds: data.PassengerIds,
					RebateId: data.RebateId,
					StartAddress: data.StartAddress
				})
			})
			.then(checkStatus)
			.then(result => result.json())
	},
	showWXpay({ commit, state }, data) {
		// 微信付款
		return fetch(state.serverUrl + "/api/Order/PayOrder", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				},
				body: JSON.stringify({
					OrderId: data
				})
			})
			.then(checkStatus)
			.then(result => result.json())
	},
	setLocationResult({ commit, state }, data) {
		return fetch(state.serverUrl + "/api/Transport/NearestStartPoints", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				},
				body: JSON.stringify({
					Lat: data.latitude,
					Lng: data.longitude
				})
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(data => {
				if (data.Data) {
					commit(types.SET_LOCATIONRESULT, data.Data);
					return data.Data;
				} else {
					commit(types.SET_LOCATIONRESULT, null);
					return null; //没有找到数据
				}
			})
	},
	setHaveLocation({ commit, state }, data) {
		commit(types.SET_HAVELOCATION, data);
	},
	setisFirst({ commit, state }, data) {
		commit("SET_ISFIRST", data);
	},
	getPassenger({ commit, state }) {
		return fetch(state.serverUrl + "/api/Transport/UserRelevant/0", {
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				}
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				// console.log(result)
				let data = result.Data;
				// _.map(data,item=>{
				// 	if(data.Mobile!==''){
				// 		item.isGetTicket = false;
				// 	}
				// })
				commit("SET_PASSENGER", data.Passengers);
				commit("SET_REBATES", data.Rebates);
				commit("SET_NOPAY", data.NoPay);
				commit("SET_PHONE", data.Userinfo.Mobile ? data.Userinfo.Mobile : '');
				return data;
			})
	},
	setPassenger({ commit, state }, data) {
		commit("SET_PASSENGER", data);
	},
	addPassenger({ commit, state }, data) {
		return fetch(state.serverUrl + "/api/Passenger/Add", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				},
				body: JSON.stringify({
					Name: data.Name,
					Mobile: data.Mobile,
					// UsrId:"9264122"
				})
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				return result;
			})
	},
	setPhone({ commit, state }, data) {
		commit("SET_PHONE", data);
	},
	checkRebateStatus({ commit, state }, data) {
		return fetch(state.serverUrl + "/api/Transport/CheckRebateCode/" + data, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				}
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				return result;
			})
	},
	deletePassenger({ commit, state }, data) {
		return fetch(state.serverUrl + "/api/Passenger/Delete/" + data, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				}
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				return result;
			})
	},
	getWXconfig({ commit, state }) {
		return fetch(state.serverUrl + "/api/WxBasis/GetJsPackage/", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				},
				body: JSON.stringify({
					Url: window.location.href.split("#")[0]
				})
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				return result;
			})
	},
	cancelOrder({ commit, state }, data) {
		// /api/Order/Cancel
		return fetch(state.serverUrl + "/api/Order/Cancel", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				},
				body: JSON.stringify({
					OrderId: data
				})
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				return result;
			})
	}
}

// mutations
const mutations = {
	[types.CHANGE_HEADER](state, data) {
		// 设置头部状态显示
		state.HeaderIsHome = data.isHome;
		state.HeaderTitle = data.Title;
	},
	["CHANGE_FOOTER"](state, data) {
		state.showFooter = data;
	},
	[types.SET_STARTCITY](state, data) {
		state.startCity = data;
	},
	[types.SET_ENDCITY](state, data) {
		state.endCity = data;
	},
	[types.SET_STARTDATE](state, data) {
		let newData = Object.assign({}, state.startDate, data);
		state.startDate = newData;
	},
	[types.SET_STARTCITYLIST](state, data) {
		state.startCityList = data;
	},
	[types.SET_ENDCITYLIST](state, data) {
		state.endCityList = data;
	},
	[types.SET_RESULTLIST](state, data) {
		state.resultList = data;
	},
	[types.SET_BUSINFO](state, data) {
		state.busInfo = data;
	},
	[types.SET_LOCATIONRESULT](state, data) {
		state.locationResult = data;
	},
	[types.SET_HAVELOCATION](state, data) {
		state.haveLocation = data;
	},
	["SET_ISFIRST"](state, data) {
		state.isFirst = data;
	},
	["SET_PASSENGER"](state, data) {
		state.passenger = data;
	},
	["SET_REBATES"](state, data) {
		state.rebate = data;
	},
	["SET_PHONE"](state, data) {
		state.phone = data;
	},
	["SET_NOPAY"](state, data) {
		state.nopay = data;
	},
}

export default {
	state,
	getters,
	actions,
	mutations
}
