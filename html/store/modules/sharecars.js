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

/** 如果是app中android */
if (typeof window.jgkj !== "undefined") {
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

	HeaderStatus: false, //默认不显示头部
	showBack: true, //是否显示返回键
	HeaderTitle: "拼车", //头部标题
	showFooter: true, //是否显示底部
}

// getters,获取数据
// 调用方法如下
// this.$store.getters.getIsFirst
const getters = {
	Development: state => state,
	getHeaderState: state => state.HeaderStatus,
	getFooterState: state => state.showFooter
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

// actions
// 调用方法:
// this.$store.dispatch("cancelOrder",数据)
const actions = {
	/** 获取默认的出发点(没有到达点) */
	getCityDefault({ commit, state }) {
		return getData("/api/Transport/Index")
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
}

// mutations
// 改变数据,每一个类型对应一个操作
const mutations = {
	[types.CHANGE_HEADER](state, data) {
		// 设置头部状态显示
		state.HeaderIsHome = data.isHome;
		state.HeaderTitle = data.Title;
	},
}

export default {
	state,
	getters,
	actions,
	mutations
}
