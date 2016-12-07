//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    Carousels:null,
    NavsTop:null,//菜单栏分成上下两块
    NavsBottom:null,//菜单栏分成上下两块
    Docs:null,
    News:null,
    SectionPage:null,
    Videos:null,
    userInfo: {}
  },
  //监听页面初次渲染完成
  onReady(){

  },
  //监听页面显示
  onShow(){
    
  },
  //监听页面隐藏
  onHide(){

  },
  //监听页面卸载
  onUnload(){

  },
  //页面上拉触底事件的处理函数
  onReachBottom(){

  },
  //监听用户下拉动作
  onPullDownRefresh(){

  },
  //事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad () {
    //获取首页数据
    this.getHomeData();

    //调用应用实例的方法获取全局数据
    app.getUserInfo((userInfo)=>{
      //更新数据
      this.setData({
        userInfo:userInfo
      })
    })
  },
  getHomeData(){
    // 获取首页数据写入到缓存中
    wx.request({
      url:"http://192.168.31.86/api/Home/Index",
      method:"GET",
      success:(result)=>{
        let Data = result.data.Data;
        this.setData({
          Carousels:Data.Carousels,
          Docs: Data.Docs,
          NavsTop : Data.Navs.slice(0,5),
          NavsBottom:Data.Navs.slice(5,10),
          News:Data.News,
          SectionPage : Data.SectionPage,
          Videos : this.formatTitle(Data.Videos)
        })
        
        // wx.setStoreagesSync("Carousels",Data.Carousels);
        // wx.setStoreagesSync("Docs",Data.Docs);
        // wx.setStoreagesSync("Navs",Data.Navs);
        // wx.setStoreagesSync("News",Data.News);
        // wx.setStoreagesSync("SectionPage",Data.SectionPage);
        // wx.setStoreagesSync("Videos",Data.Videos);
        console.log(Data);
      }
    })
  },
  // 格式化热门视频的标题为一行
  formatTitle(data){
    for(let i =0;i<data.length;i++){
      data[i].Title = data[i].Title.slice(0,8)+"...";
    }
    return data;
  }
})
