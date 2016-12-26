import Vue from "vue";
import App from '../App.vue';
Vue.use(require('vue-resource'));//引用ajax库

// Vue.http.headers.common['Authorization'] = 'Basic YXBpOnBhc3N3b3Jk';

new Vue({
	el:"#app",
	components:{
		"App":App
	}
})