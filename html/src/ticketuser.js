import Vue from "vue";
// Vue.use(require('vue-resource'));//引用ajax库
require("../css/ticketuser.css");
import "whatwg-fetch";
const _ = require("underscore");
import { MessageBox, Toast, Indicator, Popup, Tabbar, Navbar, TabItem, TabContainer, TabContainerItem } from 'mint-ui';
import 'mint-ui/lib/style.css';
import Utils from "../Utils/utils";

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
		Authorization: debug ? "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDE1OTE5MDIwMDYwMzEiLCJqdGkiOiI3YjA5YmUzMy1mNmE5LTRhYWEtOGQ1OS00M2MwNTQ1NWFlMjciLCJpYXQiOjE0ODQ1NjQyNTMsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4NDU2NDI1MiwiZXhwIjoxNDg1NzczODUyLCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.BKUUCZKNKyAfayx2qfYFbdLOLa8123L6jvjHGwj1t3Y" : Authorization
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
		UserInfo: {}, //用户信息
		discountVisible: false, //优惠券列表显示
		isNoPay: 0, //未支付订单个数
		OrderType: {
			OrderList: [], //订单数据
			noMoreData: false, //是否还有订单数据
			isUse: false, //刷新函数是否使用中
			index: 1, //数据页面
		}, //全部订单
		OrderType1: {
			OrderList: [], //订单数据
			noMoreData: false, //是否还有订单数据
			isUse: false, //刷新函数是否使用中
			index: 1, //数据页面
		}, //未支付订单
		OrderType2: {
			OrderList: [], //订单数据
			noMoreData: false, //是否还有订单数据
			isUse: false, //刷新函数是否使用中
			index: 1, //数据页面
		}, //已支付订单
		OrderType3: {
			OrderList: [], //订单数据
			noMoreData: false, //是否还有订单数据
			isUse: false, //刷新函数是否使用中
			index: 1, //数据页面
		}, //待出行订单

		UseOrderType: 0, //使用中的订单列表,默认是全部订单0
		OrderList: [], //显示订单数据,需要赋值

		orderVisible: false, //是否显示订单列表
		passengerVisible: false, //乘客列表

		passengerName: "", //新增乘客姓名
		passengerPhone: "", //新增乘客手机号
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
				this.UserInfo = result.Userinfo;
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
			this.passengerVisible = false;
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
			return fetch(config.serverUrl + "/api/Transport/UserRelevant", {
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
		showOrderList(type = "") {
			this.controlHeader(true, "订单");
			this.UseOrderType = type === '' ? 0 : type;
			if (this["OrderType" + type].OrderList.length === 0) {
				// 只有长度为0的时候也就是第一次才加载数据
				// 否则每次点击都加载一次数据bug了
				this.getOrderData(type);
			}
			this.OrderList = this["OrderType" + type].OrderList;
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
		getOrderData(type = "") {
			if (this["OrderType" + type].noMoreData || this["OrderType" + type].isUse) {
				return;
			}
			this["OrderType" + type].isUse = true; //锁住这个函数
			this.loading();
			fetch(config.serverUrl + "/api/Order/List", {
					method: "POST",
					headers: config.headers,
					body: JSON.stringify({
						Index: this["OrderType" + type].index,
						Size: 10,
						Type: type === "" ? 0 : type
					})
				})
				.then(checkStatus)
				.then(result => result.json())
				.then(result => {
					if (result.Data) {
						// if (result.Data.length < 10) {
						// 	// 说明没有跟多数据了
						// 	this["OrderType" + type].noMoreData = true;
						// 	this.toast("已经没有的更多数据了...");
						// }
						for (let i = 0; i < result.Data.length; i++) {
							this["OrderType" + type].OrderList.push(result.Data[i]);
						}
					} else {
						this["OrderType" + type].noMoreData = true;
						this.toast(result.Message);
					}

					this["OrderType" + type].isUse = false; //释放这个函数
					this["OrderType" + type].index++;
					Indicator.close();
				})
		},
		openOrder(index) {
			let type = this.UseOrderType === 0 ? '' : this.UseOrderType; //0,1,2,3
			let Id = this["OrderType" + type].OrderList[index].Id;
			window.location.href = "/wx/TicketOrder.html?orderid=" + Id;
		},
		/**
		 * 显示乘客
		 * @return {[type]} [description]
		 */
		showPassengerList() {
			this.passengerVisible = true;
			this.controlHeader(true, "乘客列表");
		},
		// 新增乘客按钮
		addPassenger() {
			if (!Utils.isChinaName(this.passengerName) || this.passengerName.length < 2) {
				this.toast("请输入正确的姓名!");
				return;
			}
			if (!/^1[23578][0-9]{9}$/.test(this.passengerPhone)) {
				this.toast("请输入正确的手机号!");
				return;
			}

			fetch(config.serverUrl + "/api/Passenger/Add", {
					method: 'POST',
					headers: config.headers,
					body: JSON.stringify({
						Name: this.passengerName,
						Mobile: this.passengerPhone,
					})
				})
				.then(checkStatus)
				.then(result => result.json())
				.then(result => {
					if (result.Data) {
						let json = {};
						json.Name = this.passengerName;
						json.Mobile = this.passengerPhone;
						json.Id = result.Data;
						this.passengerPhone = "";
						this.passengerName = "";
						this.Passenger.push(json);
					} else {
						this.toast(result.Message);
					}
				})
		},
		trashPassenger(index) {
			MessageBox.confirm('确定执行此操作?').then(action => {
				fetch(config.serverUrl + "/api/Passenger/Delete/" + this.Passenger[index].Id, {
						headers: config.headers,
					})
					.then(checkStatus)
					.then(result => result.json())
					.then(result => {
						if (result.Data) {
							this.Passenger.splice(index, 1);
							this.toast("删除成功");
						} else {
							this.toast(result.Message);
						}
					})
			});
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
		let id = Vue_User.UseOrderType;
		Vue_User.getOrderData(id === 0 ? '' : id);
	}
}, 100, { leading: false }));
