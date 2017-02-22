import Vue from "vue";
// Vue.use(require('vue-resource'));//引用ajax库
require("../css/steward.css");
import "whatwg-fetch";
const _ = require("underscore");
import { MessageBox, Toast, Indicator, Popup } from 'mint-ui';
import 'mint-ui/lib/style.css';
import Utils from "../Utils/utils";

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

window.getData = (data) => {
	window.localStorage.setItem("UserInfo", "Bearer " + data);
}

if (typeof window.jgkj !== "undefined") {
	window.localStorage.setItem("UserInfo", "Bearer " + window.jgkj.getUserInfo());
	// window.UserInfo = JSON.parse(window.jgkj.getUserInfo());
}
if (typeof window.webkit !== "undefined") {
	window.webkit.messageHandlers.getUserInfo.postMessage(['getData', ]);
}

/**
 * 从cookie中拿tooken,兼容有些浏览器没有设置cookie
 * @param  {[type]} ) {	let        cookie [description]
 * @return {[type]}   [description]
 */
const Authorization = (function() {
	if (window.localStorage.getItem("UserInfo")) {
		// app中
		let string = window.localStorage.getItem("UserInfo");
		// Toast({
		// 	message: JSON.parse(string).Access_Token,
		// 	position: 'center',
		// 	duration: 10000
		// })
		return JSON.parse(string).Access_Token;
	}
	let cookie = document.cookie;
	if (cookie === "") {
		return cookie;
	}

	let arrayCookie = cookie.split(";");

	for (let i = 0; i < arrayCookie.length; i++) {
		let item = arrayCookie[i].split("=");

		let key = item[0].trim();
		if (key === "access_token") {
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
			window.location.href = "/api/oauth2/Index?returnUrl=https://ticket.samecity.com.cn/wx/ticket.html";
		} else {
			Indicator.close();
			alert("服务器繁忙,请稍后再试...")
		}
		return response;
	}
}

const config = {
	headers: {
		'Content-Type': 'application/json',
		Authorization: debug ? "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDE1OTE5MDIwMDYwMzEiLCJqdGkiOiIxNTI5ODg0My0xZTFjLTQ3MTYtOTNkZC01ZTE4MTQ1MmNlMzEiLCJpYXQiOjE0ODc0MDM0OTUsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4NzQwMzQ5NCwiZXhwIjoxNDg4NjEzMDk0LCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.41txARQUeaY18pPFH-kl-gxmmY2Q0XYN9v9FMAASu4c" : Authorization
	},
	serverUrl: debug ? "http://192.168.31.80" : ""
}

const Vue_User = new Vue({
	el: "#app",
	data: {
		ready: false, //页面为准备好
		headerTitle:"已验票乘客(0/3)",
		haveId:false,//url上有这个id
		optionsPassenger:[],//可以选择乘车的乘客
		OrderDetail: {}, //订单详细信息
		Passengers: [], //乘客数据
	},
	created() {
		if (this.getQueryString("orderid")) {
			// 需要显示订单详细信息
			this.loading();
			this.getOrderInfo(this.getQueryString("orderid"));
			this.haveId = true;
		}
		this.ready = true;
	},
	mounted() {
		
	},
	watch: {

	},
	methods: {
		loading() {
			Indicator.open({
				spinnerType: 'fading-circle'
			});
		},
		toast(title) {
			Toast({
				message: title,
				position: 'bottom',
				duration: 3000
			});
		},
		getQueryString(name) {
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			let r = window.location.search.substr(1).match(reg);
			if (r !== null) {
				return unescape(r[2]);
			}
			return null;
		},
		getOrderInfo(id) {
			return fetch(config.serverUrl + "/api/Order/Get", {
					method: "POST",
					headers: config.headers,
					body: JSON.stringify({
						OrderId: id
					})
				}).then(result => result.json())
				.then(result => {
					this.OrderDetail = result.Data;
					// this.passenger = [];
					this.optionsPassenger = [];
					for (let i = 0; i < this.OrderDetail.Passengers.length; i++) {
						let item = this.OrderDetail.Passengers[i];
						if (item.Status === -3) {
							item.Name = item.Name + "(已退款)";
							// this.passenger.push(item);
							item.vaild = true;//不能上车
							// continue; //这个乘客已经退款就不显示
						}
						if (item.Status === -1) {
							item.Name = item.Name + "(审核中)";
							// this.passenger.push(item);
							item.vaild = true;//不能上车
						}
						if (item.Status === -2) {
							item.Name = item.Name + "(待退款)";
							// this.passenger.push(item);
							item.vaild = true;//不能上车
						}
						if (item.Status === 1) {
							// this.passenger.push(item);
							item.vaild = false;//能上车
						}

						this.optionsPassenger.push({ Name: item.Name,Mobile:item.Mobile, Price: item.Price, DId: item.DId, active: false,vaild:item.vaild }); //提供申请退款选择的用户名
					}
					Indicator.close();
				})
		},
		selectUp(index){
			if(this.optionsPassenger[index].vaild){
				// 不是可选的
				return;
			}
			this.Passengers = [];
			this.optionsPassenger[index].active = !this.optionsPassenger[index].active;
			
			this.optionsPassenger.map((item,index)=>{
				if(item.active){
					this.Passengers.push(item);
				}
			})
		},
		selectAll(){
			this.Passengers = [];
			this.optionsPassenger.map((item,index)=>{
				item.active = true;
				this.Passengers.push(item);
			})
		}
	},
	components: {
		"mt-popup": Popup,
	}
});
