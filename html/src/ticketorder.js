import Vue from "vue";
Vue.use(require('vue-resource'));//引用ajax库
require("../css/ticketorder.css");
import "whatwg-fetch";
import { Toast } from 'mint-ui';

new Vue({
	el:"#app",
	data:{
		OrderList:[],
		noDataShow:true,//没有订单数据
		Passengers:[],//乘客名数据,方便使用
	},
	created(){
		fetch("http://192.168.31.80/api/Order/List",{
			method:"POST",
			headers: {
		    'Content-Type': 'application/json'
		  },
			body:JSON.stringify({
				Index:1,
				Size:4,
				Type:1
			})
		})
			.then(result=>result.json())
			.then(result=>{
				if(result.Data){
					this.OrderList = result.Data;

					for(let i=0;i<this.OrderList.length;i++){
						let pass = this.OrderList[i].Passengers;
						let names = "";
						for(let j=0;j<pass.length;j++){
							names = names+pass[j].Name+",";
						}
						this.Passengers.push(names);
					}

					this.noDataShow = false;//显示订单
				}
				else{
					Toast({
					  message: result.Message,
					  position: 'bottom',
					  duration: 3000
					});
				}
			})
	}
})