<template type="x/template" id="ticketheader">
	<header v-show="showHeader">
		<div class="home" v-if="getHeaderState">
			<span>身边订票</span>
		</div>
		<div class="other" v-else>
			<div @click="GoBack" v-show="showBack" class="left">
				<img src="../picture/back_icon.png">
				<!-- <i class="fa fa-angle-left"></i> -->
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
	z-index:100000;
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
			width:70px;
			img{
				width:19px;
				height:19px;
				line-height:50px;
				position:absolute;
				left:25px;
				top:15.5px;
			}
			// i{
			// 	font-size:3rem;
			// 	line-height:50px;
			// }
		}
		.center{
			line-height:50px;
			font-size:18px;
			font-weight:900;
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
		showBack(){
			return this.$store.state.tickets.showBack;
		},
		showHeader(){
			return this.$store.state.tickets.showHeader;
		},
		getHeaderTitle(){
			return this.$store.state.tickets.HeaderTitle;
		}
	},
	methods:{
		GoBack(){
			if(this.getHeaderTitle==="优惠券"){
				// 如果是优惠券页面返回主页,就需要使用replace
				// 因为有可能进入优惠券页面的人是直接url上进入的
				// 此时路由栈中并没有ticketbody的路由,如果直接
				// 返回上一层,会产生问题并且不会执行预料的操作
				this.$router.replace({name:"ticketbody"});
			}
			else{
				this.$router.go(-1);
			}
			this.$store.commit("CHANGE_HEADER",{isHome:true,Title:"身边订票"});
		},
		formatData(data){
			return JSON.parse(JSON.stringify(data));
		},
	}
}
</script>