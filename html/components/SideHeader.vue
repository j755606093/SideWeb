<template>
	<header>
		<div class="home" v-if="getHeaderState">
			<span>身边订票</span>
		</div>
		<div class="other" v-else>
			<div @click="GoBack" class="left">
				<i class="fa fa-angle-left"></i>
			</div>
			<div class="center">
				<span>{{getHeaderTitle}}</span>
			</div>
		</div>
	</header>
</template>

<style lang="sass">
@import "../sass/utils.scss";
header{
	height:50px;
	// background-color:#14d67c;
	background-color:#2196F3;
	color:$white;
	font-size:1.5rem;
	position:fixed;
	top:0;
	left:0;
	width:100%;
	z-index:100;
	padding:0;
	margin:0;
	// color:#000;
	.home{
		text-align:center;
		line-height:50px;
		font-size:1.8rem;
		font-weight:900;
	}
	.other{
		text-align:center;
		.left{
			height:50px;
			font-size:1.5rem;
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
			if(this.$store.getters.Development.serverUrl!==""){
				console.log(this.formatData(this.$store.getters.Development));//测试
			}
			return this.$store.state.tickets.HeaderIsHome;
		},
		getHeaderTitle(){
			return this.$store.state.tickets.HeaderTitle;
		}
	},
	methods:{
		GoBack(){
			this.$store.commit("CHANGE_HEADER",{isHome:true,Title:"身边订票"});
			this.$router.go(-1);
		},
		formatData(data){
			return JSON.parse(JSON.stringify(data));
		},
	}
}
</script>