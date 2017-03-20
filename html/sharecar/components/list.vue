<template type="x/template">
	<div class="list">
		<div class="list__header">
			<div class="header--avatar">
				<img src="../icon/women_icon.png">
			</div>
			<span>人物名</span>
			<div class="header--sex">
				<img src="../icon/women_icon.png">
			</div>
			<div class="header--active">
				<img src="../icon/hand_icon.png">
				<span>请他接我</span>
			</div>
		</div>
		<div class="list__body">
			<div class="list__body--line"></div>
			<div class="list__body--line"></div>
			<div class="list__body--line"></div>
		</div>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";

.list{
	background-color: #fff;
	width:100%;
	margin-top:10px;
}
.list__header{
	height:65px;
	@include display_flex('row');
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";

export default {
	props:{
		
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
		
	}
}
</script>