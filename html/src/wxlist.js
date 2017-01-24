import Vue from "vue";
// Vue.use(require('vue-resource'));//引用ajax库
require("../css/wxlist.css");
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

//检查请求返回的状态
function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response
	} else {


		Indicator.close();
		alert("服务器繁忙,请稍后再试...")
		return response;
	}
}

const config = {
	headers: {
		'Content-Type': 'application/json',
	},
	serverUrl: debug ? "http://192.168.31.86" : "https://app.samecity.com.cn"
}

const Vue_WxList = new Vue({
	el: "#app",
	data: {
		ready: false, //页面为准备好
		showHeader: false, //是否显示头部
		headerTitle: "微信公众号", //头部标题

		wxVisible: false, //显示公众号文章

		noClassIdData: {
			Index: 1,
			Lists: [],
			noMoreData: false,
			isUse: false,
		},

		showWxLists: [], //需要显示的列表数据

		showClassName: [], //公众号的类型
		defaultShowWx: [], //默认显示的公众号列表

		wxArticle: {
			List: [],
			Index: 1,
			noMoreData: false,
		}, //显示的公众号文章
	},
	created() {
		this.getAllData();
		// this.getAllClassData();
		// this.showHeader = true;
	},
	mounted() {
		// this.ready = true;
	},
	watch: {
		wxVisible(value) {
			if (value) {
				this.headerTitle = "公众号文章";
				this.showHeader = true;
			} else {
				this.showHeader = false;
				this.headerTitle = "微信公众号";
			}
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
		//回退界面
		GoBack(title = "微信公众号") {
			this.headerTitle = title;
			this.wxVisible = false;
		},
		getQueryString(name) {
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			let r = window.location.search.substr(1).match(reg);
			if (r !== null) {
				return unescape(r[2]);
			}
			return null;
		},
		// 获取所有的不分id列表
		getAllData() {
			if (this.noClassIdData.noMoreData || this.noClassIdData.isUse) {
				return;
			}

			this.loading();
			this.noClassIdData.isUse = true;

			fetch(config.serverUrl + "/api/Wechat/AcctList", {
					method: "POST",
					headers: config.headers,
					body: JSON.stringify({
						Index: this.noClassIdData.Index,
						Size: 10
					})
				})
				.then(checkStatus)
				.then(result => result.json())
				.then(result => {
					if (result.Data) {
						for (let i = 0; i < result.Data.length; i++) {
							this.noClassIdData.Lists.push(result.Data[i]);
						}
						this.showWxLists = this.noClassIdData.Lists;

						if (result.Data.length < 10) {
							this.noClassIdData.noMoreData = true;
						}
					} else {
						this.noClassIdData.noMoreData = true;
					}

					this.noClassIdData.Index++;
					this.noClassIdData.isUse = false;
					Indicator.close();
				})
				.then(result => {
					this.ready = true;
				})
		},
		getAllClassData() {
			fetch(config.serverUrl + "/api/Wechat/Index")
				.then(checkStatus)
				.then(result => result.json())
				.then(result => {
					if (result.Data) {
						for (let i = 0; i < result.Data.Classify.length; i++) {
							this.showClassName.push(result.Data.Classify[i]);
						}
						for (let j = 0; j < result.Data.Wechat.length; j++) {
							this.defaultShowWx.push(result.Data.Wechat[j]);
						}
						this.showWxLists = this.defaultShowWx;
					}
				})
				.then(result => {
					this.ready = true;
				})
		},
		getWxChatList(id) {
			if (id) {
				// 有id数据就说明这个是点击的
				this.wxArticle.Index = 1; //清空数据
				this.wxArticle.List = [];
				this.wxArticle.noMoreData = false;
			}

			this.loading();

			fetch(config.serverUrl + "/api/Topic/List", {
					method: "POST",
					headers: config.headers,
					body: JSON.stringify({
						WechatId: id,
						Index: this.wxArticle.Index,
						Size: 10
					})
				})
				.then(checkStatus)
				.then(result => result.json())
				.then(result => {
					if (result.Data) {
						for (let i = 0; i < result.Data.length; i++) {
							this.wxArticle.List.push(result.Data[i]);
						}
					} else {
						this.wxArticle.noMoreData = true;
					}
					this.wxArticle.Index++;
				})
				.then(result => {
					Indicator.close();
					this.wxVisible = true;
				})
		},

		gotoPage(UniqueId) {
			window.location.href = "https://app.samecity.com.cn:3000/api/GetTopic?id=" + UniqueId
		}
	},
	components: {
		"mt-popup": Popup,
	}
});

window.onscroll = _.throttle(function() {
	let headerTitle = Vue_WxList.headerTitle;
	let status = document.getElementById("record").offsetTop - document.body.scrollTop;
	console.log(status)

	if (status < 1000 && headerTitle === "微信公众号") {
		Vue_WxList.getAllData();
	}
}, 100, { leading: false })

document.getElementById("wx-lists").addEventListener('scroll', _.throttle(function() {
	let headerTitle = Vue_WxList.headerTitle;
	let status_list = document.getElementById("record_list").offsetTop - document.getElementById("wx-lists").scrollTop;

	if (status_list < 1000 && headerTitle !== "微信公众号") {
		Vue_WxList.getWxChatList();
	}
}, 100, { leading: false }));
