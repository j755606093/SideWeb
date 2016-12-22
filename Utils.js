// 删除页面script保护
// <meta content="script-src https: 'unsafe-inline' 'unsafe-eval' *.qq.com *.weishi.com 'nonce-836503595'" http-equiv="Content-Security-Policy"/>
function deleteSecurity(data){
	let step1 = data.replace(/<iframe.*<\/iframe>/g,"");//去掉iframe框架
	return step1.replace(/Content-Security-Policy/g,"");
}

// 插入自己的Script数据
function insertScript(data,name="test"){
	let app = "<div id='comment_id'></div>";
	let insertData = "<script src='/js/"+name+".js'></script>";
	return deleteSecurity(data).replace(/(<\/body>)/gi,app+insertData+"$1");
}

/** 删除所有的link标签 */
function deleteLinkTag(data){
	return data.replace(/<link.*>$/gi,"");
}

/** 删除所有的script */
function deleteScriptTag(data){
	return data.replace(/<script.*>.*<\/script>/gi,"");
}

// 插入自己的Css数据
function insertCss(data){
	let insertData = "<link href='js/test.js' rel='stylesheet'/>";
	return deleteSecurity(data).replace(/(<\/head>)/gi,insertData+"$1");
}

// 格式化服务器传过来的数据
function formatJSON(data=""){
	let dataType =  Object.prototype.toString.call(data).replace(/\[object (\w*)\]$/gi,"$1").toLowerCase();
	if(dataType==="object"){
		return data;
	}
	else{
		try{
			data = JSON.parse(data);
			return data;
		}
		catch(error){
			return null;
		}
	}
}

/**
 * 微信文章常用的组装函数
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function weixin(data){
	return insertScript(deleteLinkTag(deleteScriptTag(data)));
}

/**
 * 新闻常用的组装函数
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function news(data){
	// 不需要删除link标签
	return insertScript(deleteScriptTag(data));
}

module.exports = {
	weixin:weixin,
	news:news,
	formatJSON:formatJSON,
}