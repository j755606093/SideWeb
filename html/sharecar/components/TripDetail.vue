<template type="x/template">
	<div class="tripdetail">
		<div v-if="isReady" class="trip__info">
			<my-list :types="types" :list="tripData"></my-list>
		</div>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
.trip__info{
	width:100%;
	padding:0 10px;
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import List from "./list.vue";
import { Toast, Indicator, Popup } from 'mint-ui';

export default {
	data () {
		return {
			tripId:"",
			isReady:false,

			tripData:{}
		}
	},
	created(){
		this.tripId = this.$route.params.tripId;
		this.types = this.$route.params.types;
		
		if(this.tripId&&this.types){
			this.types = parseInt(this.types);
			this.loading();
			this.$store.dispatch("getTripDetail",this.tripId).then(result=>{
				if(result.Data){
					this.tripData = result.Data;
					this.isReady = true;//开始显示
				}
				else{
					this.toast(result.Message);
				}
				Indicator.close();
			})
		}
		else{
			
		}
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
		"my-list":List
	}
}
</script>