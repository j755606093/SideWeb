<template type="x/template">
	<div id="publishtrip" class="publishtrip">
		<my-header :showBack="true" headerTitle="发布旅程"></my-header>
		<div v-if="isReady" class="trip__info animated slideInUp">
			
		</div>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
.publishtrip{
	margin-top:60px;
}

.animated{
	animation-duration: 0.4s;
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import List from "./list.vue";
import Header from "./Header.vue";
import { Toast, Indicator, Popup } from 'mint-ui';

export default {
	data () {
		return {
			isReady:false,

			tripData:{},
		}
	},
	created(){
		
	},
	computed:{
		
	},
	methods:{
		toast(title) {
			Toast({
				message: title,
				position: 'bottom',
				duration: 3000
			});
		},
		/** 加载动画(需要手动关闭) */
		loading() {
			Indicator.open({
				spinnerType: 'fading-circle'
			});
		},
	},
	filters:{
		
	},
	components:{
		"my-header":Header,
	}
}
</script>