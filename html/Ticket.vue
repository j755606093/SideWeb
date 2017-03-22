<template>
	<div id="ticket">
		<side-header></side-header>
		<div class="body">
			<transition 
			enter-active-class="fadeIn"
			leave-active-class="fadeOut">
				<keep-alive exclude-"TicketPay">
					<router-view></router-view>
				</keep-alive>
			</transition>
		</div>
		<side-footer></side-footer>
		<!-- <order-info></order-info> -->
	</div>
</template>

<style lang="css">
	@import "./css/ticket.css";
	.body{
		/*padding-top:50px;*/
		/*position: absolute;
		top:0;
		left:0;
		right:0;
		bottom:0;*/
	}
</style>

<script type="text/babel">
import Utils from "./Utils/utils";
import SideHeader from "./components/SideHeader.vue";
import Footer from "./components/Footer.vue";

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
		"side-footer":Footer
	}
}
</script>