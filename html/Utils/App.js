/**
 * 和app交互函数
 */

class App {
	constructor() {
		this.inApp = this.isInApp();
		this.Debug = this.isDebug();
		this.UserInfo = null;
		this.getUserInfo();
	}

	/** 判断是否app中 */
	isInApp() {
		return window.jgkj_getUserInfo ? true : false;
	}

	/** 是否是debug模式 */
	isDebug() {
		let debug = false;
		let url = window.location.href;
		if (url.slice(0, 5) === "https") {
			return false;
		} else {
			return true;
		}
	}

	/** 设置用户信息 */
	setUserInfo(json) {
		this.UserInfo = json;
	}

	/** 获取用户信息 */
	getUserInfo() {
		if (this.inApp) {
			let info = window.jgkj_getUserInfo();
			if (this.Debug) {
				alert(info)
			}
			if (info && info !== "undefined") {
				this.UserInfo = JSON.parse(info); //格式为json
			}
		}
	}

	/** 打开一个链接 */
	loadPageUrl(url) {
		if (this.inApp) {
			window.jgke_loadPageUrl(url);
		}
	}

	/** 打开一个原生界面 */
	openNativePage(androidPageName, iosPageName, json) {
		if (this.inApp) {
			window.jgkj_openNativePage(androidPageName, iosPageName, json);
		}
	}

	/** 打开微信支付 */
	openWxPay(json) {
		if (this.inApp) {
			window.jgkj_openWxPay(json);
		}
	}
}

export default App
