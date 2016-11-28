<template>
	<header>
		<div class="home" v-if="getHeaderState">
			<span>身边订票</span>
		</div>
		<div class="other" v-else>
			<div class="left">
				<i class="fa fa-angle-left"></i>
			</div>
			<div class="center">
				<span>其他页面</span>
			</div>
		</div>
	</header>
</template>

<style lang="sass">
@import "../sass/utils.scss";
header{
	height:50px;
	background-color:#14d67c;
	color:$white;
	font-size:1.5rem;
	.home{
		text-align:center;
		line-height:50px;
		font-size:1.8rem;
	}
	.other{
		text-align:center;
		.left{
			height:50px;
			font-size:1.8rem;
			position:absolute;
			top:0;
			left:0;
			width:50px;
			i{
				font-size:3rem;
				line-height:50px;
			}
		}
		.center{
			line-height:50px;
			font-size:1.8rem;
		}
	}
}
</style>

<script type="text/babel">
import { mapGetters } from 'vuex'
import Utils from "../Utils/utils";

export default {
	data () {
		return {
			
		}
	},
	created(){
		// setInterval(()=>{
		// 	this.$store.commit("CHANGE_HEADER",false);
		// 	console.log(this.$store.state.tickes.HeaderIsHome)
		// },3000)
	},
	computed:{
		getHeaderState(){
			return this.$store.state.tickets.HeaderIsHome;
		}
	},
	methods:{
		downloadapp(){
			//跳转下载地址
			// window.location.href = "";
		}
	}
}
</script>