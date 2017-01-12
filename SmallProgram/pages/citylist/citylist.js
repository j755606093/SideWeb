//index.js

let Utils = require("../../utils/util.js");

//获取应用实例
let app = getApp();

Page({
  data: {
    CityList:[],
    page:"startCityList",//startCityList或者endCityList
    intoId:""
  },
  onLoad (options) {
    let city = options.city;//获取需要显示的列表
    
    wx.getStorage({
      key: city,
      success:(res)=>{
        this.setData({
          CityList:res.data,
          page:city,
          intoId:res.data[0].ShortKey
        });
      }
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
  },
  getCity(event){
    // 获取用户选择的城市
    let index = event.currentTarget.dataset.index;
    let i = event.currentTarget.dataset.i;
    let data = this.data.CityList[index].Content[i];

    if(this.data.page==="startCityList"){
        Utils.setDataSync("startCity",{
            Name:data.Name,
            Code:data.Id
        });
    }
    else{
        Utils.setDataSync("endCity",{
            Name:data.Name,
            Code:data.Id
        });
    }

    wx.navigateBack();//返回上一个页面
  },
  setLocation(event){
    // 设置定位
    let name = event.currentTarget.dataset.name;
    
    this.setData({
      intoId:name
    })
  }
})
