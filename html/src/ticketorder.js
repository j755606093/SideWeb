import Vue from "vue";
Vue.use(require('vue-resource'));//引用ajax库
require("../css/ticketorder.css");
import "whatwg-fetch";
import { Toast,Indicator,Popup } from 'mint-ui';

new Vue({
	el:"#app",
	data:{
		OrderList:[],
		ready:false,//是否准备显示
		noDataShow:true,//没有订单数据
		Passengers:[],//乘客名数据,方便使用
		orderVisible:false,//
	},
	created(){
		this.ready = true;
		Indicator.open({
		  spinnerType: 'fading-circle'
		});
		fetch("http://192.168.31.80/api/Order/List",{
			method:"POST",
			headers: {
		    'Content-Type': 'application/json',
		    // Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDE1OTE5MDIwMDYwMzEiLCJqdGkiOiJlNGNhY2U1NC0wZDJkLTQwOGYtOGIzMC1lM2FiYmJhYjUwMTYiLCJpYXQiOjE0ODMzNTAxMzAsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4MzM1MDEzMCwiZXhwIjoxNDg0NTU5NzMwLCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.cmj1ZyP3OWnbwuexFwW05_4xYHZ4D7LgTZhrl_He9Rs"
		  },
			body:JSON.stringify({
				Index:1,
				Size:5,
				Type:1
			})
		})
			.then(result=>result.json())
			.then(result=>{
				if(result.Data){
					this.OrderList = result.Data;

					// for(let i=0;i<this.OrderList.length;i++){
					// 	let pass = this.OrderList[i].Passengers;
					// 	let names = "";
					// 	for(let j=0;j<pass.length;j++){
					// 		names = names+pass[j].Name+",";
					// 	}
					// 	this.Passengers.push(names);
					// }

					this.noDataShow = false;//显示订单
					Indicator.close();
				}
				else{
					// Toast({
					//   message: result.Message,
					//   position: 'bottom',
					//   duration: 3000
					// });
					Indicator.close();
				}
			})
	},
	methods:{
		openOrder(index){
			this.orderVisible = true;
			console.log(index);
		}
	},
	components:{
		"mt-popup":Popup
	}
})