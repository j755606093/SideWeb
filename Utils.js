function clearHTML(html){
	this.html = html;
}

// 删除页面script保护
clearHTML.prototype.deleteSecurity = function(){
	this.html = this.html.replace(/<iframe.*<\/iframe>/g,"");//去掉iframe框架
	this.html = this.html.replace(/Content-Security-Policy/g,"");
	return this;
}

/** 插入自己的Script数据 */
clearHTML.prototype.insertScript = function(jsname){
	let app = "<div id='comment_id'></div>";
	let insertData = "<script src='/js/"+jsname+".js'></script>";
	this.html = this.html.replace(/(<\/body>)/gi,app+insertData+"$1"); 
	return this;
}

/** 删除所有的link标签 */
clearHTML.prototype.deleteLinkTag = function(){
	this.html = this.html.replace(/<link.*>$/gi,"");
	return this;
}

/** 删除所有的script */
clearHTML.prototype.deleteScriptTag = function(){
	this.html = this.html.replace(/<script.*>.*<\/script>/gi,"");
	return this;
}

// 插入自己的Css数据
clearHTML.prototype.insertCss = function(cssname){
	let insertCss = "<link href='js/"+cssname+".css' rel='stylesheet'/>";
	this.html = this.html.replace(/(<\/head>)/gi,insertCss+"$1");
	return this;
}

// 显示数据
clearHTML.prototype.show = function(){
	return this.html;
}

/**
 * 需要隐藏的id
 * js_sg_bar:底部阅读数
 * sg_tj:相关文章
 * sg_cmt_area:评论
 */
/** 隐藏这个id元素 */
clearHTML.prototype.hideById = function(id){
	if(typeof id==="object"){
		//如果是数组
		id.map((item,index)=>{
			let reg = new RegExp('id="'+item+'"',"g");
			this.html = this.html.replace(reg,"style='display:none;'");//同时覆盖了这个id
		})
	}
	else{
		let reg = new RegExp('id="'+id+'"',"g");
		this.html = this.html.replace(reg,"style='display:none;'");//同时覆盖了这个id
	}
	return this;
}

/**
 * 微信文章常用的组装函数
 */
function weixin(data){
	let html = new clearHTML(data);
	return html
		.deleteSecurity()
		.deleteScriptTag()
		.deleteLinkTag()
		.insertScript("test")
		.hideById(["js_sg_bar","sg_tj","sg_cmt_area"])
		.show();
}

/**
 * 新闻常用的组装函数
 */
function news(data){
	let html = new clearHTML(data);
	// 不需要删除link标签
	return html
		.insertScript()
		.deleteScriptTag()
		.show();
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
	weixin:weixin,
	news:news,
	formatJSON:formatJSON,
}