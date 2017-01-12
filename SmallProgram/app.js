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
    this.getUserInfo();
  },
  getUserInfo:function(){
    // 获取用户信息不需要权限
    wx.login({
      success:(res)=> {
        if(res.code){
          console.log(res.code)
        }
        wx.getUserInfo({
          success: (res)=> {
            this.setData({
              uesrInfo:res.userInfo
            });
          }
        })
      }
    })
  }
})