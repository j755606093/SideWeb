import Vue from "vue";
// Vue.use(require('vue-resource'));//引用ajax库
require("../css/ticketuser.css");
import "whatwg-fetch";
const _ = require("underscore");
import { MessageBox, Toast, Indicator, Popup, Tabbar, Navbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui';
import 'mint-ui/lib/style.css'

// Vue.component(TabContainer.name, TabContainer);
// Vue.component(TabContainerItem.name, TabContainerItem);
// Vue.component(Tabbar.name, Tabbar);
// Vue.component(TabItem.name, TabItem);
// Vue.component(Navbar.name, Navbar);

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

	let arrayCookie = cookie.split(";");

	for (let i = 0; i < arrayCookie.length; i++) {
		let item = arrayCookie[i].split("=");

		let key = item[0];
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
			window.location.href = "/api/oauth2/Index?returnUrl=https://ticket.samecity.com.cn/wx/ticket.html#/";
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
		Authorization: debug ? "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDE1OTE5MDIwMDYwMzEiLCJqdGkiOiJlNGNhY2U1NC0wZDJkLTQwOGYtOGIzMC1lM2FiYmJhYjUwMTYiLCJpYXQiOjE0ODMzNTAxMzAsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4MzM1MDEzMCwiZXhwIjoxNDg0NTU5NzMwLCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.cmj1ZyP3OWnbwuexFwW05_4xYHZ4D7LgTZhrl_He9Rs" : Authorization
	},
	serverUrl: debug ? "http://192.168.31.80" : ""
}

const Vue_User = new Vue({
	el: "#app",
	data: {
		ready: false, //页面为准备好
		showHeader: false, //是否显示头部
		headerTitle: "用户中心", //头部标题

		Passenger: [], //乘客
		Rebate: [], //优惠券
		discountVisible: false, //优惠券列表显示
		isNoPay: 0, //未支付订单个数
		Order: {
			OrderList: [], //订单数据
			noMoreData: false, //是否还有订单数据
			isUse: false, //刷新函数是否使用中
			index: 1, //数据页面
		}, //订单

		orderVisible: false, //是否显示订单列表

	},
	created() {
		this.getUserInfo()
			.then(result => {
				if (result.Passengers) {
					this.Passenger = result.Passengers;
				}
				if (result.Rebates) {
					this.Rebate = result.Rebates;
				}
				this.isNoPay = result.NoPay;
				this.ready = true;
			})
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
		//回退界面
		GoBack(event, status = false, title = "用户中心") {
			this.controlHeader();
			this.orderVisible = false;
			this.discountVisible = false;
		},
		//控制头部显示和标题
		controlHeader(status = false, title = "用户中心") {
			this.showHeader = status;
			this.headerTitle = title;
		},
		getQueryString(name) {
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			let r = window.location.search.substr(1).match(reg);
			if (r !== null) {
				return unescape(r[2]);
			}
			return null;
		},
		// 获取用户信息,乘客信息,优惠券信息,是否有未支付订单的个数信息数据
		getUserInfo() {
			return fetch(config.serverUrl + "/api/Transport/UserRelevant/0", {
					headers: config.headers
				})
				.then(checkStatus)
				.then(result => result.json())
				.then(result => result.Data);
		},
		/**
		 * 显示订单列表
		 * @return {[type]} [description]
		 */
		showOrderList() {
			this.controlHeader(true, "全部订单");
			if (this.Order.OrderList.length === 0) {
				// 只有长度为0的时候也就是第一次才加载数据
				// 否则每次点击都加载一次数据bug了
				this.getOrderData();
			}
			this.orderVisible = true; //显示订单
		},
		/**
		 * 显示优惠券列表
		 * @return {[type]} [description]
		 */
		showDiscountList() {
			this.controlHeader(true, "优惠券");
			this.discountVisible = true; //显示
		},
		/**
		 * 获取订单数据
		 * @return {[type]} [description]
		 */
		getOrderData() {
			if (this.Order.noMoreData || this.Order.isUse) {
				return;
			}
			this.Order.isUse = true; //锁住这个函数
			this.loading();
			fetch(config.serverUrl + "/api/Order/List", {
					method: "POST",
					headers: config.headers,
					body: JSON.stringify({
						Index: this.Order.index,
						Size: 10,
						Type: 0
					})
				})
				.then(checkStatus)
				.then(result => result.json())
				.then(result => {
					if (result.Data) {
						if (result.Data.length < 10) {
							// 说明没有跟多数据了
							this.Order.noMoreData = true;
							this.toast("已经没有的更多数据了...");
						}
						for (let i = 0; i < result.Data.length; i++) {
							this.Order.OrderList.push(result.Data[i]);
						}
					} else {
						this.Order.noMoreData = true;
						this.toast(result.Message);
					}

					this.Order.isUse = false; //释放这个函数
					this.Order.index++;
					Indicator.close();
				})
		},
		openOrder(index) {
			console.log(index)
		}
	},
	components: {
		"mt-popup": Popup,
	}
});

document.getElementById("order-lists").addEventListener('scroll', _.throttle(function() {
	let orderVisible = Vue_User.orderVisible;
	let status = document.getElementById("last").offsetTop - document.getElementById("order-lists").scrollTop;

	if (status < 1000 && orderVisible) {
		Vue_User.getOrderData();
	}
}, 100, { leading: false }));
