<template type="x/template">
	<div class="tripdetail">
		<div v-if="isReady" class="trip__info">
			<my-list :types="pageIndex" :list="item" :index="index"></my-list>
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
			isReady:false
		}
	},
	created(){
		this.tripId = this.$route.params.tripId;
		if(this.tripId){
			this.$store.dispatch("getTripDetail",this.tripId).then(result=>{
				console.log(result)
			})
		}
		console.log(this.tripId);

	},
	computed:{
		
	},
	methods:{
		
	},
	filters:{
		
	},
	components:{
		"my-list":List
	}
}
</script>