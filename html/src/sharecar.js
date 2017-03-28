import Vue from 'vue';
import VueRouter from 'vue-router';
// import Vuex from 'vuex';
// import commentApp from "../components/commentApp.vue";
import store from '../store/sharecar.js'; //导入状态库
require("swiper/dist/css/swiper.min.css");

// Vue.use(Vuex);
Vue.use(VueRouter);
// Vue.use(require('vue-resource')); //引用ajax库

import ShareCar from "../sharecar/ShareCar.vue";
import Index from "../sharecar/components/Index.vue";
import TripDetail from "../sharecar/components/TripDetail.vue";
import Publish from "../sharecar/components/Publish.vue";
import User from "../sharecar/components/User.vue";
import Search from "../sharecar/components/Search.vue";
import UserInfo from "../sharecar/components/UserInfo.vue";
import Commend from "../sharecar/components/commend.vue";

const routes = [{
	path: '/',
	// name: "home",
	redirect: '/index',
	component: ShareCar,
	mate: { keepAlive: true },
	children: [{
		path: "",
		name: "index",
		component: Index,
		mate: { keepAlive: true }
	}]
}, {
	path: "/detail/:types/:tripId",
	name: "tripdetail",
	component: TripDetail
}, {
	path: "/user",
	name: "user",
	component: User
}, {
	path: "/publish",
	name: "publish",
	component: Publish
}, {
	path: "/search",
	name: "search",
	component: Search
}, {
	path: "/userinfo",
	name: "userinfo",
	component: UserInfo
}, {
	path: "/commend/:types/:tripId",
	name: "commend",
	component: Commend
}, {
	path: "*",
	name: "all",
	mate: { keepAlive: true },
	redirect: { path: "/" },
}];

const router = new VueRouter({
	routes // （缩写）相当于 routes: routes
});

const app = new Vue({
	router,
	store,
}).$mount('#app')
