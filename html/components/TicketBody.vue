<template>
	<div class="ticketbody">
		<div @click="GoStartCity" class="go block">
			<span><i class="fa fa-location-arrow"></i>出发点</span>
			<span>
				{{getStartCity}}
				<span class="station">{{getStartCityStation}}</span>
			</span>
		</div>
		<div @click="GoEndCity" class="to block">
			<span><i class="fa fa-location-arrow"></i>到达点</span>
			<span>{{getEndCity}}<span class="station">{{getEndCityStation}}</span></span>
		</div>
		<div @click="openPicker" class="data">
			<span><i class="fa fa-calendar"></i>出发日期</span>
			<span v-text="showTime"></span>
			<span v-text="showWeek"></span>
		</div>
		<div class="query">
			<button @click="query" class="btn">查询</button>
		</div>
		<!-- 出发地址 -->
		<!-- <mt-popup
		  v-model="startpopupVisible"
		  position="bottom"
		  class="popup-visible">
		  <mt-picker :slots="startCitySlots" @change="onStartValuesChange"></mt-picker>
		</mt-popup> -->
		
		<!-- 到底地址 -->
	<!-- 	<mt-popup
		  v-model="endpopupVisible"
		  position="bottom"
		  class="popup-visible">
		  <mt-picker :slots="endCitySlots" @change="onEndValuesChange"></mt-picker>
		</mt-popup> -->
		
		<!-- 日期选择 -->
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
.popup-visible{
	width:100%;
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
			endCity:null,
			startpopupVisible:false,//显示出发选择
			endpopupVisible:false,//显示到达选择
			startCitySlots: [{
				flex: 1,
				values: [],
				className: 'startcity'
			}],
			endCitySlots: [{
				flex: 1,
				values: [],
				className: 'endcity'
			}],
		}
	},
	created(){
		this.$store.commit("CHANGE_HEADER",{isHome:true,Title:"身边订票"});
		// 设置初始时间
		this.handleConfirm(new Date());
	},
	filters:{
		
	},
	computed:{
		getStartCity(){
			this.startCity = this.$store.state.tickets.startCity;
			return this.startCity.Name;
		},
		getStartCityStation(){
			if(this.startCity.Station!==""){
				return this.startCity.Station;
			}
			else{
				return "无站台";
			}
		},
		getEndCity(){
			this.endCity = this.$store.state.tickets.endCity;
			return this.endCity.Name;
		},
		getEndCityStation(){
			if(this.endCity.Station!==""){
				return this.endCity.Station;
			}
			else{
				return "无站台";
			}
		},
	},
	methods:{
		formatDate(data){
			return Utils.formatDate(data);
		},
		GoStartCity(){
			// if(this.$store.getters.getCityList.startCityList){
			// 	this.startpopupVisible = true;
			// 	return;
			// }
			// 提示加载中
			Indicator.open({
				text: '加载中...',
				spinnerType: 'double-bounce'
			});

			this.$store.dispatch("setStartCityList").then((data)=>{
				Indicator.close();
				this.$router.push({name:"ticketstartcity"});
				// this.$store.getters.getCityList.startCityList.map((item,index)=>{
				// 	item.Content.map(content=>{
				// 		this.startCitySlots[0].values.push(content.Name)
				// 	});
				// });
				// Indicator.close();
				// this.startpopupVisible = true;
			});
		},
		GoEndCity(){
			// if(this.$store.getters.getCityList.endCityList){
			// 	this.startpopupVisible = true;
			// 	return;
			// }
			// 提示加载中
			Indicator.open({
				text: '加载中...',
				spinnerType: 'double-bounce'
			});

			this.$store.dispatch("setEndCityList").then((data)=>{
				Indicator.close();
				this.$router.push({name:"ticketendcity"});
				// this.$store.getters.getCityList.endCityList.map((item,index)=>{
				// 	item.Content.map(content=>{
				// 		this.endCitySlots[0].values.push(content.Name)
				// 	});
				// });
				// Indicator.close();
				// this.endpopupVisible = true;
				// this.$router.push({name:"ticketendcity"});
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
			if(this.startCity.Name===this.endCity.Name){
				// 地点相同
				Toast({
				  message: '出发城市不能和到达城市相同,请修改!',
				  position: 'bottom',
				  duration: 3000
				});
				return ;
			}
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
		onStartValuesChange(picker, values){
			this.$store.dispatch("setStartCity",{Code:"00000",Name:values[0]});
		},
		onEndValuesChange(picker, values){
			this.$store.dispatch("setEndCity",{Code:"00000",Name:values[0]});
		}
	}
}
</script>