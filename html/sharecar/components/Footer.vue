<template type="x/template" id="footer">
	<footer v-show="getfooter">
		<a class="footer active">
			<img src="../icon/car_icon.png">
			<p>首页</p>
		</a>
		<a class="footer">
			<div class="circle"></div>
			<img class="center" src="../icon/add_up_icon.png">
			<div class="clear"></div>
			<p class="center">发布行程</p>
		</a>
		<a class="footer">
			<img src="../icon/me_grey_icon.png">
			<p>我的</p>
		</a>
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
			margin-top: -5px;
		}
		p{
			font-size:12px;
			color:$gray;
			height:20px;
			line-height:20px;
			font-weight: 900;
		}
		p.center{
			margin-top:0px;
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
			// return this.$store.getters.getHeaderState;
		},
	},
	methods:{
		
	}
}
</script>