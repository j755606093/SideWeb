<template>
	<div class="ticketbody">
		<div @click="GoStartCity" class="go block">
			<span><i class="fa fa-location-arrow"></i>出发城市</span>
			<span>上海</span>
		</div>
		<div @click="GoEndCity" class="to block">
			<span><i class="fa fa-location-arrow"></i>到达城市</span>
			<span>北京</span>
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

export default {
  data () {
    return {
      nowDate:new Date(),
      endDate:new Date(Date.now()+1000*60*60*24*30*2),//两个月
      pickerValue:null,
      showTime:"",//几号
      showWeek:"",//星期几
    }
  },
  created(){
		this.showTime = this.formatNow(new Date());
		this.showWeek = Utils.formatWeek(new Date());
  },
  filters:{
  	
  },
  computed:{
  	
  },
  methods:{
  	formatDate(data){
  		return Utils.formatDate(data);
  	},
  	GoStartCity(){
			this.$router.push({name:"ticketstartcity"});
  	},
  	GoEndCity(){
			this.$router.push({name:"ticketendcity"});
  	},
  	openPicker() {
      this.$refs.picker.open();
    },
    handleConfirm(date){
			this.showTime = this.formatNow(date);
			this.showWeek = Utils.formatWeek(date);
    },
    formatNow(date){
			let month = date.getMonth()+1;
			let day = date.getDate();

			return month+"月"+day+"日";
  	},
  	query(){
  		Toast({
			  message: '提示',
			  position: 'bottom',
			  duration: 3000
			});
  		Indicator.open({
			  text: '加载中...',
			  spinnerType: 'double-bounce'
			});
			this.submit().then((result)=>{
				console.log(result)
				Indicator.close();
			})
  	},
  	submit(){
  		return new Promise((resolve,rejcet)=>{
  			setTimeout(()=>{
					resolve(1);
  			},2000)
  		})
  	}
  }
}
</script>