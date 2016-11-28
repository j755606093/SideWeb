<template>
	<div id="ticket">
		<side-header></side-header>
		<ticket-body></ticket-body>
		<mt-index-list>
		  <mt-index-section index="A">
		    <mt-cell title="Aaron"></mt-cell>
		    <mt-cell title="Alden"></mt-cell>
		    <mt-cell title="Austin"></mt-cell>
		  </mt-index-section>
		  <mt-index-section index="B">
		    <mt-cell title="Baldwin"></mt-cell>
		    <mt-cell title="Braden"></mt-cell>
		  </mt-index-section>
		  ...
		  <mt-index-section index="Z">
		    <mt-cell title="Zack"></mt-cell>
		    <mt-cell title="Zane"></mt-cell>
		  </mt-index-section>
		</mt-index-list>
	</div>
</template>

<style lang="css">
	@import "./css/ticket.css";
</style>

<script type="text/babel">
import Utils from "./Utils/utils";
import SideHeader from "./components/SideHeader.vue";
import TicketBody from "./components/TicketBody.vue";

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
	components:{
		"side-header":SideHeader,
		"ticket-body":TicketBody
	}
}
</script>