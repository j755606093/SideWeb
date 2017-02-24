<template type="x/template" id="ticketinfo">
	
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
		this.$store.commit("CHANGE_HEADER",{isHome:false,Title:"优惠券"});
		this.$store.commit("SET_SHOWHEADER",true);
		console.log(this.$route.params.id)
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