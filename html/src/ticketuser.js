import Vue from "vue";
// Vue.use(require('vue-resource'));//引用ajax库
require("../css/ticketuser.css");
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
		userVisible: false, //用户信息显示
		refundVisible: false, //申请退款显示
		helpVisible: false, //帮助中心显示

		passengerName: "", //新增乘客姓名
		passengerPhone: "", //新增乘客手机号

		RefundOrder: {
			RefundList: [],
			index: 1,
			isUse: false,
			noMoreData: false
		},
		helpContentShow: 0, //默认不显示任何一个
		showpassengeraction: 0, //修改增加乘客
		ChaPassengerIndex: 0,

		myModal:false,//自己的蒙版
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
			this.userVisible = false;
			this.refundVisible = false;
			this.helpVisible = false;
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
			if(this.UseOrderType===3){
				// 这是申请退款
				this.applyRefund();
				return;
			}
			else{
				this.refundVisible = false;
			}
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
			if (this.Rebate.length === 0) {
				MessageBox.alert("你没有优惠券", "提示")
				return;
			}
			this.controlHeader(true, "优惠券");
			this.discountVisible = true; //显示
		},
		/**
		 * 获取订单数据
		 * @return {[type]} [description]
		 */
		getOrderData(type = "") {
			if (type === 1 || type === 3) {
				//这两个列表是返回的全部数据,不需要再次获取
				if (this["OrderType" + type].OrderList.length !== 0) {
					return;
				}
			}
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
		addPassenger(index = 0) {
			if (!Utils.isChinaName(this.passengerName) || this.passengerName.length < 2) {
				this.toast("请输入正确的姓名!");
				return;
			}
			if (!/^1[23578][0-9]{9}$/.test(this.passengerPhone)) {
				this.toast("请输入正确的手机号!");
				return;
			}

			if (index === 0) {
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
							this.toast("增加成功");
						} else {
							this.toast(result.Message);
						}
					})
			} else {
				fetch(config.serverUrl + "/api/Passenger/Modify", {
						method: 'POST',
						headers: config.headers,
						body: JSON.stringify({
							Name: this.passengerName,
							Mobile: this.passengerPhone,
							Id: this.Passenger[this.ChaPassengerIndex].Id
						})
					})
					.then(checkStatus)
					.then(result => result.json())
					.then(result => {
						if (result.Data) {
							let json = {};
							json.Name = this.passengerName;
							json.Mobile = this.passengerPhone;
							json.Id = this.Passenger[this.ChaPassengerIndex].Id;
							this.Passenger[this.ChaPassengerIndex] = json;
							this.passengerPhone = "";
							this.passengerName = "";
							this.toast("修改成功");
						} else {
							this.toast(result.Message);
						}
					})
			}

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
		},
		showUserInfo() {
			this.controlHeader(true, "用户信息");
			this.userVisible = true;
		},
		edit(index) {
			this.myModal = true;
			let title = "";
			let NickName = "";
			let Mobile = "";
			let Sex = "";
			switch (index) {
				case 0:
					title = "昵称";
					break;
					// case 1:
					// 	title = "姓名";
					// 	break;
				case 2:
					title = "手机号";
					break;
				case 3:
					title = "性别(男或女)";
					break;
			}

			MessageBox.prompt("修改" + title).then(({ value, action }) => {
				switch (index) {
					case 0:
						NickName = value;
						break;
						// case 1:
						// 	title = "姓名";
						// 	break;
					case 2:
						if(/^1[23578][0-9]{9}$/.test(value)){
							Mobile = value;
						}
						else{
							Mobile = "";
							value = "";
						}
						break;
					case 3:
						Sex = value;
						break;
				}
				if (value === "") {
					MessageBox.alert("请输入正确的" + title).then(result=>{
						this.myModal = false;
					});
					return;
				} else {
					fetch(config.serverUrl + "/api/Transport/UpdateUserInfo", {
							method: 'POST',
							headers: config.headers,
							body: JSON.stringify({
								NickName: NickName,
								Mobile: Mobile
							})
						})
						.then(checkStatus)
						.then(result => result.json())
						.then(result => {
							if (result.Code === 200) {
								if (index === 0) {
									// 修改昵称
									this.UserInfo.Nickname = value;
								}
								if (index === 2) {
									this.UserInfo.Mobile = value;
								}
							}
							MessageBox.alert(result.Message).then(result=>{
								this.myModal = false;
							});
						});
				}
			}).catch(error => {
				this.myModal = false;
				console.log(error);
			});
			// MessageBox("修改数据", "第" + index + "项")
			// console.log(index)
		},
		getRefund() {
			return fetch(config.serverUrl + "/api/Order/ListRefund", {
					method: 'POST',
					headers: config.headers,
					body: JSON.stringify({
						Index: this.RefundOrder.index,
						Size: 10,
						Status: -1, //不分状态
					})
				})
				.then(checkStatus)
				.then(result => result.json())
		},
		// 申请退款
		applyRefund() {
			// this.controlHeader(true, "申请退款");
			this.refundVisible = true;
			if (this.RefundOrder.noMoreData || this.RefundOrder.isUse) {
				return;
			}

			this.RefundOrder.isUse = true;
			this.loading();
			this.getRefund().then(result => {
				Indicator.close();

				if (result.Data) {
					for (let i = 0; i < result.Data.length; i++) {
						this.RefundOrder.RefundList.push(result.Data[i])
					}
					if (result.Data.length < 10) {
						// 没有更多数据
						this.RefundOrder.noMoreData = true;
					}
					this.RefundOrder.index++;
				} else {
					this.RefundOrder.noMoreData = true;
				}

				this.RefundOrder.isUse = false;
			})
		},
		showAddPassenger(index) {
			this.showpassengeraction = 1;
			this.ChaPassengerIndex = index; //记录修改的位置
		},
		showChaPassenger(index) {
			this.showpassengeraction = 2;
			this.ChaPassengerIndex = index; //记录修改的位置

			this.passengerName = this.Passenger[index].Name;
			this.passengerPhone = this.Passenger[index].Mobile;
		},
		helpCenter() {
			this.controlHeader(true, "帮助中心");
			this.helpVisible = true;
		},
		showHelpContent(index) {
			if (index === this.helpContentShow) {
				this.helpContentShow = 0;
			} else {
				this.helpContentShow = index;
			}

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

// document.getElementById("refund-lists").addEventListener('scroll', _.throttle(function() {
// 	let refundVisible = Vue_User.refundVisible;
// 	let status_refund = document.getElementById("last_refund").offsetTop - document.getElementById("refund-lists").scrollTop;

// 	if (status_refund < 1000 && refundVisible) {
// 		Vue_User.applyRefund();
// 	}
// }, 100, { leading: false }));
