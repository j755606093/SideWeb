//app.js
let debugData = wx.getStorageSync('debugData');
let {debug} = require("/utils/config.js");//让配置文件运行一次

App({
  globalData:{
    userInfo:{}
  },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // wx.setStorageSync('globalData', this.globalData);
  },
  
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  }
})