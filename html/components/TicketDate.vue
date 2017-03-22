<template type="x/template" id="ticketorderlist">
	<div class="ticketdate">
		<div class="yes" @click="yes"><span>确定</span></div>
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
			<!-- 当前月 -->
			<div class="date-body-header">
				<p :class="{gray:side!=='top'}">{{firstTimeText}}</p>
			</div>
			<div class="date-body-lists">
				<div v-for="(item,index) in white" v-if="item<firstTimeWeek">
					<span class="white"></span>
				</div>
				<div v-for="(item,index) in day" v-if="item<=firstTimeMaxDay">
					<span @click="selectDate(item+'_one',$event)" :class="{gray:item<=firstTimeMaxDay,active:item>=firstTimeDay && item<=firstTimeDay+10,selected:selected===item+'_one'}">{{item===firstTimeDay?'今天':item}}</span>
				</div>
			</div>
			<!-- 下个月 -->
			<div class="date-body-header">
				<p :class="{gray:side!=='bottom'}">{{secondTimeText}}</p>
			</div>
			<div class="date-body-lists">
				<div v-for="(item,index) in white" v-if="item<secondTimeWeek">
					<span class="white"></span>
				</div>
				<div v-for="(item,index) in day" v-if="item<=secondTimeMaxDay">
					<span @click="selectDate(item+'_two',$event)" :class="{gray:item<=secondTimeMaxDay,active:item<secondTimeDay&&twoMonth.indexOf(index)>-1,selected:selected===item+'_two'}">{{item}}</span>
				</div>
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
import { Toast } from 'mint-ui';

export default {
	data () {
		return {
			firstTimeText:"",//2017年2月
			firstTimeDay:0,//当前日期号
			firstTimeMaxDay:0,//当前月份最大日期数
			firstTimeWeek:0,//当前一号星期
			
			secondTimeText:"",
			secondTimeDay:0,//最远的一天
			secondTimeMaxDay:0,//当前月份最大日期数
			secondTimeWeek:0,//星期

			firsttimeDate:{
				year:0,
				month:0
			},//记录两个月的数据
			secondtimeDate:{
				year:0,
				month:0
			},//记录两个月的数据

			white:[0,1,2,3,4,5,6],//方便循环用
			day:[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,31],
			selected:"15_one",
			side:"top",//或者bottom
			twoMonth:[],//第二个月可以显示的日期
		}
	},
	activated(){
		this.$store.commit("CHANGE_HEADER",{isHome:false,Title:"选择日期"});
		this.$store.commit("SET_SHOWHEADER",true);
		this.initTime();
		this.$store.commit("SET_SHOWBACK",false);
	},
	created(){
		// let nowDate = new Date();
		this.$store.commit("CHANGE_HEADER",{isHome:false,Title:"选择日期"});
		this.$store.commit("SET_SHOWHEADER",true);
		this.initTime();
		this.$store.commit("SET_SHOWBACK",false);

		//如果有数据
		if(this.$store.getters.getInfo.startDate.server){
			let date = new Date(this.$store.getters.getInfo.startDate.server);
			if(date.getMonth()+1===this.firsttimeDate.month){
				//第一个月的
				this.selected = date.getDate()+"_one";
				this.side = "top";
			}
			else{
				this.selected = date.getDate()+"_two";
				this.side = "bottom";
			}
		}
		else{
			//没有数据就显示今天的
			this.selected = this.firstTimeDay+"_one";
		}
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
			let date_second = new Date(Date.now()+10*24*60*60*1000);//可以买最远十天之内的票

			let year = date.getYear()-100+2000;
			let month = date.getMonth()+1;

			//第一个月
			this.firstTimeDay = date.getDate();
			date.setDate(1);//设置为当前月1号
			this.firstTimeWeek = date.getDay();//获取当前月一号星期
			this.firstTimeMaxDay = this.getMaxMonth(year,month);//获取当前一号星期
			
			//第二个月(可能没有第二个月)
			this.secondTimeDay = date_second.getDate();
			date_second.setDate(1);//设置为当前月1号
			this.secondTimeWeek = date_second.getDay();

			this.firstTimeText = `${year}年 ${month}月`;
			this.firsttimeDate={
				year:year,
				month:month
			}
			
			//如果下个月是明年
			if(month+1>12){
				this.secondTimeText = `${year+1}年 1月`;
				this.secondTimeMaxDay = this.getMaxMonth(year+1,1);
				this.secondtimeDate={
					year:year+1,
					month:1
				}
			}
			else{
				this.secondTimeText = `${year}年 ${month+1}月`;
				this.secondTimeMaxDay = this.getMaxMonth(year,month+1);
				this.secondtimeDate={
					year:year,
					month:month+1
				}
			}
			this.showMonth();
		},
		/** 判断第二个月是否有需要显示的日期 */
		showMonth(){
			let date_second = new Date(Date.now()+30*24*60*60*1000);//设置下个月
			date_second.setDate(1);//设置为下个月1号
			let time = Date.now()+10*24*60*60*1000;//可以购买最远的日期(十天)
			
			// 下个月可以选择的日期都推送到twoMonth中
			for(let i=0;i<=31;i++){
				let se = date_second.getTime()+i*24*60*60*1000;

				if(se<=time){
					this.twoMonth.push(i);
				}
			}
			console.log(this.twoMonth)
		},
		/** 获取当前月最大天数 */
		getMaxMonth(year,month){
			let days = 0;
			if(month===2){
				days = year % 4 === 0 ? 29 : 28;
			}
			else if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
        //月份为：1,3,5,7,8,10,12 时，为大月.则天数为31；
        days = 31;
      }
      else {
        //其他月份，天数为：30.
        days = 30;

      }
      return days;
		},
		/** 选择日期 */
		selectDate(index,event){
			if(index===this.selected){
				return;
			}
			if(event.target.className.indexOf("active")>-1){
				//可以选中
				this.selected = index;
				let arrayTime = this.selected.split("_");
				if(arrayTime[1]==="two"){
					//下个月
					this.side = "bottom";
				}
				else{
					//这个月
					this.side = "top";
				}
				this.yes();//点击直接确定然后返回
			}
		},
		yes(){
			let arrayTime = this.selected.split("_");
			let date ;

			if(arrayTime[1]==="two"){
				//下个月
				date = new Date(this.secondtimeDate.year,this.secondtimeDate.month-1,arrayTime[0]);
			}
			else{
				//这个月
				date = new Date(this.firsttimeDate.year,this.firsttimeDate.month-1,arrayTime[0]);
			}

			this.$store.dispatch("setStartDate",{
				date:this.formatNow(date),
				week:Utils.formatWeek(date),
				server:date
			});
			this.$router.go(-1);
		},
		formatNow(date){
			if(typeof date==="string"){
				date = new Date(date);
			}
			console.log(date)
			let year = date.getYear()-100+2000;
			let month = date.getMonth()+1;
			let day = date.getDate();

			// return month+"月"+day+"日";
			return year+"-"+(month>9?month:"0"+month)+"-"+(day>9?day:"0"+day)
		},
	}
}
</script>