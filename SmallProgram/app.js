//app.js
let debugData = wx.getStorageSync('debugData');
let {debug} = require("/utils/config.js");//让配置文件运行一次

App({
  globalData:{
    userInfo:{}
  },
  onLaunch() {
    //调用API从本地缓存中获取数据
    // wx.setStorageSync('globalData', this.globalData);
    this.login();
    this.getUserInfo();
  },
  login(){
    // 获取用户信息需要权限
    let Access_Token = wx.getStorageSync('Access_Token');
    if(Access_Token){
      // 保存有这个Access_Token
      return;
    }
    wx.login({
      success:(res)=> {
        if(res.code){
          wx.request({
            url: 'https://ticket.samecity.com.cn/api/OAuth2/MINALogin',
            data: {
              Code:res.code
            },
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: debugData.header, // 设置请求的 header
            success: (res)=>{
              // success
              wx.setStorageSync('Access_Token', res.data.Data.Access_Token);
              if(!res.data.Data.UserName){
                // 没有注册过
                this.updateUserInfo();
              }
            }
          })
        }
      }
    })
  },
  updateUserInfo(){
    let Access_Token = wx.getStorageSync('Access_Token');
    let UserInfo = this.globalData.uesrInfo;
    console.log(UserInfo)
    wx.request({
      url: 'https://ticket.samecity.com.cn/api/OAuth2/MINAUpdateUser',
      data: {
        "encryptedData": UserInfo.encryptedData,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: debugData.header,  // 设置请求的 header
      success: function(res){
        // success
      }
    })
  },
  getUserInfo(){
    wx.getUserInfo({
      success: (res)=> {
        this.globalData.uesrInfo=res;
      }
    })
  }
})