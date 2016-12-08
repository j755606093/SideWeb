/**
 * 格式化时间显示多久之前
 * @param  {[type]} data [Date对象]
 * @return {[type]}      [时间字符串]
 */
let formatDate = (date) =>{
	if(!date){
		return 0;
	}
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

module.exports = {
  formatDate: formatDate
}
