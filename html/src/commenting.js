import Vue from 'vue';
Vue.use(require('vue-resource'));//引用ajax库
import commentApp from "../components/commentApp.vue";

const comment_app = new Vue({
	el:"#comment_id",
	data:{
		
	},
	components:{
		"comment-app":commentApp
	}
});

