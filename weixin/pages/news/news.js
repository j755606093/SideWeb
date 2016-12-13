// pages/news/news.js
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data:{
    html:""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;

    // WxParse.wxParse('article', 'html', article, that,5);
    wx.getStorage({
      key: 'News',
      success: (res)=>{
        // success
        this.getData(res.data);
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  getData(url){
    let that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    });
    wx.request({
      url: url,
      // data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success:(result)=>{
        // success
        let html = result.data.Data.replace(/[\n\r]/g,"").match(/<body>(.*)<\/body>/)[0].replace(/style="padding-bottom:[\s\d\.]+%;"/g,"");
        // console.log(html)
        WxParse.wxParse('html', 'html', html, that,0);
        wx.hideToast();
      },
      fail: function() {
        // fail
      },
      complete: function() {
        // complete
      }
    })
  }
})