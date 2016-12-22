const express = require('express');
const router = express.Router();
const fs = require("fs");
const rp = require("request-promise");
const serverUrl = "http://192.168.31.86";
const {
	weixin,
	news,
	formatJSON,
} = require("../Utils");

/*********************************************/
/*****************功能分割线********************/
/*********************************************/

/** 获取微信号文章 */
router.get("/GetTopic",(req,res)=>{
	const id = req.query.id;
	rp(serverUrl+"/api/Topic/Getdetail/"+id)
		.then((response)=>{
			let data = formatJSON(response);
			if(data.Data){
				res.set('Content-Type', 'text/html');
				res.send(weixin(data.Data));
			}
			else{
				res.send({error:"404",message:"未找到此数据"})
			}
		})
});

/*********************************************/
/*****************功能分割线********************/
/*********************************************/

/** 获取新闻 */
router.get("/GetNews",(req,res)=>{
	const id = req.query.id;
	rp(serverUrl+"/api/News/Getdetail/"+id)
		.then((response)=>{
			let data = formatJSON(response);
			if(data.Data){
				res.set('Content-Type', 'text/html');
				res.send(news(data.Data));
			}
			else{
				res.send({error:"404",message:"未找到此数据"})
			}
		})
});

/*********************************************/
/*****************功能分割线********************/
/*********************************************/

router.get("/getHomeContent",(req,res)=>{
	const realPath = "html/content.html";
	
	fs.readFile(realPath,"utf-8",(error,file)=>{
		if(error){
			res.send({status:500,error:"没有这个文件!"});
		}
		else{
			res.set('Content-Type', 'text/html');
			res.send(file);
		}
	})
});

module.exports = router;
