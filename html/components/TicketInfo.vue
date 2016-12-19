<template>
	<div class="ticket-info">
		<div class="info-header">
			
		</div>
	</div>
</template>

<style lang="css">
@import "../css/ticketinfo.css";
</style>

<script type="text/babel">
import Utils from "../Utils/utils";
import DatePicker from 'vue-datepicker'
import { Indicator,Toast } from 'mint-ui';
const _ = require("underscore");

export default {
	data () {
		return {

		}
	},
	created(){
		let nowDate = new Date();
		this.$store.commit("CHANGE_HEADER",{isHome:false,Title:"订单信息"});
		
	},
	filters:{
		
	},
	watch:{
		
	},
	computed:{
		
	},
	methods:{
		formatDate(data){
			return Utils.formatDate(data);
		}
	}
}
</script>