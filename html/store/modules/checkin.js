/**
 * 数据中心
 * 这里包含了几乎所有的网络操作,因为需要token
 * 并且包含了调用公司app用户的token操作
 */
import types from '../CheckInType'; //数据类型
import "whatwg-fetch";
const _ = require("underscore");
import { Toast } from 'mint-ui';
import App from "../../Utils/App"; //关于app的一些函数
const app = new App();

/** 判断是本地测试还是线上生产环环境 */
const debug = (function() {
	let debug = false;
	let url = window.location.href;
	if (url.slice(0, 5) === "https") {
		return false;
	} else {
		return true;
	}
})();

if (!app.UserInfo) {
	app.setUserInfo({
		UserId: "10000001",
		Access_Token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDAwMDAwMSIsImp0aSI6ImI1N2I2MDY0LTM4NWMtNDMzYi1iMGI1LTQwN2EzZDAzYTU3NiIsImlhdCI6MTQ5MDg2OTM0MCwiTWVtYmVyIjoibm9ybWFsIiwibmJmIjoxNDkwODY5MzM5LCJleHAiOjE0OTIwNzg5MzksImlzcyI6IlN1cGVyQXdlc29tZVRva2VuU2VydmVyIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDoxNzgzLyJ9.jyenh6MEq7voYCFdwt4z9lesjf_tvLcKMJjqLe9IEcc"
	})
}

/**
 * 回调函数
 * @param  {[type]} action [description]
 * @param  {[type]} json   [description]
 * @return {[type]}        [description]
 */
function jgkj_JSCALLBACK(action, json) {
	console.log(action, json);
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
	Authorization: debug ? app.UserInfo.Access_Token : "Bearer " + app.UserInfo.Access_Token,

	UserInfo: app.UserInfo, //用户信息
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
	getUserInfo: state => state.UserInfo,
}

// actions
// 调用方法:
// this.$store.dispatch("cancelOrder",数据)
const actions = {
	/** 获取签到信息 */
	getCheckinInfo({ commit, state }) {
		return getData("/api/SignIn/GetSignInInfo/" + state.UserInfo.UserId)
	},
	/** 签到 */
	goToCheckIn({ commit, state }) {
		return getData("/api/SignIn/IntegIncret/" + state.UserInfo.UserId)
	},
	/** 获取赚积分信息 */
	getTaskInfo({ commit, state }) {
		return getData("/api/SignIn/GetPointTask/" + state.UserInfo.UserId)
	},
	/** 打开原生界面 */
	openNativePage({ commit, state }, data) {
		app.openNativePage(data.androidPageName, data.iosPageName, data.json);
	},
}

// mutations
// 改变数据,每一个类型对应一个操作
const mutations = {
	[types.CHANGE_FOOTER](state, data) {
		state.showFooter = data.showFooter;
	},
}

export default {
	state,
	getters,
	actions,
	mutations
}
