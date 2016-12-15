<template>
	<div class="ticketbody">
		<div @click="GoStartCity" class="go block">
			<span><i class="fa fa-location-arrow"></i>出发点</span>
			<span>
				{{getStartCity}}
				<!-- <span class="station">{{getStartCityStation}}</span> -->
			</span>
		</div>
		<div @click="GoEndCity" class="to block">
			<span><i class="fa fa-location-arrow"></i>到达点</span>
			<span>{{getEndCity}}
			<!-- <span class="station">{{getEndCityStation}}</span> -->
			</span>
		</div>
		<div @click="openPicker" class="data">
			<span><i class="fa fa-calendar"></i>出发日期</span>
			<!-- <span v-text="showTime"></span> -->
			<date-picker :date="startTime" :option="option" :limit="limit"></date-picker>
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
		<!-- <mt-datetime-picker
			ref="picker"
			type="date"
			:start-date="nowDate"
			:end-date="endDate"
			year-format="{value} 年"
			month-format="{value} 月"
			date-format="{value} 日"
			v-model="pickerValue"
			@confirm="handleConfirm">
		</mt-datetime-picker> -->
		<!-- 定位 -->
		<div class="location">
			<div class="showload" v-if="locationLoad">
				<i class="fa fa-circle-o-notch fa-spin"></i>
				<span>正在为你定位最近的上车点...</span>
			</div>
			<div class="location-result" v-else>
				<i class="fa fa-map-marker"></i>
				<span>{{locationName}}</span>
				<span @click="refreshLocation" class="refresh-location">重新定位</span>
			</div>
		</div>
		<!-- 查询记录 -->
		<div class="search-record" v-if="localStorage.length!==0">
			<p>历史搜索</p>
			<div class="list" v-for="(list,index) in localStorage" v-bind:key="index">
				<span class="first">{{list.startCity}}</span>
				<span>{{list.endCity}}</span>
				<i @click="queryRecord(index)" class="fa fa-search">查询</i>
			</div>
		</div>
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
import DatePicker from 'vue-datepicker'
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
			localStorage:null,//本地搜索记录
			locationLoad:true,//是否在加载定位记录
			locationName:"",//定位最近的车站位置名
			// startCitySlots: [{
			// 	flex: 1,
			// 	values: [],
			// 	className: 'startcity'
			// }],
			// endCitySlots: [{
			// 	flex: 1,
			// 	values: [],
			// 	className: 'endcity'
			// }],
			// for Vue 2.0
      startTime: {
        time: ""
      },

      option: {
        type: 'day',
        week: ['一', '二', '三', '四', '五', '六','日'],
        month: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        format: 'YYYY-MM-DD',
        placeholder: '选择日期',
        inputStyle: {
          'display': 'inline-block',
          'line-height': '60px',
          'height':"60px",
          'font-size': '1.8rem',
          "background-color":"transparent",
          'color': '#5F5F5F'
        },
        color: {
          header: '#009688',
          headerText: '#fff'
        },
        buttons: {
          ok: '确定',
          cancel: '取消'
        },
        overlayOpacity: 0.5, // 0.5 as default
        dismissible: true // as true as default
      },
      // timeoption: {
      //   type: 'min',
      //   week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      //   month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      //   format: 'YYYY-MM-DD HH:mm'
      // },
      // multiOption: {
      //   type: 'multi-day',
      //   week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      //   month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      //   format:"YYYY-MM-DD HH:mm"
      // },
      limit: [{
        type: 'weekday',
        available: [1, 2, 3, 4, 5,6,7]
      },
      // {
      //   type: 'fromto',
      //   from: '2016-02-01',
      //   to: '2016-02-20'
      // }
      ]
		}
	},
	created(){
		this.$store.commit("CHANGE_HEADER",{isHome:true,Title:"身边订票"});
		// 设置初始时间
		this.handleConfirm(new Date());
		if(this.$store.getters.getInfo.startDate.server){
			// 之前查过
			this.startTime.time = this.formatNow(this.$store.getters.getInfo.startDate.server)
		}
		else{
			this.startTime.time = this.formatNow(new Date())
		}
		
		// 获取本地数据
		this.localStorage = this.getLocalStore();

		// 获取位置
		navigator.geolocation.getCurrentPosition(this.showPosition,this.getPositionError);
	},
	filters:{
		
	},
	watch:{
		startTime:{
			handler:function(newValue,oldValue){
				let date = new Date(newValue.time);
				this.showTime = this.formatNow(date);
				this.showWeek = Utils.formatWeek(date);
				//记录选取的时间
				this.$store.dispatch("setStartDate",{
					date:this.showTime,
					week:this.showWeek,
					server:date
				});
			},
			deep: true
		}
	},
	computed:{
		getStartCity(){
			this.startCity = this.$store.state.tickets.startCity;
			return this.startCity.Name;
		},
		// getStartCityStation(){
		// 	if(this.startCity.Station!==""){
		// 		return this.startCity.Station;
		// 	}
		// 	else{
		// 		return "无站台";
		// 	}
		// },
		getEndCity(){
			this.endCity = this.$store.state.tickets.endCity;
			return this.endCity.Name;
		},
		// getEndCityStation(){
		// 	if(this.endCity.Station!==""){
		// 		return this.endCity.Station;
		// 	}
		// 	else{
		// 		return "无站台";
		// 	}
		// },
	},
	methods:{
		formatDate(data){
			return Utils.formatDate(data);
		},
		showPosition(position){
			let {latitude,longitude,accuracy,altitude,altitudeAccuracy} = position.coords;
			this.$store.dispatch("setLocationResult",{
				latitude:latitude,
				longitude:longitude
			}).then(data=>{
				if(!data.Data){
					//没有数据
					this.locationLoad = false;//停止界面加载提示
					this.locationName = "你的附近没有上车点";
					return ;
				}
				this.locationName = data.Data.Name;
				this.$store.dispatch("setStartCity",{
					Code:data.Data.Id,
					Name:data.Data.Name
				});
				this.locationLoad = false;//停止界面加载提示
			}).catch(error=>{
				this.locationLoad = false;//停止界面加载提示
				this.locationName = "请稍后重试...";
				Toast({
				  message: "服务器错误,请稍后重试...",
				  position: 'bottom',
				  duration: 3000,
				});
			})
		},
		getPositionError(error){
			if(error){
				// 获取位置出错
				this.locationLoad = false;//停止界面加载提示
				this.locationName = "无法获取当前位置";
				Toast({
				  message: "无法获取当前位置",
				  position: 'bottom',
				  duration: 3000
				});
			}
		},
		refreshLocation(){
			//重新定位
			navigator.geolocation.getCurrentPosition(this.showPosition,this.getPositionError);
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
				// this.$store.getters.getCityList.startCityList.map((item,index)=>{
				// 	item.Content.map(content=>{
				// 		this.startCitySlots[0].values.push(content.Name)
				// 	});
				// });
				// Indicator.close();
				// this.startpopupVisible = true;
			}).catch(error=>{
				Indicator.close();
				Toast({
				  message: "服务器错误,请稍后重试...",
				  position: 'bottom',
				  duration: 3000
				});
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
			}).catch(error=>{
				Indicator.close();
				Toast({
				  message: "服务器错误,请稍后重试...",
				  position: 'bottom',
				  duration: 3000
				});
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
				week:this.showWeek,
				server:date
			});
		},
		formatNow(date){
			if(typeof date==="string"){
				date = new Date(date);
			}
			let year = date.getYear()-100+2000;
			let month = date.getMonth()+1;
			let day = date.getDate();

			// return month+"月"+day+"日";
			return year+"-"+(month>9?month:"0"+month)+"-"+(day>9?day:"0"+day)
		},
		query(){
			if(this.startCity.Name===this.endCity.Name){
				// 地点相同
				Toast({
				  message: '出发点不能和到达点相同,请修改!',
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
				this.localStore(this.startCity,this.endCity)
				Indicator.close();
				this.$router.push({name:"ticketresult"});
			}).catch(error=>{
				Indicator.close();
				Toast({
				  message: "服务器错误,请稍后重试...",
				  position: 'bottom',
				  duration: 3000
				});
			});
		},
		// 通过本地的搜索记录查询
		queryRecord(index){
			let data = this.getLocalStore()[index];

			this.$store.dispatch("setStartCity",{
				Name:data.startCity,
				Code:data.startCode
			});
			this.$store.dispatch("setEndCity",{
				Name:data.endCity,
				Code:data.endCode
			});
			this.query();
		},
		//获取储存的搜索数据
		getLocalStore(){
			if(window.localStorage.getItem("City")!==null){
				//之前有数据
				let oldValue = JSON.parse(window.localStorage.getItem("City"));//获取数据
				return oldValue;
			}
			else{
				// 第一次储存
				return [];
			}
		},
		//存储搜索记录
		localStore(city1,city2){
			let json = {
				startCity:city1.Name,
				startCode:city1.Code,
				endCity:city2.Name,
				endCode:city2.Code
			}
			let data = this.getLocalStore();

			// 检测是否已有相同的数据路线
			for(let i=0;i<data.length;i++){
				if(data[i].startCode===json.startCode 
					&& data[i].endCode===json.endCode){
					return ;
				}
			}
			data.push(json);

			window.localStorage.setItem("City",JSON.stringify(data));
		},
		onStartValuesChange(picker, values){
			this.$store.dispatch("setStartCity",{Code:"00000",Name:values[0]});
		},
		onEndValuesChange(picker, values){
			this.$store.dispatch("setEndCity",{Code:"00000",Name:values[0]});
		}
	},
	components: {
    'date-picker': DatePicker
  }
}
</script>