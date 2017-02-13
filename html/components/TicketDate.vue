<template type="x/template" id="ticketorderlist">
	<div class="ticketdate">
		<div class="date-header">
			<span>日</span>
			<span>一</span>
			<span>二</span>
			<span>三</span>
			<span>四</span>
			<span>五</span>
			<span>六</span>
		</div>
		<div class="date-body">
			<div class="date-body-header">
				<p>{{firstTimeText}}</p>
			</div>
			<div class="date-body-lists">
				<span v-for="(item,index) in white" v-if="item<firstTimeWeek" class="white"></span>
				<span></span>
			</div>
		</div>
	</div>
</template>

<style lang="css">
@import "../css/ticketdate.css";
</style>

<script type="text/babel">
import Utils from "../Utils/utils";
const _ = require("underscore");

export default {
	data () {
		return {
			firstTimeText:"",//2017年2月
			firstTimeDay:0,//当前日期号
			firstTimeMaxDay:0,//当前月份最大日期数
			firstTimeWeek:0,//星期

			secondTimeText:"",
			secondTimeDay:0,
			secondTimeMaxDay:0,//当前月份最大日期数
			secondTimeWeek:0,//星期

			white:[0,1,2,3,4,5,6],//方便循环用
			month:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
		}
	},
	created(){
		// let nowDate = new Date();
		this.$store.commit("CHANGE_HEADER",{isHome:false,Title:"选择日期"});
		this.initTime();

	},
	filters:{
		
	},
	watch:{
		
	},
	computed:{
		
	},
	methods:{
		initTime(){
			let date = new Date();
			let date_second = new Date(date.getTime()+30*24*60*60*60*1000);

			let year = date.getYear()-100+2000;
			let month = date.getMonth()+1;

			//第一个月
			this.firstTimeWeek = date.getDay();
			this.firstTimeDay = date.getDate();
			date.setDate(0);
			this.firstTimeMaxDay = date.getDate();
			
			//第二个月
			this.secondTimeWeek = date_second.getDay();
			this.secondTimeDay = date_second.getDate();
			date_second.setDate(0);
			this.secondTimeMaxDay = date_second.getDate();

			this.firstTimeText = `${year}年 ${month}月`;
			if(month+1>12){
				this.secondTimeText = `${year+1}年 1月`;
			}
			else{
				this.secondTimeText = `${year}年 ${month+1}月`;
			}
		}
	}
}
</script>