<template>
	<div class="order-info-btn" @click="" v-if="getHeaderState">
		<i class="fa fa-sticky-note"></i>
	</div>
</template>

<style lang="css">
@import "../css/ticketinfo.css";
</style>

<script type="text/babel">
import Utils from "../Utils/utils";
const _ = require("underscore");

export default {
	data () {
		return {
			
		}
	},
	created(){
		// let nowDate = new Date();
		// this.$store.commit("CHANGE_HEADER",{isHome:false,Title:"订单信息"});
	},
	filters:{
		
	},
	watch:{
		
	},
	computed:{
		getHeaderTitle(){
			return this.$store.state.tickets.HeaderTitle;
		},
		getHeaderState(){
			return this.$store.state.tickets.HeaderIsHome;
		},
	},
	methods:{
		formatDate(data){
			return Utils.formatDate(data);
		}
	}
}
</script>