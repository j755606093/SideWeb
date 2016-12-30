const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const rp = require("request-promise");
const fs = require("fs")
const index = require('./routes/index');

const app = express();
app.locals.pages = {};//设置一个缓存

/*********************************************/
/*****************功能分割线********************/
/*********************************************/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'html')));
app.use(express.static(path.join(__dirname, 'html/dist/')));
app.use((req,res,next)=>{
	res.set({
		"Access-Control-Allow-Origin":"*",
		"Access-Control-Allow-Headers": "Content-Type,Content-Length, Authorization, Accept,X-Requested-With",
		"Access-Control-Allow-Methods":"PUT,POST,GET,DELETE,OPTIONS"
	});
	next();
});

/*********************************************/
/*****************功能分割线********************/
/*********************************************/


app.use('/api', index);

/*********************************************/
/*****************功能分割线********************/
/*********************************************/

app.get("/wx/ticket",(req,res)=>{
	let realPath = "html/dist/ticket.html";
	fs.readFile(realPath,"utf-8",(error,file)=>{
		if(error){
			res.send({status:500,error:"没有这个文件!"});
		}
		else{
			res.set('Content-Type', 'text/html');
			// app.locals.pages[page] = file;//缓存这个文件
			res.send(file);
		}
	})
})

app.get("/getCustomPage",(req,res)=>{
	let page = req.query.page;//获取指定的页面
	let realPath = "html/dist/"+page+".html";

	if(app.locals.pages[page]){
		// 如果缓存有这个页面,就直接返回
		res.set('Content-Type', 'text/html');
		res.send(app.locals.pages[page]);
		return;
	}
	else{
		fs.readFile(realPath,"utf-8",(error,file)=>{
			if(error){
				res.send({status:500,error:"没有这个文件!"});
			}
			else{
				res.set('Content-Type', 'text/html');
				// app.locals.pages[page] = file;//缓存这个文件
				res.send(file);
			}
		})
	}
});

/*********************************************/
/*****************功能分割线********************/
/*********************************************/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	const err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.send({error:"error"})
});


module.exports = app;
