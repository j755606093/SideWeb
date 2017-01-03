import Vue from "vue";
Vue.use(require('vue-resource'));//引用ajax库
require("../css/ticketorder.css");
import "whatwg-fetch";
import { Toast,Indicator,Popup } from 'mint-ui';

const debug = (function(){
	let debug = false;
	let url = window.location.href;
	if(url.slice(0,5)==="https"){
		debug = false;
	}
	else{
		debug = true;
	}
	return debug;
})();

const config = {
  headers:{
  	'Content-Type': 'application/json',
  	Authorization: debug?"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDE1OTE5MDIwMDYwMzEiLCJqdGkiOiJlNGNhY2U1NC0wZDJkLTQwOGYtOGIzMC1lM2FiYmJhYjUwMTYiLCJpYXQiOjE0ODMzNTAxMzAsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4MzM1MDEzMCwiZXhwIjoxNDg0NTU5NzMwLCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.cmj1ZyP3OWnbwuexFwW05_4xYHZ4D7LgTZhrl_He9Rs":""
  },
  serverUrl:debug?"http://192.168.31.80":""
}

new Vue({
	el:"#app",
	data:{
		OrderList:[],
		index:1,//页数
		ready:false,//是否准备显示
		noDataShow:true,//没有订单数据
		Passengers:[],//乘客名数据,方便使用
		orderVisible:false,

		OrderDetail:{},//订单详细信息
		passenger:"",//乘客名
	},
	created(){
		this.ready = true;
		this.moreOrderData();
	},
	methods:{
		loading(){
			Indicator.open({
			  spinnerType: 'fading-circle'
			});
		},
		moreOrderData(){
			this.loading();
			fetch(config.serverUrl+"/api/Order/List",{
				method:"POST",
				headers: config.headers,
				body:JSON.stringify({
					Index:this.index,
					Size:5,
					Type:1
				})
			})
				.then(result=>result.json())
				.then(result=>{
					if(result.Data){
						for(let i=0;i<result.Data.length;i++){
							this.OrderList.push(result.Data[i]);
						}
						

						this.noDataShow = false;//显示订单
					}
					
					Indicator.close();
				})
			this.index++;
		},
		openOrder(index){
			this.loading();
			this.getOrderInfo(this.OrderList[index].Id)
		},
		getOrderInfo(id){
			return fetch(config.serverUrl+"/api/Order/Get",{
				method:"POST",
				headers: config.headers,
				body:JSON.stringify({
					OrderId:id
				})
			}).then(result=>result.json())
					.then(result=>{
					this.OrderDetail = result.Data;
					this.passenger = "";
					for(let i=0;i<this.OrderDetail.Passengers.length;i++){
						this.passenger = this.passenger + this.OrderDetail.Passengers[i].Name + ",";
					}
					this.passenger = this.passenger.slice(0,this.passenger.length-1);
					Indicator.close();
					this.orderVisible = true;
				})
		},
		payMoney(){
			this.loading();
			let id = this.OrderDetail.Id;
			return fetch(config.serverUrl+"/api/Order/PayOrder",{
				method: 'POST',
				headers: {
			    'Content-Type': 'application/json',
			    Authorization:config.Authorization
			  },
				body:JSON.stringify({
					OrderId:id
				})
			})
			.then(result=>result.json())
			.then(result=>{
				Indicator.close();
				let paydata = result.Data;
				window.WeixinJSBridge.invoke("getBrandWCPayRequest",paydata,function(r){
						if(r.err_msg==="get_brand_wcpay_request:ok"){
							Toast({
							  message: '支付成功!',
							  iconClass: 'fa fa-check',
							  duration:3000,
							  className:"success"
							});
						}
					});
			})
		}
	},
	components:{
		"mt-popup":Popup
	}
})