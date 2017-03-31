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

	/** 打印错误 */
	printInfo(info) {
		// 如果是调试模式
		if (this.isDebug) {
			alert(info)
		}
	}

	/** 设置用户信息 */
	setUserInfo(json) {
		this.UserInfo = json;
	}

	/** 获取用户信息 */
	getUserInfo() {
		if (this.inApp) {
			let info = "";
			try {
				info = window.jgkj_getUserInfo();
			} catch (e) {
				this.printInfo(e);
			}
			if (info && info !== "undefined") {
				this.UserInfo = JSON.parse(info); //格式为json
			}
		}
	}

	/** 打开一个链接 */
	loadPageUrl(url) {
		if (this.inApp) {
			try {
				window.jgke_loadPageUrl(url);
			} catch (e) {
				this.printInfo(e);
			}
		}
	}

	/** 打开一个原生界面 */
	openNativePage(androidPageName, iosPageName, json) {
		if (this.inApp) {
			try {
				window.jgkj_openNativePage(androidPageName, iosPageName, json);
			} catch (e) {
				this.printInfo(e);
			}
		}
	}

	/** 打开微信支付 */
	openWxPay(json) {
		if (this.inApp) {
			try {
				window.jgkj_openWxPay(json);
			} catch (e) {
				this.printInfo(e);
			}
		}
	}
}

export default App
