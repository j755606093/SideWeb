<template type="x/template" id="ticketbody">
	<div class="ticketbody">
		<!-- 轮播图 -->
		<div class="slider">
			<a href="#">
				<img class="slider-item" src="../picture/slider1.png">
			</a>
			<a href="#">
				<img class="slider-item" src="../picture/slider2.png">
			</a>
		</div>
		<div class="index-body">
			<!-- 出发点和到达点 -->
			<div class="location">
				<span @click="GoStartCity">{{getStartCity}}</span>
				<div><span></span></div>
				<span @click="GoEndCity">{{getEndCity}}</span>
			</div>
			<!-- 选择时间 -->
			<div class="date">
				<span>出发时间</span>
				<div @click="openDate"><span>{{showTime}}</span></div>
				<p>
					<span v-text="showWeek"></span>
					<i class="fa fa-angle-right"></i>
				</p>
			</div>
			<!-- 搜索按钮 -->
			<button @click="query" class="btn">查询</button>
			<!-- 历史搜索 -->
			<div class="search-record" v-if="localStorage.length!==0">
				<div class="list" v-for="(list,index) in localStorage.slice(0,5)" v-bind:key="index" @click="queryRecord(index)">
					<span class="first">{{list.startCity}}</span>
					<div><span></span></div>
					<span>{{list.endCity}}</span>
				</div>
				<p @click="clearLocalStore">清除历史搜索</p>
			</div>
		</div>
		<!-- <div @click="GoStartCity" class="go block">
			<span>
			<img src="../picture/map_red.png">
			出发点</span>
			<span>
				{{getStartCity}}
				<img class="right" src="../picture/search.png">
			</span>
		</div>
		<div @click="GoEndCity" class="to block">
			<span>
			<img src="../picture/map_blue.png">
			到达点</span>
			<span>{{getEndCity}}
			<img class="right" src="../picture/search.png">
			</span>
		</div> -->
		<!-- <div @click="openPicker" class="data">
			<span>
			<img src="../picture/date.png">
			出发日期</span>
			<date-picker :date="startTime" :option="option" :limit="limit"></date-picker>
			<span v-text="showWeek"></span>
		</div>
		<div class="query">
			<button @click="query" class="btn">查询</button>
		</div> -->
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
			<!-- <div class="location-result" v-else>
				<i class="fa fa-map-marker" :style="{color:locationName===''?'#fff':'#000'}"></i>
				<span>{{locationName}}</span>
				<span @click="refreshLocation" v-if="showRefresh" class="refresh-location">重新定位</span>
			</div> -->
		</div>
		<!-- 查询记录 -->
		<!-- <div class="click-search">
			<p @click="showSearchRecord">历史查询<i class="fa fa-caret-down"></i></p>
		</div> -->
		<!-- <template v-if="searchrecord">
			<div class="search-record animated fadeInUp" v-if="localStorage.length!==0">
				<p>历史查询</p>
				<div class="list" v-for="(list,index) in localStorage.slice(0,5)" v-bind:key="index" @click="queryRecord(index)">
					<span class="first">{{list.startCity}}</span>
					<span>{{list.endCity}}</span>
				</div>
			</div>
		</template> -->
	</div>
</template>

<style lang="css" scoped>
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
// import DatePicker from 'vue-datepicker'
import { Indicator,Toast } from 'mint-ui';
import "whatwg-fetch";
const _ = require("underscore");

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
			showRefresh:false,//是否显示刷新地理位置
			searchrecord:false,//是否显示历史记录
			canQuery:false,//是否可以查询
      startTime: "",
		}
	},
	created(){
			history.replaceState({},"","#/home/ticketbody");//修复部分url一开始就有"#/"导致无法支付的bug(url未注册)
		// try{
			let nowDate = new Date();
			this.$store.commit("CHANGE_HEADER",{isHome:true,Title:"身边订票"});
			this.$store.commit("SET_SHOWHEADER",false);
			
			// 设置初始时间
			if(this.$store.getters.getInfo.startDate.server){
				// 之前查过
				this.handleConfirm(this.$store.getters.getInfo.startDate.server);
				this.startTime = this.formatNow(this.$store.getters.getInfo.startDate.server);
			}
			else{
				this.handleConfirm(new Date(this.nowDate.getTime()+24*60*60*1000));
				this.startTime = this.formatNow(new Date(this.nowDate.getTime()+24*60*60*1000))
			}
			// 获取本地历史搜索数据
			this.localStorage = this.getLocalStore().reverse();
			
			// 获取位置
			if(this.$store.getters.getIsFirst){
				// 还没有获取过,说明第一个打开网页
				this.$store.dispatch("setisFirst",false);
				
				// 获取默认的出发地址
				this.$store.dispatch("getCityDefault").then(result=>{
					if(result.End){
						// 到达点不为空
						this.canQuery = true;
					}
					else{
						this.canQuery = false;
					}
				})

				// 获取地理位置
				navigator.geolocation.getCurrentPosition(this.showPosition,this.getPositionError);
				// 获取乘客信息和优惠信息
				this.$store.dispatch("getPassenger");
				
			}
			else{
				// 不需要再次获取地理位置
				this.locationLoad = false;
				if(this.$store.getters.getLocationResult){
					this.locationName = "最近上车点:"+this.$store.getters.getLocationResult.Name;
				}
				else{
					this.locationName = "";
				}

				// 查看到达点是否是正确的
				if(this.getEndCity==="请选择"){
					this.canQuery = false;
				}
				else{
					this.canQuery = true;
				}
			}
		// }
		// catch(error){
		// 	alert(error);
		// }
	},
	filters:{
		
	},
	watch:{
		// startTime:{
		// 	handler:function(newValue,oldValue){
		// 		let date = new Date(newValue.time);
		// 		let newDate = new Date();
		// 		this.showTime = this.formatNow(date);
		// 		this.showWeek = Utils.formatWeek(date);

		// 		// 显示明天和今天
		// 		if(date.getMonth()===newDate.getMonth()&&date.getDate()===newDate.getDate()){
		// 			this.showWeek = "今天";
		// 		}
		// 		if(date.getMonth()===newDate.getMonth()&&date.getDate()===newDate.getDate()+1){
		// 			this.showWeek = "明天";
		// 		}

		// 		//记录选取的时间
		// 		this.$store.dispatch("setStartDate",{
		// 			date:this.showTime,
		// 			week:this.showWeek,
		// 			server:date
		// 		});
		// 	},
		// 	deep: true
		// }
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
				this.locationLoad = false;//停止界面加载提示
				if(data){
					this.locationName = "最近上车点:"+data.Name;
					this.$store.dispatch("setStartCity",{
						Code:data.CityId,
						Name:data.Name
					});
					Toast({
					  message: "已为你切换到最近的出发点",
					  position: 'bottom',
					  duration: 3000,
					});
					
				}
				else{
					//没有数据
					this.locationName = "";
					// Toast({
					//   message: "没有数据",
					//   position: 'bottom',
					//   duration: 3000,
					// });
				}

				this.showRefresh = false;//正常返回就不要显示重新加载了
				return Promise.resolve();
			}).catch(error=>{
				this.locationLoad = false;//停止界面加载提示
				// this.locationName = "请稍后重试...";
				// this.showRefresh = true;
			})
		},
		getPositionError(error){
			// this.showPosition({
			// 	coords:{
			// 		latitude:"23.018639699999998",
			// 		longitude:"113.3086585"
			// 	}
			// })
			if(error){
				// 获取位置出错
				this.locationLoad = false;//停止界面加载提示
				this.locationName = "";
				// this.showRefresh = true;
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
				  message: "网络错误,请稍后重试...",
				  position: 'bottom',
				  duration: 3000
				});
			});
		},
		openDate(){
			this.$router.push({name:"ticketdate"});
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
				  message: "网络错误,请稍后重试...",
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
				  message: "网络错误,请稍后重试...",
				  position: 'bottom',
				  duration: 3000
				});
			});
		},
		// 通过本地的搜索记录查询
		queryRecord(index){
			let data = this.getLocalStore().reverse()[index];

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
				endCode:city2.Code,
				uniq:city1.Code+city2.Code
			}
			let data = this.getLocalStore();

			let newData = [];

			// 检测是否已有相同的数据路线,删除重复的
			for(let i=0;i<data.length;i++){
				if(data[i].uniq!==json.uniq){
					newData.push(data[i])
				}
			}
			newData.push(json);//最后才推入这个
			//等于10的时候需要截取一部分
			if(newData.length===10){
				newData.splice(0,5);
			}

			window.localStorage.setItem("City",JSON.stringify(newData));
		},
		onStartValuesChange(picker, values){
			this.$store.dispatch("setStartCity",{Code:"00000",Name:values[0]});
		},
		onEndValuesChange(picker, values){
			this.$store.dispatch("setEndCity",{Code:"00000",Name:values[0]});
		},
		showSearchRecord(){
			this.searchrecord = !this.searchrecord;
		},
		clearLocalStore(){
			window.localStorage.clear("City");
			this.localStorage = [];
		}
	},
}
</script>