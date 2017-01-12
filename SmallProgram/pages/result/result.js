//index.js

let Utils = require("../../utils/util.js");
let debugData = wx.getStorageSync('debugData')

//获取应用实例
let app = getApp();

Page({
  data: {
    resultData:[],
    selectIndex:3,//默认选择第一个
    showLine:-1,//默认不显示任何一个途经点
  },
  onLoad (options) {
    let start = wx.getStorageSync('startCity');//出发地
    let end = wx.getStorageSync('endCity');//到达地
    let startDate = wx.getStorageSync('startDate');//出发日期

    wx.setNavigationBarTitle({
      title: start.Name+"-"+end.Name
    });

    wx.request({
      url: debugData.serverUrl+"/api/Transport/GetLines",
      data: {
        SPoint: start.Name,
				EPoint: end.Name,
				Date: startDate.server
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: debugData.header, // 设置请求的 header
      success: (res)=>{
        // success
        // 去掉日期后的秒数
        let formatdata = [];
        
        for(let i=0;i<res.data.Data.length;i++){
          let item = Object.assign({},res.data.Data[i]);
          item.StartTime = item.StartTime.slice(0,item.StartTime.length-3);
          formatdata.push(item);
        }
        // console.log(formatdata)
        this.setData({
          resultData:formatdata
        });
      },
      fail: ()=>{
        // fail
      },
      complete: ()=>{
        // complete
      }
    })
  },
  //监听页面显示
  onShow(){
    // console.log(this.data.resultData)
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
  },
  showLine(event){
    // 显示途经点
    let index = event.currentTarget.dataset.index;
    if(index===this.data.showLine){
      // 说明相等,那就收起来
      this.setData({
        showLine:-1
      })
    }
    else{
      this.setData({
        showLine:index
      })
    }
  },
  setOrder(event){
    // 准备进入订单页
    let index = event.currentTarget.dataset.index;
    console.log(index)
  }
})
