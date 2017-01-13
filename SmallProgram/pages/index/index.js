//index.js

let Utils = require("../../utils/util.js");
let debugData = wx.getStorageSync('debugData')

//获取应用实例
let app = getApp();

Page({
  data: {
    search:{
      start:"广州",
      end:"揭阳"
    },
    date:{
      nowDate:"2017-01-11",
      nowDateText:"明天",
      chooseStartTime:"2017-01-11",//可选择的开始时间
      chooseEndTime:"2017-02-11",//可选择的最后时间
    }
  },
  onLoad () {
    this.setStartDate();// 设置出发时间
    this.getCityDefault();//设置默认城市
  },
  //监听页面初次渲染完成
  onReady(){
    
  },
  //监听页面显示
  onShow(){
    let start = wx.getStorageSync('startCity').Name;
    let end = wx.getStorageSync('endCity').Name;

    this.setState("search",{
      start:start,
      end:end
    })
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
  getCityDefault(){
    // 获取默认的城市路径
    wx.request({
      url: debugData.serverUrl+"/api/Transport/Index",
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: debugData.headers, // 设置请求的 header
      success:(res)=>{
        if(res.data.Data){
          this.setCityDefault(res.data.Data)
        }
      }
    })
  },
  setState(name,data){
    // 设置数据
    let json = {};
    json[name] = Object.assign(this.data[name],data);
    this.setData(json);
  },
  setCityDefault(Data){
    // 根据获取到的城市设置当前默认城市信息
    Utils.setDataSync("startCity",{
      Name:Data.Start.Name,
      Code:Data.Start.CityId,
      CityName:Data.Start.CityName
    });
    Utils.setDataSync("endCity",{
      Name:Data.End.Name,
      Code:Data.End.CityId,
      CityName:Data.End.CityName
    });
    
    this.setState("search",{
      start:Data.Start.Name,
      end:Data.End.Name
    })
  },
  getStartCityList(){
    wx.request({
      url: debugData.serverUrl+"/api/Transport/GetStartPoints",
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: debugData.headers, // 设置请求的 header
      success:(res)=>{
        if(res.data.Data){
          this.setStartCityList(res.data.Data);
          // console.log(res.data.Data)
        }
      },
      fail:(error)=> {
        // fail
      },
      complete:(status)=> {
        // complete
      }
    })
  },
  getEndCityList(){
    let code = wx.getStorageSync('startCity').Code;
    wx.request({
      url: debugData.serverUrl+"/api/Transport/GetEndPoints/"+code,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: debugData.headers, // 设置请求的 header
      success:(res)=>{
        if(res.data.Data){
          this.setEndCityList(res.data.Data);
        }
      },
      fail:(error)=> {
        // fail
      },
      complete:(status)=> {
        // complete
      }
    })
  },
  setStartCityList(Data){
    Utils.setDataSync("startCityList",Data);

    // 跳转到城市列表
    wx.navigateTo({
      url: '../citylist/citylist?city=startCityList'
    });
  },
  setEndCityList(Data){
    Utils.setDataSync("endCityList",Data);

    // 跳转到城市列表
    wx.navigateTo({
      url: '../citylist/citylist?city=endCityList'
    });
  },
  dateChange(event){
    // 日期改变后的回调函数
    let date = new Date(event.detail.value);
    let newDate = new Date();
    let showWeek = Utils.formatWeek(date);

    // 显示明天和今天
    if(date.getMonth()===newDate.getMonth()&&date.getDate()===newDate.getDate()){
      showWeek = "今天";
    }
    if(date.getMonth()===newDate.getMonth()&&date.getDate()===newDate.getDate()+1){
      showWeek = "明天";
    }

    // 保存时间
    Utils.setDataSync("startDate",{
      date:Utils.formatDateTypeOne(date),
      week:showWeek,
      server:new Date(date)
    });

    this.setData({
      date:Object.assign(this.data.date,{
        nowDate:event.detail.value,
        nowDateText:showWeek
      })
    })
  },
  getStartCity(event){
    // 获取出发城市列表
    this.getStartCityList();
  },
  getEndCity(event){
    // 获取到达城市列表
    this.getEndCityList();
  },
  setStartDate(){
    // 设置出发日期
    let nowDate = new Date();//获取现在的时间
    let showText = Utils.formatDateTypeOne(new Date(nowDate.getTime()+1000*60*60*24));
    let nowText = Utils.formatDateTypeOne(new Date(nowDate.getTime()));
    let endText = Utils.formatDateTypeOne(new Date(nowDate.getTime()+1000*60*60*24*30));

    //保存时间
    Utils.setDataSync("startDate",{
      date:showText,
      week:"明天",
      // week:Utils.formatWeek(new Date(nowDate.getTime())),
      server:new Date(nowDate.getTime()+1000*60*60*24)
    });

    this.setData({
      date:Object.assign(this.data.date,{
        nowDate:showText,
        chooseStartTime:nowText,
        chooseEndTime:endText
      })
    })
  },
  query(){
    let start = wx.getStorageSync('startCity');//出发地
    let end = wx.getStorageSync('endCity');//到达地
    let startTime = this.data.date.nowDate;//日期

    wx.navigateTo({
      url: '../result/result'
    })
  }
})
