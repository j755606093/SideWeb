//app.js
App({
  globalData:{
    userInfo:null,
  },
  //监听页面加载
  onLaunch() {
    
  },
  getUserInfo(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success() {
          wx.getUserInfo({
            success (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  }
})