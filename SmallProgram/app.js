//app.js
let debugData = wx.getStorageSync('debugData');
let {debug} = require("/utils/config.js");//让配置文件运行一次

App({
  globalData:{
    userInfo:{},
    islogin:false,//默认用户没有注册(后台),也说明没有授权过过,因为授权过后台会有用户名返回
  },
  onLaunch() {
    //调用API从本地缓存中获取数据
    // wx.setStorageSync('globalData', this.globalData);
    this.islogin();//去判断用户是否注册过
    // this.getUserInfo();
  },
  islogin(){
    // 获取用户信息需要权限
    let Access_Token = wx.getStorageSync('Access_Token');
    if(Access_Token){
      // 保存有这个Access_Token
      return;
    }
    wx.login({
      success:(res)=> {
        // return;
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
                this.globalData.islogin = false;
                // this.getUserInfo();
              }
              else{
                // 有用户的信息在后台,说明已经授权过
                this.globalData.islogin = true;
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
    // console.log(UserInfo)
    wx.request({
      url: 'https://ticket.samecity.com.cn/api/OAuth2/MINAUpdateUser',
      // url:debugData.serverUrl+"/api/OAuth2/MINAUpdateUser",
      data: {
        "encryptedData": UserInfo.encryptedData,
        "iv":UserInfo.iv
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
        this.updateUserInfo();
        console.log(res)
      },
      fail:(res)=>{
        console.log(res)
      }
    })
  }
})