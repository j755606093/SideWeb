/**
 * 配置是否第一次进入(或者清除过缓存)
 */

let isFirst = wx.getStorageSync('isFirst');// 如果是第一次那么为空字符串
if(isFirst===""){
	wx.setStorageSync('isFirst', true);//设置第一次,文件最后需要设置为false
}
else{
	wx.setStorageSync('isFirst', false);//不是第一次
}

/**
 * 配置开发环境
 */

const debug = true;// 是否测试环境
const Access_Token = wx.getStorageSync('Access_Token');
if(Access_Token){
	// 根据是否测试环境生成的数据
	wx.setStorageSync('debugData', {
		serverUrl: debug ? "http://192.168.31.80" : "https://ticket.samecity.com.cn/api", //服务器地址
		headers:{
			'Content-Type': 'application/json',
			Authorization: debug?"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDE1OTE5MDIwMDYwMzEiLCJqdGkiOiJlNGNhY2U1NC0wZDJkLTQwOGYtOGIzMC1lM2FiYmJhYjUwMTYiLCJpYXQiOjE0ODMzNTAxMzAsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4MzM1MDEzMCwiZXhwIjoxNDg0NTU5NzMwLCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.cmj1ZyP3OWnbwuexFwW05_4xYHZ4D7LgTZhrl_He9Rs":Access_Token
		},
	});
}
else{
	// 根据是否测试环境生成的数据
	wx.setStorageSync('debugData', {
		serverUrl: debug ? "http://192.168.31.80" : "https://ticket.samecity.com.cn/api", //服务器地址
		headers:{
			'Content-Type': 'application/json',
			Authorization: debug?"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDE1OTE5MDIwMDYwMzEiLCJqdGkiOiJlNGNhY2U1NC0wZDJkLTQwOGYtOGIzMC1lM2FiYmJhYjUwMTYiLCJpYXQiOjE0ODMzNTAxMzAsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4MzM1MDEzMCwiZXhwIjoxNDg0NTU5NzMwLCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.cmj1ZyP3OWnbwuexFwW05_4xYHZ4D7LgTZhrl_He9Rs":""
		},
	});
}



/**
 * 配置全局数据
 */

const globalData={
	// 正式数据库
	startCity: {
		Code: "3385299",
		Name: "五经富",
	}, //出发地
	endCity: {
		Code: "3385290",
		Name: "深圳罗湖",
	}, //到达地

	startDate: {
		date: "",
		week: "",
		server: null
	}, //出发日期

	startCityList: [], //开始出发的城市列表
	endCityList: [], //到达的城市列表

	resultList: [], //搜索结果
	locationResult: "", //定位结果

	passenger: [], //乘客信息
	rebate: [], //优惠信息
	nopay: 0, //未支付订单数量
	phone: null, //取票人手机号
}

if(wx.getStorageSync('isFirst')){
	// 第一次进入就需要设置这些数据
	wx.setStorageSync('startCity', globalData.startCity);
	wx.setStorageSync('endCity', globalData.endCity);
	wx.setStorageSync('startDate', globalData.startDate);
	wx.setStorageSync('startCityList', globalData.startCityList);
	wx.setStorageSync('endCityList', globalData.endCityList);
	wx.setStorageSync('resultList', globalData.resultList);
	wx.setStorageSync('locationResult', globalData.locationResult);
	wx.setStorageSync('passenger', globalData.passenger);
	wx.setStorageSync('rebate', globalData.rebate);
	wx.setStorageSync('nopay', globalData.nopay);
	wx.setStorageSync('phone', globalData.phone);
	// console.log("第一次")
}

wx.setStorageSync('isFirst', false);//最后设置不是第一次

module.exports = {
	debug:debug
}