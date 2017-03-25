/**
 * 数据中心
 * 这里包含了几乎所有的网络操作,因为需要token
 * 并且包含了调用公司app用户的token操作
 */
import types from '../ShareCarType'; //数据类型
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

/** 如果是app */
if (typeof window.jgkj !== "undefined") {
	var datastring = "";

	try {
		datastring = window.jgkj.getUserInfo();
	} catch (e) {
		alert(e)
	}
	window.localStorage.setItem("UserInfo", datastring);
}

/**
 * 从cookie中拿tooken,兼容有些浏览器没有设置cookie
 * @param  {[type]} ) {	let        cookie [description]
 * @return {[type]}   [description]
 */
var Authorization = "";
try {
	Authorization = (function() {
		let info = window.localStorage.getItem("UserInfo");
		if (info && info !== "undefined") {
			// app中
			let string = window.localStorage.getItem("UserInfo");
			return "Bearer " + JSON.parse(string).Access_Token; //格式为json
		}
		let cookie = document.cookie; //获取浏览器的token
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
} catch (e) {
	Authorization = "";
}

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
	serverUrl: debug ? "http://192.168.31.80" : "", //服务器地址
	Authorization: debug ? "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzODQ1MzM3OTY3NDEiLCJqdGkiOiI4ZTEyMzcwMC1hZGMzLTQ5OTUtODU0Mi01MjIwODZjMjMyOGIiLCJpYXQiOjE0ODk4MDU4NTcsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4OTgwNTg1NywiZXhwIjoxNDkxMDE1NDU3LCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.ESY_j0EAvWpoNRJP0ExHBVKnobeUtZzDn1uCwgar1lg" : Authorization,

	showFooter: true, //是否显示底部

	pageIndex: 0, //首页页面索引
	CarInfo: [],
	PeopleInfo: [],

	Province: [], //全国省份
	City: [], //市
	District: [], //区
	Village: [], //村

	myPublish: [], //我的发布
	UserInfo: null, //用户信息
}

let postData = (url, data) => {
	return fetch(state.serverUrl + url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: state.Authorization
			},
			body: JSON.stringify(data)
		})
		.then(checkStatus)
		.then(result => result.json())
}

let getData = (url) => {
	return fetch(state.serverUrl + url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: state.Authorization
			}
		})
		.then(checkStatus)
		.then(result => result.json())
}

// getters,获取数据
// 调用方法如下
// this.$store.getters.getIsFirst
const getters = {
	Development: state => state,
	getFooterState: state => state.showFooter,
	getPageIndex: state => state.pageIndex,
	getCarInfo: state => state.CarInfo,
	getPeopleInfo: state => state.PeopleInfo,

	getProvince: state => state.Province,
	getCity: state => state.City,
	getDistrict: state => state.District,
	getVillage: state => state.Village,

	getMyPublish: state => state.myPublish,
	getUserInfo: state => state.UserInfo
}

// actions
// 调用方法:
// this.$store.dispatch("cancelOrder",数据)
const actions = {
	/** 设置底部显示隐藏 */
	setFooterStatus({ commit, state }, data) {
		commit(types.CHANGE_FOOTER, {
			showFooter: data,
		})
	},
	/** 设置页面索引 */
	setPageInfo({ commit, state }, data) {
		commit(types.SET_PAGE_INDEX, {
			pageIndex: data,
		})
	},
	/** 获取自己的发布信息 */
	getUserInfo({ commit, state }, data) {
		return getData("/api/Transport/UserRelevant", data).then(result => {
			let userinfo = result.Data.Userinfo;
			commit(types.SET_USERINFO, {
				UserInfo: userinfo
			})
		})
	},
	/** 获取车主的列表信息 */
	getCarInfo({ commit, state }, data) {
		return postData("/api/CarPool/ListDre", data)
			.then(result => {
				let res = result.Data;
				commit(types.GET_CAR_INFO, {
					CarInfo: res,
					isRefresh: data.isRefresh ? true : false
				});
				return res;
			})
	},
	/** 倒叙数组 */
	setCarInfoReverse({ commit, state }, data) {
		return postData("/api/CarPool/ListDre", data)
			.then(result => {
				let res = result.Data;
				commit(types.GET_CAR_INFO, {
					CarInfo: res,
					isRefresh: data.isRefresh ? true : false
				});
				return data;
			})
			// commit(types.REVERSE_CARINFO);
	},
	/** 获取乘客信息 */
	getPeopleInfo({ commit, state }, data) {
		return postData("/api/CarPool/ListPassenger", data)
			.then(result => {
				let res = result.Data;
				commit(types.GET_PEOPLE_INFO, {
					PeopleInfo: res,
					isRefresh: data.isRefresh ? true : false
				})
				return res;
			})
	},
	/** 倒叙数组 */
	setPeopleInfoReverse({ commit, state }, data) {
		return postData("/api/CarPool/ListPassenger", data)
			.then(result => {
				let res = result.Data;
				commit(types.GET_PEOPLE_INFO, {
					PeopleInfo: res,
					isRefresh: data.isRefresh ? true : false
				})
				return data;
			})
			// commit(types.REVERSE_PEOPLEINFO);
	},
	/** 获取车主发布的信息 */
	getTripDetail({ commit, state }, data) {
		return getData("/api/CarPool/GetDre?id=" + data)
	},
	/** 获取乘客发布的信息 */
	getTripDetailPeople({ commit, state }, data) {
		return getData("/api/CarPool/GetPassenger?id=" + data)
	},
	/** 获取全国省数据  */
	getProvince({ commit, state }) {
		return fetch('http://restapi.amap.com/v3/config/district?key=b3940f216e45bcb33a0a50154c470fd6&keywords=中国&subdistrict=1', {
				method: 'GET',
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				let res = result.districts[0].districts;
				commit(types.GET_PROVINCE, {
					Province: res,
				});
			})
	},
	/** 获取省的市数据  */
	getCity({ commit, state }, data) {
		return fetch('http://restapi.amap.com/v3/config/district?key=b3940f216e45bcb33a0a50154c470fd6&subdistrict=1&keywords=' + data, {
				method: 'GET',
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				if (result.districts.length !== 0) {
					let res = result.districts[0].districts;
					commit(types.GET_CITY, {
						City: res,
					});
				}
			})
	},
	/** 获取市的区数据  */
	getDistrict({ commit, state }, data) {
		return fetch('http://restapi.amap.com/v3/config/district?key=b3940f216e45bcb33a0a50154c470fd6&subdistrict=1&keywords=' + data, {
				method: 'GET',
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				if (result.districts.length !== 0) {
					let res = result.districts[0].districts;
					commit(types.GET_DISTRICT, {
						District: res,
					});
				}
			})
	},
	/** 获取区数据  */
	getVillage({ commit, state }, data) {
		return fetch('http://restapi.amap.com/v3/config/district?key=b3940f216e45bcb33a0a50154c470fd6&subdistrict=1&keywords=' + data, {
				method: 'GET',
			})
			.then(checkStatus)
			.then(result => result.json())
			.then(result => {
				if (result.districts.length !== 0) {
					let res = result.districts[0].districts;
					commit(types.GET_VILLAGE, {
						Village: res,
					});
				}
			})
	},
	/** 获取用户输入后搜索得到的信息 */
	getStartSearch({ commit, state }, data) {
		return fetch(`https://restapi.amap.com/v3/place/text?key=760ee992f02825b935228aa35a2c8be9&children=1&city=广东&offset=20&keywords=${data.text}&page=${data.page}&extensions=all`, {
				method: 'GET',
			})
			.then(checkStatus)
			.then(result => result.json())
	},
	/** 获取用户输入后搜索得到的信息 */
	getEndSearch({ commit, state }, data) {
		return fetch(`https://restapi.amap.com/v3/place/text?key=760ee992f02825b935228aa35a2c8be9&children=1&city=广东&offset=20&keywords=${data.text}&page=${data.page}`, {
				method: 'GET',
			})
			.then(checkStatus)
			.then(result => result.json())
	},
	/** 乘客发布行程 */
	publishPassengerTrip({ commit, state }, data) {
		return postData("/api/CarPool/PublishRoute", data)
	},
	/** 司机发布行程 */
	publishCarTrip({ commit, state }, data) {
		return postData("/api/CarPool/PublishTravel", data)
	},
	/** 获取自己的发布乘客信息 */
	getMyPublishPassengerTrip({ commit, state }, data) {
		data.UsrId = state.UserInfo.Id;
		return postData("/api/CarPool/ListPassenger", data).then(result => {
			commit(types.SET_MYPUBLISH, result.Data);
			return result.Data;
		})
	},
	/** 获取自己的发布司机信息 */
	getMyPublishCarTrip({ commit, state }, data) {
		data.UsrId = state.UserInfo.Id;
		return postData("/api/CarPool/ListDre", data).then(result => {
			commit(types.SET_MYPUBLISH, result.Data);
			return result.Data;
		})
	},
	/** 设置位置 */
	setLocation({ commit, state }, data) {

	}
}

// mutations
// 改变数据,每一个类型对应一个操作
const mutations = {
	[types.CHANGE_FOOTER](state, data) {
		state.showFooter = data.showFooter;
	},
	[types.SET_USERINFO](state, data) {
		state.UserInfo = data.UserInfo;
	},
	[types.SET_PAGE_INDEX](state, data) {
		state.pageIndex = data.pageIndex;
	},
	[types.GET_CAR_INFO](state, data) {
		if (data.isRefresh) {
			state.CarInfo = data.CarInfo;
		} else {
			state.CarInfo = state.CarInfo.concat(data.CarInfo);
		}
	},
	[types.REVERSE_CARINFO](state, data) {
		state.CarInfo.reverse();
	},
	[types.GET_PEOPLE_INFO](state, data) {
		if (data.isRefresh) {
			state.PeopleInfo = data.PeopleInfo;
		} else {
			state.PeopleInfo = state.PeopleInfo.concat(data.PeopleInfo);
		}
	},
	[types.REVERSE_PEOPLEINFO](state, data) {
		state.PeopleInfo.reverse();
	},
	[types.SET_MYPUBLISH](state, data) {
		state.myPublish = state.myPublish.concat(data);
	},
	[types.GET_PROVINCE](state, data) {
		state.Province = data.Province;
	},
	[types.GET_CITY](state, data) {
		state.City = data.City;
	},
	[types.GET_DISTRICT](state, data) {
		state.District = data.District;
	},
	[types.GET_VILLAGE](state, data) {
		state.Village = data.Village;
	},
}

export default {
	state,
	getters,
	actions,
	mutations
}
