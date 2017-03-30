<template>
	<div id="checkin">
		<div>
			<transition 
			enter-active-class="fadeIn"
			leave-active-class="fadeOut">
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</transition>
		</div>
	</div>
</template>

<style lang="css">

</style>

<script type="text/babel">
import Utils from "../Utils/utils";

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