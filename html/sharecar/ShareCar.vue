<template>
	<div id="sharecar">
		<!-- <my-header></my-header> -->
		<div style="padding-bottom: 70px;position:relative;">
			<transition 
			enter-active-class="fadeIn"
			leave-active-class="fadeOut">
				<keep-alive>
					<router-view></router-view>
				</keep-alive>
			</transition>
			<!-- <router-view></router-view> -->
		</div>
		<my-footer></my-footer>
	</div>
</template>

<style lang="css">
	@import "../css/utils.css";
</style>

<script type="text/babel">
import Utils from "../Utils/utils";
// import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

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
		// "my-header":Header,
		"my-footer":Footer
	}
}
</script>