<template type="x/template">
	<div class="tripdetail">
		<my-header :showBack="true" headerTitle="旅程详情"></my-header>
		<div v-if="isReady" class="trip__info">
			<my-list :types="types" :list="tripData" nogo="true"></my-list>
		</div>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
.tripdetail{
	margin-top:60px;
}
.trip__info{
	width:100%;
	padding:0 10px;
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
			tripId:"",
			isReady:false,

			tripData:{}
		}
	},
	created(){
		this.tripId = this.$route.params.tripId;
		this.types = this.$route.params.types;

		if(!this.tripId){

		}
		
		if(this.types==="0"){
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
		}else{
			this.types = parseInt(this.types);
			this.loading();
			this.$store.dispatch("getTripDetailPeople",this.tripId).then(result=>{
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
		"my-list":List,
		"my-header":Header,
	}
}
</script>