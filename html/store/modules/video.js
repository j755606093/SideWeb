/**
 * 数据中心
 * 这里包含了几乎所有的网络操作,因为需要token
 * 并且包含了调用公司app用户的token操作
 */
import types from '../VideoType'; //数据类型
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
if (typeof window.jgkj_getUserInfo !== "undefined") {
	var datastring = "";

	try {
		datastring = window.jgkj_getUserInfo();
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
	serverUrl: debug ? "http://192.168.31.86" : "", //服务器地址
	Authorization: debug ? "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzODQ1MzM3OTY3NDEiLCJqdGkiOiI4ZTEyMzcwMC1hZGMzLTQ5OTUtODU0Mi01MjIwODZjMjMyOGIiLCJpYXQiOjE0ODk4MDU4NTcsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4OTgwNTg1NywiZXhwIjoxNDkxMDE1NDU3LCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.ESY_j0EAvWpoNRJP0ExHBVKnobeUtZzDn1uCwgar1lg" : Authorization,

	HotVideo: [],
	SideVideo: [],
	FunnyVideo: [],
	EducateVideo: [],
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
	getHotVideo: state => state.HotVideo,
	getSideVideo: state => state.SideVideo,
	getFunnyVideo: state => state.FunnyVideo,
	getEducateVideo: state => state.EducateVideo,
	getVideoDetail: state => state.VideoDetail
}

// actions
// 调用方法:
// this.$store.dispatch("cancelOrder",数据)
const actions = {
	/** 获取热门视频列表 */
	getHotVideoList({ commit, state }, data) {
		return postData("/api/SVideo/GetList", {
			ClassifyId: 1,
			Index: data.Index,
			Size: 10
		}).then(result => {
			if (result.Data) {
				commit(types.ADD_HOT_VIDEO, result.Data);
			}
			return result;
		})
	},
	/** 获取身边视频列表 */
	getSideVideoList({ commit, state }, data) {
		return postData("/api/SVideo/GetList", {
			ClassifyId: 2,
			Index: data.Index,
			Size: 10
		}).then(result => {
			if (result.Data) {
				commit(types.ADD_SIDE_VIDEO, result.Data);
			}
			return result;
		})
	},
	/** 获取搞笑视频列表 */
	getFunnyVideoList({ commit, state }, data) {
		return postData("/api/SVideo/GetList", {
			ClassifyId: 3,
			Index: data.Index,
			Size: 10
		}).then(result => {
			if (result.Data) {
				commit(types.ADD_FUNNY_VIDEO, result.Data);
			}
			return result;
		})
	},
	/** 获取教育视频列表 */
	getEducateVideoList({ commit, state }, data) {
		return postData("/api/SVideo/GetList", {
			ClassifyId: 4,
			Index: data.Index,
			Size: 10
		}).then(result => {
			if (result.Data) {
				commit(types.ADD_EDUCATE_VIDEO, result.Data);
			}
			return result;
		})
	},
	/** 获取视频详细信息 */
	getVideoDetail({ commit, state }, data) {
		return postData("/api/SVideo/GetSVideoDetail", data)
	}
}

// mutations
// 改变数据,每一个类型对应一个操作
const mutations = {
	[types.ADD_HOT_VIDEO](state, data) {
		state.HotVideo = data;
	},
	[types.ADD_SIDE_VIDEO](state, data) {
		state.SideVideo = data;
	},
	[types.ADD_FUNNY_VIDEO](state, data) {
		state.FunnyVideo = data;
	},
	[types.ADD_EDUCATE_VIDEO](state, data) {
		state.EducateVideo = data;
	},
}

export default {
	state,
	getters,
	actions,
	mutations
}
