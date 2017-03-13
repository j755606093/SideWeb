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

/**
 * 返回2016-05-05格式
 * @param  {[type]} date [description]
 * @return {[type]}      [description]
 */
let formatDateTypeOne = date =>{
	let show = date;
	if(typeof date==="string"){
		show = new Date(date);
	}
	
	let year = show.getYear()-100+2000;
	let month = show.getMonth()+1;
	let day = show.getDate();

	// return month+"月"+day+"日";
	return year+"-"+(month>9?month:"0"+month)+"-"+(day>9?day:"0"+day)
}

/**
 * 格式化日期格式:10-07 13:25
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
let formatTime = (date)=>{
	if(!date){
		return 0;
	}
	const formatDate = new Date(date);//转换为DATE对象

	const year = formatDate.getYear()-100+2000;//2016
	const month = formatDate.getMonth()+1;//10
	const day = formatDate.getDate()>9?formatDate.getDate():"0"+formatDate.getDate();//04
	const hours = formatDate.getHours();//16
	const minute = formatDate.getMinutes()>9?formatDate.getMinutes():"0"+formatDate.getMinutes();//03
	const milliseconds = formatDate.getMilliseconds();//450
	
	const week = formatDate.getDay();//获取星期,1

	return month+"-"+day+" "+hours+":"+minute;
}

/**
 * 获取当前星期
 * @param  {[type]} date [日期对象]
 * @return {[type]}      [周一]
 */
let formatWeek = date =>{
	let week = ["日","一","二","三","四","五","六"];
	return "周"+week[date.getDay()];
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

/**
 * 格式化vue中的变量成JSON数据
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
let formatJsonData = data => {
	return JSON.parse(JSON.stringify(data));
}

/**
 * 身份证验证
 * @param  {[type]} code [description]
 * @return {[type]}      [description]
 */
let IdentityCodeValid = code =>{
	const city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};

	if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
    return false;
  }
  else{
  	if(!city[code.substr(0,2)]){
  		return false;
  	}
  	else{
  		//验证身份证最后一位
  		code = code.split('');
      //∑(ai×Wi)(mod 11)
      //加权因子
      let factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
      //校验位
      let parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++){
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      let last = parity[sum % 11];
      if(parity[sum % 11] != code[17]){
        return false;
      }
  	}
  }
  return true;
}

/**
 * 检查是否中文名
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
let isChinaName = name => {
	return /^[\u4e00-\u9fa5]+$/i.test(name);
}

export default {
	formatDate:formatDate,
	formatTime:formatTime,
	getQueryString:getQueryString,
	formatWeek:formatWeek,
	formatJsonData:formatJsonData,
	IdentityCodeValid:IdentityCodeValid,
	isChinaName:isChinaName,
	formatDateTypeOne:formatDateTypeOne
}