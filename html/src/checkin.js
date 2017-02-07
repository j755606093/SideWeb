import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import commentApp from "../components/commentApp.vue";
import store from '../store/index.js';//导入状态库

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(require('vue-resource'));//引用ajax库

import Checkin from "../Checkin.vue";

const routes = [{
		path: '/',
		name:"home",
		component: Checkin,
		children:[]
	},
	{
		path:"*",
		name:"all",
		redirect:{name:"home"},
	}
];

const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
});

const app = new Vue({
  router,
  store,
}).$mount('#app')

