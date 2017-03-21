<template type="x/template">
	<div class="tripdetail">
		<div class="trip__info">
			<my-list :types="pageIndex" :list="item" :index="index"></my-list>
		</div>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
.trip__info{
	width:100%;
	padding:0 10px;
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import List from "./list.vue";

export default {
	data () {
		return {
			
		}
	},
	created(){
		
	},
	computed:{
		
	},
	methods:{
		
	},
	filters:{
		formatTime(time){
			const formatDate = new Date(time);//转换为DATE对象
			const Today = new Date();

			let text = ""

			if(Today.getDate()===formatDate.getDate()&&formatDate.getMonth()===Today.getMonth()){
				// 说明是今天
				text = "今天";
			}
			else{
				text = `${formatDate.getMonth()+1}月${formatDate.getDate()}号`;
			}

			text = `${text} (${Utils.formatWeek(formatDate)})`;
			text = `${text} ${formatDate.getHours()}:${formatDate.getMinutes()>9?formatDate.getMinutes():"0"+formatDate.getMinutes()}`;
			return text;
		}
	},
	components:{
		"my-list":List
	}
}
</script>