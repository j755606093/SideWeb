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

const routes = [{
	path: '/',
	// name: "home",
	component: ShareCar,
	children: [{
		path: "",
		name: "index",
		component: Index
	}]
}, {
	path: "/detail/:types/:tripId",
	name: "tripdetail",
	component: TripDetail
}, {
	path: "*",
	name: "all",
	redirect: { name: "home" },
}];

const router = new VueRouter({
	routes // （缩写）相当于 routes: routes
});

const app = new Vue({
	router,
	store,
}).$mount('#app')
