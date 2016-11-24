/**
 * 工具库
 * 包含常用的一些函数或者数据
 */

/**
 * 格式化时间显示多久之前
 * @param  {[type]} data [Date对象]
 * @return {[type]}      [时间字符串]
 */
let formatDate = (date) =>{
	const old = new Date(date);//转换为DATE对象
	const now = Date.now();
	let result = "";//存储结果

	let diffMinute = Math.floor((now - old)/1000/60);//相差的分钟数
	if(diffMinute<60){
		result = diffMinute + "分钟之前";
	}
	else{
		let diffHour = Math.floor((now - old)/1000/60/60);//相差的小时数
		if(diffHour<24){
			// 小于24小时
			// let diffHourMinute = Math.floor((now - old)/1000/60%60);//相差的分钟数
			result = diffHour + "小时之前";
		}
		else{
			let diffDay = Math.floor(diffHour/24);//相差的天数
			if(diffDay<30){
				result = diffDay + "天之前";
			}
			else{
				let diffMonth = Math.floor(diffDay/30);//相差的月数
				if(diffMonth<12){
					result = diffDay + "个月之前";
				}
				else{
					result = diffDay + "年之前";
				}
			}
		}
	}

	return result;
}

/**
 * 格式化日期格式:10-07 13:25
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
let formatTime = (date)=>{
	const formatDate = new Date(date);//转换为DATE对象

	const year = formatDate.getYear()-100+2000;//2016
	const month = formatDate.getMonth();//10
	const day = formatDate.getDay()>9?formatDate.getDay():"0"+formatDate.getDay();//04
	const hours = formatDate.getHours();//16
	const minute = formatDate.getMinutes()>9?formatDate.getMinutes():"0"+formatDate.getMinutes();//03
	const milliseconds = formatDate.getMilliseconds();//450

	return month+"-"+day+" "+hours+":"+minute;
}

/**
 * 获取浏览器中的参数
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
let getQueryString = (name)=>{ 
	let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'); 
	let r = window.location.search.substr(1).match(reg); 
	if (r !== null){ 
		return unescape(r[2]); 
	}
	return null; 
}

export default {
	formatDate:formatDate,
	formatTime:formatTime,
	getQueryString:getQueryString
}