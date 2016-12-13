<template>
	<div id="ticket">
		<side-header></side-header>
		<div class="body">
			<transition 
			enter-active-class="fadeIn"
			leave-active-class="fadeOut">
				<router-view></router-view>
			</transition>
		</div>
	</div>
</template>

<style lang="css">
	@import "./css/ticket.css";
	.body{
		padding-top:50px;
	}
</style>

<script type="text/babel">
import Utils from "./Utils/utils";
import SideHeader from "./components/SideHeader.vue";

export default {
	data () {
		return {
			
		}
	},
	created(){
		
	},
	methods:{
		formatTime(date){
			return Utils.formatTime(date);
		}
	},
	computed:{
		getHeaderState(){
			return this.$store.state.tickets.HeaderIsHome;
		},
		// enterPage(){
		// 	if(this.getHeaderState){
		// 		return "fadeRight-in";
		// 	}
		// 	else{
		// 		return "fadeRight-out";
		// 	}
		// },
		// leavePage(){
		// 	if(this.getHeaderState){
		// 		return "fadeLeft-out";
		// 	}
		// 	else{
		// 		return "fadeLeft-in";
		// 	}
		// }
	},
	components:{
		"side-header":SideHeader,
	}
}
</script>