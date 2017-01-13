//index.js

let Utils = require("../../utils/util.js");
let debugData = wx.getStorageSync('debugData')

//获取应用实例
let app = getApp();

Page({
  data: {
    orderData:[]
  },
  onLoad (options) {
    let index = options.index;//获取用户选择的结果数据

    let resultList = wx.getStorageSync('resultList');//搜索结果
    let startDate = wx.getStorageSync('startDate');//出发日期

    this.setData({
       orderData: resultList[index]
    });

    wx.setNavigationBarTitle({
      title: startDate.date+" "+startDate.week
    });
  },
  //监听页面显示
  onShow(){
    console.log(this.data.orderData)
  },
  //监听页面初次渲染完成
  onReady(){
    
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
