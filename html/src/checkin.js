import Vue from 'vue';
import VueRouter from 'vue-router';
import "whatwg-fetch";
// import Vuex from 'vuex';
// import commentApp from "../components/commentApp.vue";
import store from '../store/checkin.js'; //导入状态库

// Vue.use(Vuex);
Vue.use(VueRouter);
// Vue.use(require('vue-resource')); //引用ajax库

import CheckIn from "../checkin/CheckIn.vue";
import Index from "../checkin/components/Index.vue";

const routes = [{
	path: '/',
	// name: "home",
	component: CheckIn,
	redirect: '/index',
	children: [{
		path: "",
		name: "index",
		component: Index,
		mate: { keepAlive: true }
	}]
}, {
	path: "*",
	name: "all",
	redirect: { path: "/" },
}];

// window.Checkin = Checkin;

const router = new VueRouter({
	routes // （缩写）相当于 routes: routes
});

const app = new Vue({
	router,
	store,
}).$mount('#app')
