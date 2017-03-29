<template type="x/template" id="header">
	<header :style="{position:Position}" v-show="showHeader">
		<div class="home" v-if="!showBack">
			<span>{{headerTitle}}</span>
		</div>
		<div class="other" v-else>
			<div @click="GoBack" class="left">
				<img src="../icon/back_icon.png">
			</div>
			<div class="center">
				<span>{{headerTitle}}</span>
			</div>
		</div>
	</header>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
header{
	height:50px;
	// background-color:#14d67c;
	background-color:#fff;
	color:$white;
	font-size:1.5rem;
	position:fixed;
	top:0;
	left:0;
	width:100%;
	z-index:1000;
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
		}
		.center{
			line-height:50px;
			font-size:18px;
			font-weight:900;
			color:#000;
		}
	}
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";

export default {
	props:{
		showBack:{
			type:Boolean,
			default:true
		},
		showHeader:{
			type:Boolean,
			default:true
		},
		headerTitle:{
			type:String,
			default:"拼车"
		},
		Position:{
			type:String,
			default:"fixed"
		}
	},
	data () {
		return {
			
		}
	},
	created(){
		
	},
	computed:{
		
	},
	methods:{
		GoBack(){
			// 如果是分享链接直接进来的
			if(history.length===1){
				this.$router.push({path:"/"});
			}
			else{
				// 修复进入推荐页后查看行程再返回无法返回到首页的bug
				if(this.$router.history.current.name==="commend"){
					this.$router.push({path:"/"});
				}
				else{
					this.$router.go(-1);
				}
			}
			// console.log(history.length)
		}
	}
}
</script>