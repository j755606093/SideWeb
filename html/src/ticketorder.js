import Vue from "vue";
Vue.use(require('vue-resource')); //引用ajax库
require("../css/ticketorder.css");
import "whatwg-fetch";
const _ = require("underscore");
import { MessageBox, Toast, Indicator, Popup, Tabbar, Navbar, TabItem, TabContainer, TabContainerItem, Checklist } from 'mint-ui';
import 'mint-ui/lib/style.css';

Vue.component(TabContainer.name, TabContainer);
Vue.component(TabContainerItem.name, TabContainerItem);
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabItem.name, TabItem);
Vue.component(Navbar.name, Navbar);
Vue.component(Checklist.name, Checklist);

const debug = (function() {
	let test = false;
	let url = window.location.href;
	if (url.slice(0, 5) === "https") {
		test = false;
	} else {
		test = true;
	}
	return test;
})();

window.getData = (data) => {
	window.localStorage.setItem("UserInfo", "Bearer " + data);
}

if (typeof window.jgkj !== "undefined") {
	window.localStorage.setItem("UserInfo", "Bearer " + window.jgkj.getUserInfo());
	// window.UserInfo = JSON.parse(window.jgkj.getUserInfo());
}
// if (typeof window.webkit !== "undefined"&&typeof window.webkit.messageHandlers!=="undefined"&&typeof window.webkit.messageHandlers.getUserInfo!=="undefined") {
// 	window.webkit.messageHandlers.getUserInfo.postMessage(['getData', ]);
// }

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
		// var error = new Error(response.statusText)
		// error.response = response
		// throw error
		return response;
	}
}

const config = {
	headers: {
		'Content-Type': 'application/json',
		Authorization: debug ? "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDE1OTE5MDIwMDYwMzEiLCJqdGkiOiI4N2RkYmRlYy05ZWFiLTQ3MWItYjQwNy02ODY2OWVmN2NhMTEiLCJpYXQiOjE0ODg1OTE3NzAsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4ODU5MTc3MCwiZXhwIjoxNDg5ODAxMzcwLCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.28By9C5QI-QWINKeAHi57Pi0YMymQXeqi4VwbJJiTxE" : Authorization
	},
	serverUrl: debug ? "http://192.168.31.80" : ""
}

/** 刷新地址上的时间戳 */
const refreshLink = (function() {
	let linkTime = [];
	for (let i = 0; i < 3; i++) {
		linkTime.push(Date.now());
	}
	return linkTime;
})();

const Vue_Order = new Vue({
	el: "#app",
	data: {
		OrderList: [],
		index: 1, //页数
		noMoreData: false, //没有更多数据
		isUse: false, //是否使用中
		noDataShow: true, //没有订单数据

		OrderList1: [],
		index1: 1, //页数
		noMoreData1: false, //没有更多数据
		isUse1: false, //是否使用中
		noDataShow1: true, //没有订单数据

		ready: false, //是否准备显示
		Passengers: [], //乘客名数据,方便使用
		orderVisible: false,

		OrderDetail: {}, //订单详细信息
		passenger: [], //乘客数据

		selected: 1, //默认选择未支付

		countdown: null, //倒计时
		countdownTime: "", //倒计时显示
		storeCountTime: "", //剩余支付时间

		refundPassenger: false, //退款人选择
		refunndMoney: 0, //退款金额
		selectPassenger: [],
		optionsPassenger: [],
		codePopupVisible: false, //二维码

		myModal:false,//自己的蒙版

		refreshLink: refreshLink, //刷新页面地址
		code:"",//验证码的图片信息showQRCode(text).src
		showCode:false,//是否显示验证码
	},
	created() {
		this.ready = true;
		if (this.getQueryString("orderid")) {
			// 需要显示订单详细信息
			this.loading();
			this.getOrderInfo(this.getQueryString("orderid"));
			let id = this.getQueryString("orderid");
			this.code = window.showQRCode("http://ticket.samecity.com.cn/wx/steward.html?orderid="+id).src;//生成二维码链接
		}
		this.moreOrderData();
		this.moreOrderData1();

	},
	mounted() {
		
	},
	watch: {
		// 监控tab的变化
		// selected(val){
		// 	console.log(val)
		// }
		orderVisible(val){
			// if(val){
			// 	//复制
			// 	this.clipboard = new Clipboard('.copy');
			// 	this.clipboard.on('success',(e)=>{
			// 		this.toast("复制成功")
			// 	})
			// }
		}
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
		/** 查看url上数据 */
		getQueryString(name) {
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			let r = window.location.search.substr(1).match(reg);
			if (r !== null) {
				return unescape(r[2]);
			}
			return null;
		},
		/** 加载更多数据 */
		moreOrderData(empty = false) {
			if (this.noMoreData || this.isUse) {
				if(!empty){
					return;
				}
				this.index = 1;
			}
			this.isUse = true; //锁住这个函数
			this.loading();
			fetch(config.serverUrl + "/api/Order/List", {
					method: "POST",
					headers: config.headers,
					body: JSON.stringify({
						Index: this.index,
						Size: 10,
						Type: 1
					})
				})
				.then(checkStatus)
				.then(result => result.json())
				.then(result => {
					if (result.Data) {
						if (result.Data.length < 10) {
							// 说明没有跟多数据了
							this.noMoreData = true;
						}
						if (empty) {
							// 是否是刷新数据
							this.OrderList = result.Data;
						} else {
							for (let i = 0; i < result.Data.length; i++) {
								this.OrderList.push(result.Data[i]);
							}
						}


						this.noDataShow = false; //显示订单
					} else {
						this.noMoreData = true;
						if (this.index !== 1) {
							Toast({
								message: result.Message,
								position: 'bottom',
								duration: 3000
							});
						}
					}
					this.isUse = false; //释放这个函数
					this.index++;
					Indicator.close();
				})
				.then(()=>{
					this.canvas();
				})
		},
		/** 加载更多数据 */
		moreOrderData1(empty = false) {
			if (this.noMoreData1 || this.isUse1) {
				if(!empty){
					return;
				}
				this.index1 = 1;
			}
			this.isUse1 = true; //锁住这个函数
			this.loading();
			fetch(config.serverUrl + "/api/Order/List", {
					method: "POST",
					headers: config.headers,
					body: JSON.stringify({
						Index: this.index1,
						Size: 10,
						Type: 2
					})
				})
				.then(checkStatus)
				.then(result => result.json())
				.then(result => {
					if (result.Data) {
						if (result.Data.length < 10) {
							// 说明没有跟多数据了
							this.noMoreData1 = true;
						}
						if (empty) {
							this.OrderList1 = result.Data;
						} else {
							for (let i = 0; i < result.Data.length; i++) {
								this.OrderList1.push(result.Data[i]);
							}
						}
						this.noDataShow1 = false; //显示订单
					} else {
						this.noMoreData1 = true;
						if (this.index1 !== 1) {
							Toast({
								message: result.Message,
								position: 'bottom',
								duration: 3000
							});
						}

					}
					this.isUse1 = false; //释放这个函数
					this.index1++;
					Indicator.close();
				})
				.then(()=>{
					this.canvas();
				})
		},
		/** 打开一个订单 */
		openOrder(index) {
			this.loading();
			if (this.selected === 1) {
				this.getOrderInfo(this.OrderList[index].Id)
			} else {
				let id = this.OrderList1[index].Id;
				this.code = window.showQRCode("http://ticket.samecity.com.cn/wx/steward.html?orderid="+id).src;//生成二维码链接
				this.getOrderInfo(this.OrderList1[index].Id);
			}
		},
		/** 获取订单信息 */
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
					this.passenger = [];//显示乘客状态
					this.optionsPassenger = [];//提供申请退款选择的用户名
					for (let i = 0; i < this.OrderDetail.Passengers.length; i++) {
						let item = this.OrderDetail.Passengers[i];
						if (item.Status === -3) {
							item.Name = item.Name + "(已退款)";
							this.passenger.push(item);
							// continue; //这个乘客已经退款就不显示
						}
						if (item.Status === -1) {
							item.Name = item.Name + "(退款审核中)";
							this.passenger.push(item);
						}
						if (item.Status === -2) {
							item.Name = item.Name + "(待退款)";
							this.passenger.push(item);
						}
						if (item.Status === 1) {
							this.passenger.push(item);
							this.optionsPassenger.push({ Name: item.Name, Price: item.Price, DId: item.DId, active: false }); //提供申请退款选择的用户名
						}
						if (item.Status === 2) {
							item.Name = item.Name + "(已验票)";
							this.passenger.push(item);
						}
					}
					// this.passenger = this.passenger.slice(0, this.passenger.length - 1);
					Indicator.close();
					this.orderVisible = true;
					if (this.selected === 1) {
						// 只有未支付的情况下才倒计时
						this.CountDown();
					}
					if(this.OrderDetail.IsPay===1&&(this.OrderDetail.Status===2||this.OrderDetail.Status===4)){
						// 显示验证码
						this.showCode = true;
					}
					else{
						// 其它情况,不显示验证码
						this.showCode = false;
					}
				})
		},
		payMoney() {
			this.loading();
			let id = this.OrderDetail.Id;
			fetch(config.serverUrl + "/api/Order/PayOrder", {
					method: 'POST',
					headers: config.headers,
					body: JSON.stringify({
						OrderId: id
					})
				})
				.then(checkStatus)
				.then(result => result.json())
				.then(result => {
					Indicator.close();
					let paydata = result.Data;
					window.WeixinJSBridge.invoke("getBrandWCPayRequest", paydata, (r)=> {
						if (r.err_msg === "get_brand_wcpay_request:ok") {
							this.myModal = true;
							MessageBox.alert('支付成功').then(action => {
								this.myModal = false;
								this.goback();
								this.moreOrderData(true);
								this.moreOrderData1(true);
							});
						}
					});
				})
		},
		CountDown() {
			let time = new Date(this.OrderDetail.CTime).getTime() + 60 * 30 * 1000;
			let nowTime = Date.now();
			if(time-nowTime<1000){
				this.countdownTime = "已经失效";
				return;
			}
			this.storeCountTime = parseInt((time - nowTime) / 1000);
			// this.storeCountTime = 60*30-1;//半个小时
			this.countdown = setInterval(() => {
				if (this.storeCountTime <= 0) {
					clearInterval(this.countdown);
					this.countdown = null;
					this.countdownTime = "已经失效";
					return;
				}
				let minth = parseInt(this.storeCountTime / 60);
				let second = parseInt(this.storeCountTime % 60);
				if (minth < 10) {
					this.countdownTime = "0" + minth + ":";
				} else {
					this.countdownTime = minth + ":";
				}

				if (second < 10) {
					this.countdownTime = this.countdownTime + "0" + second;
				} else {
					this.countdownTime = this.countdownTime + second;
				}
				this.storeCountTime--;
			}, 1000)
		},
		goback() {
			if(this.getQueryString("orderid")){
				// 如果有这个说明是其他页面跳转过来的
				// 就直接跳转回去
				// history.back();
				window.location.href="./TicketUser.html?type="+this.getQueryString("type");
				return;
			}
			if (this.refundPassenger) {
				this.refundPassenger = false;
				return;
			}
			this.codePopupVisible = false;
			clearInterval(this.countdown);
			this.countdown = null;
			this.orderVisible = false;
		},
		cancelOrder() {
			this.myModal = true;
			MessageBox.confirm('确定取消订单?').then(action => {
				fetch(config.serverUrl + "/api/Order/Cancel", {
						method: "POST",
						headers: config.headers,
						body: JSON.stringify({
							OrderId: this.OrderDetail.Id
						})
					})
					.then(checkStatus)
					.then(result => result.json())
					.then(result => {
						MessageBox.alert('取消订单成功').then(res=>{
							this.myModal = false;
						});
						this.goback();
						if(!this.OrderList1){
							this.noMoreData = true;
							return;
						}
						for (let i = 0; i < this.OrderList1.length; i++) {
							if (this.OrderList[i].Id === this.OrderDetail.Id) {
								this.OrderList.splice(i, 1);
								if (this.OrderList[i].length === 0) {
									this.noMoreData = true;
								}
								break;
							}
						}
					})
			}).catch(error=>{
				this.myModal = false;
			});
		},
		inputRefund() {
			return MessageBox.prompt('请输入退款理由').then(({ value, action }) => {
				return value;
			}).catch(error=>{

			});
		},
		checkSelectPassenger() {
			// this.refundPassenger = false;
			this.myModal = true;
			if (this.selectPassenger.length === 0) {
				MessageBox.alert( "你未选择退款乘客").then(result=>{
					this.myModal = false;
				})
			} else {
				this.refund();
			}
		},
		showSelectPassenger() {
			let number = 0;
			for (let i = 0; i < this.OrderDetail.Passengers.length; i++) {
				let item = this.OrderDetail.Passengers[i];
				if (item.Status === 1) {
					number++;
				}
			}

			if (number===0) {
				// 说明没有乘客可以退款
				this.myModal = true;
				MessageBox.alert('订单中所有乘客都不满足退款条件!').then(result=>{
					this.myModal = false;
				});
			} else {
				this.refundPassenger = true;
			}
		},
		refund() {
			// /api/Order/Refund
			let id = this.OrderDetail.Id;
			let len = this.OrderDetail.Passengers.length;
			let DIds = [];
			if (len === 1) {
				//就全部退掉
				for (let i = 0; i < this.OrderDetail.Passengers.length; i++) {
					DIds.push(this.OrderDetail.Passengers[i].DId);
				}
			} else {
				//退掉用户选中的
				for (let i = 0; i < this.selectPassenger.length; i++) {
					DIds.push(this.selectPassenger[i]);
				}
			}

			this.inputRefund().then(result => {
					fetch(config.serverUrl + "/api/Order/Refund", {
							method: "POST",
							headers: config.headers,
							body: JSON.stringify({
								OrderId: id,
								DIds: DIds,
								Remark: result ? result : "用户未填写理由"
							})
						})
						.then(checkStatus)
						.then(result => result.json())
						.then(result => {
							if (result.Data) {
								// 申请成功
								MessageBox.alert('申请退款已提交').then(result=>{
									this.myModal = false;
									this.goback();//返回上一层
								});
								// 重新加载数据
								this.moreOrderData(true);
								this.moreOrderData1(true);
								this.orderVisible = false;//退出详情
							} else {
								MessageBox.alert(result.Message).then(result=>{
									this.goback();
									this.myModal = false;
								});
							}
						})
				})
				.catch(error => {
					MessageBox.alert('您取消申请退款').then(result=>{
						this.myModal = false;
					});
				})
		},
		/** 选择页面 */
		selectPage(index) {
			this.selected = index;
		},
		/** 打开验证码 */
		openCode() {
			this.codePopupVisible = true;
		},
		selectRefund(index) {
			this.optionsPassenger[index].active = !this.optionsPassenger[index].active;

			this.refunndMoney = 0;
			this.selectPassenger = [];
			this.optionsPassenger.map((item, i) => {
				if (item.active) {
					let money = item.Price - item.Price * 0.1;
					this.refunndMoney += money;
					this.selectPassenger.push(item.DId);
				}
			})
			this.refunndMoney = this.refunndMoney.toFixed(2);
		},
		selectRefundAll() {
			this.refunndMoney = 0;
			this.selectPassenger = [];
			this.optionsPassenger.map((item, i) => {
				item.active = true;
				let money = item.Price - item.Price * 0.1;
				this.refunndMoney += money;
				this.selectPassenger.push(item.DId);
			})
		},
		cancelModal(){
			this.codePopupVisible = false;
		},
		/** 画图 */
		canvas(){
			let topbody = document.getElementsByClassName("canvas-top");
			let bottombody = document.getElementsByClassName("canvas-bottom");

			for(let i=0;i<topbody.length;i++){
				let con = topbody[i].getContext("2d");
				con.arc(18,0,18,0,Math.PI*2);
				con.lineWidth = 2;
				con.fillStyle="#fafafa";
				con.strokeStyle="#c8c8c8";
				con.stroke();
				con.fill();

				let content = bottombody[i].getContext("2d");
				content.arc(18,20,18,0,Math.PI*2);
				content.lineWidth = 2;
				content.fillStyle="#fafafa";
				content.strokeStyle="#c8c8c8";
				content.stroke();
				content.fill();
			}
		}
	},
	components: {
		"mt-popup": Popup,
	}
});

window.addEventListener('scroll',_.throttle(function(){
	let selected = Vue_Order.selected;
	let status = document.getElementById("last").offsetTop-document.body.scrollTop;
	if(status<1000 && selected===1){
		Vue_Order.moreOrderData();
		// console.log('yes');
	}

	let status1 = document.getElementById("last1").offsetTop-document.body.scrollTop;
	if(status1<1000 && selected===2){
		Vue_Order.moreOrderData1();
		// console.log('yes');
	}
},100,{leading: false}));
