<template type="x/template" id="ticketorderlist">
	<div class="order-list">
		<p>订单历史</p>
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
		this.$store.commit("CHANGE_HEADER",{isHome:false,Title:"订单信息"});
	},
	filters:{
		
	},
	watch:{
		
	},
	computed:{
		
	},
	methods:{
		
	}
}
</script>