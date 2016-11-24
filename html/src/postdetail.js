import Vue from "vue";
import App from '../App.vue';
Vue.use(require('vue-resource'));//引用ajax库

new Vue({
	el:"#app",
	components:{
		"App":App
	}
})