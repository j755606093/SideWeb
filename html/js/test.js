var insertDownload = '<div id="insertDownload" style="width:100%;height:50px;background-color: rgba(0,0,0,.6);position: fixed;bottom:0;left:0;display: none;"><p style="color:#fff;width:70%;margin-left: 2%;font-size: 14px;display: inline-block;text-align: center;height:50px;line-height: 25px;">你好像对这个内容很感兴趣,不如去下载这个APP吧,每天都有惊喜哦!</p><a style="position: absolute;;border:1px solid #fff;padding:5px;border-radius:5px;outline: none;background-color: transparent;color:#fff;top:10px;right:20px;font-size: 16px;">去下载</a></div>'

//插入到html中
var bodyHtml = document.body.innerHTML;
document.body.innerHTML = bodyHtml+insertDownload;
// document.body.insertAdjacentHTML("beforebegin",insertDownload);

setTimeout(function(){
	document.getElementById("insertDownload").style.display = "block";
},4000);