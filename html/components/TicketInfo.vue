<template type="x/template" id="ticketinfo">
	<div class="order-info-btn animated slideInRight" @click="goToOrderList" v-if="getHeaderState">
		<i class="fa fa-sticky-note"></i>
	</div>
</template>

<style lang="sass">
@import "../sass/utils.scss";

.order-info-btn{
	padding:0;
	width:50px;
	height:50px;
	background-color:$blue;
	border-radius:25px;
	position:absolute;
	bottom:30px;
	right:20px;
	text-align:center;
	>i{
		color:$white;
		font-size:1.8rem;
		height:50px;
		line-height:50px;
	}
}
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
		},
		goToOrderList(){
			this.$router.push({name:"ticketorderlist"});
		}
	}
}
</script>