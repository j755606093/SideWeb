<template>
	<div id="ticket">
		<side-header></side-header>
		<transition 
		enter-active-class="fadeRight-in"
		leave-active-class="fadeLeft-out">
			<router-view></router-view>
		</transition>
	</div>
</template>

<style lang="css">
	@import "./css/ticket.css";
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
		}
	},
	components:{
		"side-header":SideHeader,
	}
}
</script>