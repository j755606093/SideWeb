<template type="x/template" id="ticketorderlist">
	<p>选择乘车人</p>
</template>

<style lang="css">
@import "../css/ticketselectpassenger.css";
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
		this.$store.commit("CHANGE_HEADER",{isHome:false,Title:"选择日期"});
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