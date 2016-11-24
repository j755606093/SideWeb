<template>
	<div class="downloadapp" id="downloadapp">
		<p>你看起来对这个内容很感兴趣,快去下载APP吧,更多精彩等着你!</p>
		<button @click="downloadapp">下载</button>
	</div>
</template>

<style lang="sass">
@import "../sass/utils.scss";
.downloadapp{
	width:100%;
	position:fixed;
	bottom:0;
	left: 0;
	height:40px;
	background-color: rgba(0,0,0,.6);
	display: flex;
	flex-direction:row;
	>p{
		flex:0.7;
		color:$white;
		text-align:center;
		line-height:20px;
	}
	>button{
		flex:0.3;
		outline: none;
		border:1px solid $white;
		color:$blue;
		margin:5px 10px;
		background-color:$blue;
		color:$white;
		border-radius:10px;
		font-size:1.2rem;
	}
}
</style>

<script type="text/babel">
import Utils from "../Utils/utils";

export default {
	props:["header"],
	data () {
		return {
			
		}
	},
	created(){
		
	},
	methods:{
		downloadapp(){
			//跳转下载地址
			// window.location.href = "";
		}
	}
}
</script>