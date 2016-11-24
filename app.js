var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var rp = require("request-promise");
var fs = require("fs")
// var routes = require('./routes/index');
// var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'html')));

// app.use('/', routes);
// app.use('/users', users);

// 删除页面script保护
// <meta content="script-src https: 'unsafe-inline' 'unsafe-eval' *.qq.com *.weishi.com 'nonce-836503595'" http-equiv="Content-Security-Policy"/>
function deleteSecurity(data){
	let step1 = data.replace(/<iframe.*<\/iframe>/g,"");//去掉iframe框架
	return step1.replace(/Content-Security-Policy/g,"");
}

// 插入自己的Script数据
function insertScript(data){
	let insertData = "<script src='js/test.js'></script>";
	return deleteSecurity(data).replace(/(<\/body>)/gi,insertData+"$1");
}

// 插入自己的Css数据
function insertCss(data){
	let insertData = "<link href='js/test.js' rel='styleshe et'/>";
	return deleteSecurity(data).replace(/(<\/head>)/gi,insertData+"$1");
}

app.get("/getTopic",(req,res)=>{
	var uniqueId = req.query.uniqueId;
	rp("http://192.168.31.86/api/Topic/GetSource/"+uniqueId).then((response)=>{
		var data = response;
		// res.type('html');
		res.set('Content-Type', 'text/html');
		res.send(insertScript(data));
	})
});

app.get("/getHomeContent",(req,res)=>{
	var realPath = "html/content.html";
	
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

app.get("/getCustomPage",(req,res)=>{
	var page = req.query.page;//获取指定的页面
	var realPath = "html/"+page+".html";

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

app.post("/test",(req,res)=>{
	console.log(req.get("auto"));
	res.send({result:1});
})

//加密
// function encodeLogin(data){
// 	let b = new Buffer(data,'base64');
// 	return b.toString('hex');
// }

// app.get("/login",(req,res)=>{
// 	let user = req.query.user;
// 	let pwd = req.query.password;

// 	if(user==="user"&&pwd==="password"){
// 		res.cookie("token",encodeLogin(user+pwd),{
// 			expires:new Date(Date.now() + 1000*60*60),//一小时
// 		});
// 		res.jsonp({setcookie:true});
// 	}
// 	else{
// 		res.jsonp({setcookie:false});
// 	}
	
// });

// app.get("/isLogin",(req,res)=>{
// 	if(req.cookies.token){
// 		res.jsonp({isLogin:true});
// 	}
// 	else{
// 		res.jsonp({isLogin:false});
// 	}
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});


module.exports = app;
