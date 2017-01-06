import Vue from "vue";
Vue.use(require('vue-resource'));//引用ajax库
require("../css/ticketuser.css");
import "whatwg-fetch";
const _ = require("underscore");
import { MessageBox,Toast,Indicator,Popup,Tabbar,Navbar,TabItem,TabContainer, TabContainerItem } from 'mint-ui';
import 'mint-ui/lib/style.css'

// Vue.component(TabContainer.name, TabContainer);
// Vue.component(TabContainerItem.name, TabContainerItem);
// Vue.component(Tabbar.name, Tabbar);
// Vue.component(TabItem.name, TabItem);
// Vue.component(Navbar.name, Navbar);

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

//检查请求返回的状态
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
  	if(response.status===401){
  		window.location.href="/api/oauth2/Index?returnUrl=https://ticket.samecity.com.cn/wx/ticket.html#/";
  	}
  	else{
  		Indicator.close();
  		alert("服务器繁忙,请稍后再试...")
  	}
    // var error = new Error(response.statusText)
    // error.response = response
    // throw error
    return response;
  }
}

const config = {
  headers:{
  	'Content-Type': 'application/json',
  	Authorization: debug?"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyNDE1OTE5MDIwMDYwMzEiLCJqdGkiOiJlNGNhY2U1NC0wZDJkLTQwOGYtOGIzMC1lM2FiYmJhYjUwMTYiLCJpYXQiOjE0ODMzNTAxMzAsIk1lbWJlciI6Im5vcm1hbCIsIm5iZiI6MTQ4MzM1MDEzMCwiZXhwIjoxNDg0NTU5NzMwLCJpc3MiOiJTdXBlckF3ZXNvbWVUb2tlblNlcnZlciIsImF1ZCI6Imh0dHA6Ly9sb2NhbGhvc3Q6MTc4My8ifQ.cmj1ZyP3OWnbwuexFwW05_4xYHZ4D7LgTZhrl_He9Rs":""
  },
  serverUrl:debug?"http://192.168.31.80":""
}

const Vue_Order = new Vue({
	el:"#app",
	data:{
		ready:false,//页面为准备好
	},
	created(){
		this.ready = true;
		
	},
	mounted(){
		
	},
	watch:{
		
	},
	methods:{
		loading(){
			Indicator.open({
			  spinnerType: 'fading-circle'
			});
		},
		getQueryString(name){
			let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i'); 
			let r = window.location.search.substr(1).match(reg); 
			if (r !== null){ 
				return unescape(r[2]); 
			}
			return null; 
		}
	},
	components:{
		"mt-popup":Popup,
	}
});