/**
 * 数据中心
 * 这里包含了几乎所有的网络操作,因为需要token
 * 并且包含了调用公司app用户的token操作
 */
import types from '../Type'; //数据类型
import "whatwg-fetch";
const _ = require("underscore");
import { Toast } from 'mint-ui';

/** 判断是本地测试还是线上生产环环境 */
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

/** ios端回调传送回本地js的token,然后保存到本地 */
window.getData = (data) => {
	window.localStorage.setItem("UserInfo", "Bearer " + data);
}

/** 如果是app中android */
if (typeof window.jgkj !== "undefined") {
	// alert(JSON.stringify(window.jgkj.getUserInfo()))
	window.localStorage.setItem("UserInfo", JSON.stringify(window.jgkj.getUserInfo()));
}
/** 如果是ios的app */
// if (typeof window.webkit !== "undefined"&&typeof window.webkit.messageHandlers!=="undefined"&&typeof window.webkit.messageHandlers.getUserInfo!=="undefined") {
// 	window.webkit.messageHandlers.getUserInfo.postMessage(['getData', ]);
// }

/**
 * 从cookie中拿tooken,兼容有些浏览器没有设置cookie
 * @param  {[type]} ) {	let        cookie [description]
 * @return {[type]}   [description]
 */
let Authorization = (function() {
	if (window.localStorage.getItem("UserInfo")) {
		// app中
		let string = window.localStorage.getItem("UserInfo");
		return "Bearer " + JSON.parse(string).Access_Token;//格式为json
	}
	let cookie = document.cookie;//获取浏览器的token
	if (cookie === "") {
		return cookie;
	}

	let arrayCookie = cookie.split(";");

	for (let i = 0; i < arrayCookie.length; i++) {
		let item = arrayCookie[i].split("=");

		if (item[0].trim() === "access_token") {
			return "Bearer " + item[1];
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
			// window.location.href = "https://ticket.samecity.com.cn/api/oauth2/Index?returnUrl=https://ticket.samecity.com.cn/wx/ticket.html";
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

// 初始化数据 state
const state = {
	isFirst: true, //第一次启动
	HeaderIsHome: true,//是否是主页
	showHeader: false, //不显示头部
	showBack: true, //不显示返回键
	HeaderTitle: "身边订票",//头部标题显示
	showFooter: true, //显示底部tab

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
	Authorization: debug ? "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDE1OTE5MDIwMDYwMzEiLCJqdGkiOiI4N2RkYmRlYy05ZWFiLTQ3MWItYjQwNy02ODY2OWVmN2NhMTEiLCJpYXQiOjE0ODg1OTE3NzAsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4ODU5MTc3MCwiZXhwIjoxNDg5ODAxMzcwLCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.28By9C5QI-QWINKeAHi57Pi0YMymQXeqi4VwbJJiTxE" : Authorization,
}

// getters,获取数据
// 调用方法如下
// this.$store.getters.getIsFirst
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
// 调用方法:
// this.$store.dispatch("cancelOrder",数据)
const actions = {
	/** 更改头部的标题 */
	ChangeHeader({ commit, state }, data) {
		commit(types.CHANGE_HEADER, data)
	},
	/** 是否显示头部 */
	SetShowHeader({ commit, state }, data) {
		commit("SET_SHOWHEADER", data)
	},
	/** 是否显示头部返回按钮 */
	SetShowBack({ commit, state }, data) {
		commit("SET_SHOWBACK", data)
	},
	/** 改变首页tabbar显示状态 */
	ChangeFooter({ commit, state }, data) {
		commit("CHANGE_FOOTER", data)
	},
	/** 在出发点页面选择了一个出发点 */
	setStartCity({ commit, state }, data) {
		commit(types.SET_STARTCITY, data)
	},
	/** 在到达点页面选择了一个到达点 */
	setEndCity({ commit, state }, data) {
		commit(types.SET_ENDCITY, data)
	},
	/** 设置开始时间 */
	setStartDate({ commit, state }, data) {
		commit(types.SET_STARTDATE, data)
	},
	/** 获取默认的出发点(没有到达点) */
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
	/** 获取出发点 */
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
	/** 获取后台可选的到达点 */
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
	/** 获取搜索结果 */
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
	/** 设置汽车信息 */
	setBusInfo({ commit, state }, data) {
		commit(types.SET_BUSINFO, data);
	},
	/** 创建订单(函数名可能会有误解) */
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
					StartAddress: data.StartAddress,
					Remark: data.Remark,
					JourneyRmk: data.JourneyRmk
				})
			})
			.then(checkStatus)
			.then(result => result.json())
	},
	/** 获取下单后的微信支付数据用来支付 */
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
	/** 获取定位位置后获取后台返回的最近上车点 */
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
	/** 设置定位点 */
	setHaveLocation({ commit, state }, data) {
		commit(types.SET_HAVELOCATION, data);
	},
	/** 设置第一次启动 */
	setisFirst({ commit, state }, data) {
		commit("SET_ISFIRST", data);
	},
	/** 进入首页就获取关于乘客和优惠券和购票人的信息 */
	getPassenger({ commit, state }) {
		return fetch(state.serverUrl + "/api/Transport/UserRelevant", {
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
				commit("SET_PASSENGER", data.Passengers);
				commit("SET_REBATES", data.Rebates);
				commit("SET_NOPAY", data.NoPay);
				commit("SET_PHONE", data.Userinfo.Mobile ? data.Userinfo.Mobile : '');
				return data;
			})
	},
	/** 设置乘客信息 */
	setPassenger({ commit, state }, data) {
		commit("SET_PASSENGER", data);
	},
	/** 增加乘客信息 */
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
	/** 更新乘客信息 */
	updatePassenger({ commit, state }, data) {
		return fetch(state.serverUrl + "/api/Passenger/Modify", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				},
				body: JSON.stringify({
					Name: data.Name,
					Mobile: data.Mobile,
					Id: data.Id
						// UsrId:"9264122"
				})
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				return result;
			})
	},
	/** 设置手机号 */
	setPhone({ commit, state }, data) {
		commit("SET_PHONE", data);
	},
	/** 检查优惠券状态,是否可用 */
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
	/** 删除乘客,但是目前没有使用到此api */
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
	/** 使用微信jssdk的时候需要从服务器获取配置,但是目前已经弃用这种方式,因为不需要那么多功能 */
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
	/** 下单后取消订单 */
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
	},
	/** 获取二维码的优惠信息 */
	getQRRebateInfo({ commit, state }, data) {
		// /api/Order/Cancel
		return fetch(state.serverUrl + "/api/Rebate/GetQrcodeRebate?id="+data, {
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				},
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				return result;
			})
	},
	/** 领取二维码优惠 */
	getQRRebate({ commit, state }, data) {
		// /api/Order/Cancel
		return fetch(state.serverUrl + "/api/Rebate/ReceiveQrcodeRebate", {
				method: "POST",
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				},
				body: JSON.stringify({
					Id: data
				})
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				return result;
			})
	},
	/** 获取优惠券信息 */
	getRebateInfo({ commit, state }, data) {
		// /api/Order/Cancel
		return fetch(state.serverUrl + "/api/Rebate/GetCodeInfo?code="+data, {
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				},
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				return result;
			})
	},
	/** 领取优惠券 */
	getRebate({ commit, state }, data) {
		// /api/Order/Cancel
		return fetch(state.serverUrl + "/api/Transport/CheckRebateCode/"+data, {
				method: "GET",
				headers: {
					'Content-Type': 'application/json',
					Authorization: state.Authorization
				},
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				return result;
			})
	}
}

// mutations
// 改变数据,每一个类型对应一个操作
const mutations = {
	["SET_SHOWHEADER"](state, data) {
		state.showHeader = data;
	},
	["SET_SHOWBACK"](state, data) {
		state.showBack = data;
	},
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
