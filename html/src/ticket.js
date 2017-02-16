import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import store from '../store/index.js'; //导入状态库
import MintUI from 'mint-ui'
// import 'mint-ui/lib/style.css'

Vue.use(MintUI);
Vue.use(Vuex);
// Vue.use(require('vue-resource'));//引用ajax库
Vue.use(VueRouter);

import Ticket from "../Ticket.vue";

import TicketBody from "../components/TicketBody.vue";
import TicketStartCity from "../components/TicketStartCity.vue";
import TicketEndCity from "../components/TicketEndCity.vue";
import TicketResult from "../components/TicketResult.vue";
import TicketPay from "../components/TicketPay.vue";
import TicketDate from "../components/TicketDate.vue";

const routes = [{
	path: '/',
	name: "home",
	component: Ticket,
	children: [{
		path: "",
		name: "ticketbody",
		component: TicketBody
	}, {
		path: "/startcity",
		name: "ticketstartcity",
		component: TicketStartCity
	}, {
		path: "/endcity",
		name: "ticketendcity",
		component: TicketEndCity
	}, {
		path: "/result",
		name: "ticketresult",
		component: TicketResult
	}, {
		path: '/ticketpay',
		name: "ticketpay",
		component: TicketPay
	}, {
		path: "/ticketdate",
		name: "ticketdate",
		component: TicketDate
	}, {
		path: "*",
		name: "*ticketbody",
		component: TicketBody
	}]
}, {
	path: "*",
	name: "all",
	redirect: { name: "home" },
}];

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
	// mode:"hash",
	// hashbang: true, 
	// history: false,
	routes: routes // （缩写）相当于 routes: routes
});

// router.beforeEach((to, from, next) => {
// 	if(from.name==="home"){
// 		store.commit("CHANGE_HEADER",false);
// 	}
// 	else{
// 		store.commit("CHANGE_HEADER",true);
// 	}
//   console.log("to",to);
//   console.log("from",from);
//   next();
// })

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
	router,
	store,
}).$mount('#app')
