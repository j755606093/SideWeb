// 删除页面script保护
// <meta content="script-src https: 'unsafe-inline' 'unsafe-eval' *.qq.com *.weishi.com 'nonce-836503595'" http-equiv="Content-Security-Policy"/>
function deleteSecurity(data){
	//去掉iframe框架
	let step1 = data.replace(/<iframe.*<\/iframe>/g,"");
	/** 删除所有的link标签 */
	let step2 = step1.replace(/<link.*>/gi,"");
	// 去掉网页保护
	return step2.replace(/Content-Security-Policy/g,"");
}

// 插入自己的Script数据
function insertScript(data){
	let insertData = "<script src='/js/test.js'></script>";
	return deleteSecurity(data).replace(/(<\/body>)/gi,insertData+"$1");
}

// 插入自己的Css数据
function insertCss(data){
	let insertData = "<link href='js/test.js' rel='styleshe et'/>";
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

module.exports = {
	deleteSecurity:deleteSecurity,
	insertScript:insertScript,
	insertCss:insertCss,
	formatJSON:formatJSON
}