<template>
<div id="checkin">
	<!-- 顶部的签到按钮 -->
	<div class="circle-btn">
		<div class="circle-model">
			<div class="circle mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
				<p class="status">已签到</p>
				<span class="hr"></span>
				<p class="check-day">连续1天</p>
			</div>
		</div>
	</div>
</div>
</template>

<style lang="sass">
@import "./sass/utils.scss";
*{
	padding:0;
	margin:0;
}
@mixin displayflex($dircetion) {
	display:flex;
	flex-direction:$dircetion;
	justify-content:center;
	align-items:center;
}
#checkin{
	margin-top:10px;
}
.circle-btn{
	display:flex;
	flex-direction:row;
	justify-content:center;
	align-items:center;
	.circle-model{
		width:160px;
		height:160px;
		border-radius:50%;
		background-color:lighten(#3498db, 40%);
		@include displayflex(row);
		.circle{
			width:140px;
			height:140px;
			border-radius:50%;
			background-color:#3498db;
			@include displayflex(column);
			p{
				color:$white;
				margin-bottom:0;
			}
			p.status{
				font-size:2rem;
			}
			p.check-day{
				font-size:1.4rem;
			}
			span.hr{
				height:0;
				width:100%;
				border-bottom:1px solid #fff;
				margin:10px 0;
			}
		}
	}
}
</style>

<script type="text/babel">
import Utils from "./Utils/utils.js";

export default {
	props: ['Data'],
	data () {
		return {
			
		}
	},
	created(){
		
	},
	components:{
		
	}
}
</script>