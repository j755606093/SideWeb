//index.js

let Utils = require("../../utils/util.js");

//获取应用实例
let app = getApp();

Page({
  data: {
    
  },
  onLoad (options) {
    let start = wx.getStorageSync('startCity').Name;//出发地
    let end = wx.getStorageSync('endCity').Name;//到达地

    wx.setNavigationBarTitle({
      title: start+"-"+end
    })
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
  setState(name,data){
    // 设置数据
    let json = {};
    json[name] = Object.assign(this.data[name],data);
    this.setData(json);
  }
})
