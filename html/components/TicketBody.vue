<template>
	<div class="ticketbody">
		<div @click="GoStartCity" class="go block">
			<span><i class="fa fa-location-arrow"></i>出发城市</span>
			<span v-text="getStartCity">上海</span>
		</div>
		<div @click="GoEndCity" class="to block">
			<span><i class="fa fa-location-arrow"></i>到达城市</span>
			<span v-text="getEndCity"></span>
		</div>
		<div @click="openPicker" class="data">
			<span><i class="fa fa-calendar"></i>出发日期</span>
			<span v-text="showTime"></span>
			<span v-text="showWeek"></span>
		</div>
		<div class="query">
			<button @click="query" class="btn">查询</button>
		</div>
		<mt-datetime-picker
			ref="picker"
			type="date"
			:start-date="nowDate"
			:end-date="endDate"
			year-format="{value} 年"
			month-format="{value} 月"
			date-format="{value} 日"
			v-model="pickerValue"
			@confirm="handleConfirm">
		</mt-datetime-picker>
	</div>
</template>

<style lang="css">
@import "../css/ticketbody.css";
.ticketbody{
	position:absolute;
}
</style>

<script type="text/babel">
import Utils from "../Utils/utils";
import { Indicator,Toast } from 'mint-ui';
import "whatwg-fetch";

export default {
	data () {
		return {
			nowDate:new Date(),
			endDate:new Date(Date.now()+1000*60*60*24*30*2),//两个月
			pickerValue:null,
			showTime:"",//几号
			showWeek:"",//星期几,
			startCity:null,
			endCity:null
		}
	},
	created(){
		// 设置初始时间
		this.handleConfirm(new Date());
	},
	filters:{
		
	},
	computed:{
		getStartCity(){
			this.startCity = this.$store.state.tickets.startCity;
			return this.$store.getters.getInfo.startCity.Name;
		},
		getEndCity(){
			this.endCity = this.$store.state.tickets.endCity;
			return this.$store.getters.getInfo.endCity.Name;
		}
	},
	methods:{
		formatDate(data){
			return Utils.formatDate(data);
		},
		GoStartCity(){
			// 提示加载中
			Indicator.open({
				text: '加载中...',
				spinnerType: 'double-bounce'
			});
			this.$store.dispatch("setStartCityList").then((data)=>{
				Indicator.close();
				this.$router.push({name:"ticketstartcity"});
			});
		},
		GoEndCity(){
			// 提示加载中
			Indicator.open({
				text: '加载中...',
				spinnerType: 'double-bounce'
			});
			this.$store.dispatch("setEndCityList").then((data)=>{
				Indicator.close();
				this.$router.push({name:"ticketendcity"});
			});
		},
		openPicker() {
			this.$refs.picker.open();
		},
		handleConfirm(date){
			this.showTime = this.formatNow(date);
			this.showWeek = Utils.formatWeek(date);
			//记录选取的时间
			this.$store.dispatch("setStartDate",{
				date:this.showTime,
				week:this.showWeek
			});
		},
		formatNow(date){
			let month = date.getMonth()+1;
			let day = date.getDate();

			return month+"月"+day+"日";
		},
		query(){
		// 	Indicator.open({
			//   text: '加载中...',
			//   spinnerType: 'double-bounce'
			// });
			// this.submit().then((result)=>{
			// 	console.log(result)
			// 	Indicator.close();
			// })
			console.log(this.startCity,this.endCity);
			console.log(this.pickerValue);
			// 提示加载中
			Indicator.open({
				text: '加载中...',
				spinnerType: 'double-bounce'
			});
			this.$store.dispatch("setResultList").then((data)=>{
				Indicator.close();
				this.$router.push({name:"ticketresult"});
			});
		},
		submit(){
			
		}
	}
}
</script>