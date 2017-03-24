<template type="x/template" id="footer">
	<footer v-show="getfooter">
		<router-link to="/" :class="{'footer':true,'active':activeIndex===0}">
			<template v-if="activeIndex===0">
				<img src="../icon/car_icon.png">
			</template>
			<template v-else>
				<img src="../icon/car_grey_icon.png">
			</template>
			<p>首页</p>
		</router-link>
		<router-link to="/publish" class="footer">
			<div class="circle"></div>
			<img class="center" src="../icon/add_up_icon.png">
			<div class="clear"></div>
			<p class="center">发布行程</p>
		</router-link>
		<router-link to="/user" :class="{'footer':true,'active':activeIndex===1}">
			<template v-if="activeIndex===1">
				<img src="../icon/me_icon.png">
			</template>
			<template v-else>
				<img src="../icon/me_grey_icon.png">
			</template>
			<p>我的</p>
		</router-link>
	</footer>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
footer{
	display:flex;
	flex-direction:row;
	position:fixed;
	bottom:0;
	left:0;
	height:50px;
	line-height: 50px;
	width:100%;
	overflow-x: hidden;
	justify-content:center;
	align-items:center;
	// border-top:1px solid $gray;
	background-color: $white;
	// box-shadow:3px 0 3px 3px #efeeee;
	box-shadow:0 -3px 3px 3px #fafafa;
	z-index: 100;
	overflow:visible;
	.footer{
		flex:1;
		display:flex;
		flex-direction:column;
		justify-content:center;
		align-items:center;
		width:33.3333%;
		color:$gray;
		height: 50px;
		line-height:50px;
		position:relative;
		i{
			font-size:1.8rem;
		}
		>img{
			width:16px;
			height:16px;
		}
		>img.center{
			width:20px;
			height:20px;
			display:inline-block;
			z-index:106;
			margin-top: -10px;
		}
		p{
			font-size:12px;
			color:$gray;
			height:20px;
			line-height:20px;
			font-weight: 900;
		}
		p.center{
			margin-top:5px;
			color:#000;
			z-index:110;
		}
		div.circle{
			position:absolute;
			top:-15px;
			width:60px;
			height:60px;
			left: 26%;
			@include responsive("iphone5"){
				left: 22%;
			}
			@include display_flex('row');
			z-index:101;
			background-color:#fff;
			border-radius: 50%;
			box-shadow:0 -3px 3px 3px #fafafa;
		}
		.clear{
			position:absolute;
			top:0px;
			height:50px;
			left:0;
			width:100%;
			z-index:105;
			background-color:#fff;
		}
	}
	.footer.active{
		color:$blue;
		p{
			color:$blue;
		}
	}
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";

export default {
	props:{
		activeIndex:{
			type:Number,
			default:0
		}
	},
	data () {
		return {
			refresh:""
		}
	},
	created(){
		
	},
	computed:{
		getfooter(){
			return this.$store.getters.getFooterState;
		},
	},
	methods:{
		
	}
}
</script>