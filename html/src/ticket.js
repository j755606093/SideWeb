import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import store from '../store/index.js';//导入状态库
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

Vue.use(MintUI);
Vue.use(Vuex);
Vue.use(require('vue-resource'));//引用ajax库
Vue.use(VueRouter);

import Ticket from "../Ticket.vue";
import DownloadApp from "../components/DownloadApp.vue";

const routes = [{
	path: '/home',
	name:"home",
	component: Ticket
},
{
	path: '/other',
	name:"other",
	component: DownloadApp
},{
	path:"*",
	name:"all",
	component:Ticket
}
];

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
  routes // （缩写）相当于 routes: routes
});

// 4. 创建和挂载根实例。
// 记得要通过 router 配置参数注入路由，
// 从而让整个应用都有路由功能
const app = new Vue({
  router,
  store,
}).$mount('#app')