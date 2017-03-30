<template>
	<div>
		<transition 
			enter-active-class="fadeIn"
			leave-active-class="fadeOut">
				<keep-alive exclude-"TicketPay">
					<router-view></router-view>
				</keep-alive>
			</transition>
	</div>
</template>

<style lang="css">
	
</style>

<script type="text/babel">
// import Utils from "../Utils/utils";

export default {
	data () {
		return {
			
		}
	},
	created(){
		
	},
	methods:{
		
	},
	computed:{
		
	},
	components:{
	}
}
</script>