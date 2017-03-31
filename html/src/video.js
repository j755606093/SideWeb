import Vue from 'vue';
import VueRouter from 'vue-router';
import "whatwg-fetch";
// import Vuex from 'vuex';
// import commentApp from "../components/commentApp.vue";
import store from '../store/video.js'; //导入状态库

// Vue.use(Vuex);
Vue.use(VueRouter);
// Vue.use(require('vue-resource')); //引用ajax库

import Video from "../video/Video.vue";
import Index from "../video/components/Index.vue";
import VideoDetail from "../video/components/VideoDetail.vue";

const routes = [{
	path: '/',
	// name: "home",
	component: Video,
	redirect: '/index',
	children: [{
		path: "",
		name: "index",
		component: Index,
		mate: { keepAlive: true }
	}]
}, {
	path: "/detail/:Id",
	name: "detail",
	component: VideoDetail,
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
