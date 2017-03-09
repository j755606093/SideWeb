<template type="x/template" id="ticketbody">
	<div class="ticketbody">
		<!-- 轮播图 -->
		<div class="slider">
			<router-link to="/rebate/lvdzju">
				<img class="slider-item" :src="'../picture/slider1.png?'+Date.now()">
			</router-link>
			<!-- <router-link to="/rebate/002">
				<img class="slider-item" src="../picture/slider2.png">
			</router-link> -->
			<!-- <a href="#">
				<img class="slider-item" src="../picture/slider1.png">
			</a> -->
			<a href="#">
				<img class="slider-item" :src="'../picture/slider2.png?'+Date.now()">
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
				<span @click="openDate">出发时间</span>
				<div @click="openDate"><span>{{showTime}}</span></div>
				<p @click="openDate">
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
      startTime: "",
		}
	},
	created(){
			history.replaceState({},"","#/home/ticketbody");//修复部分url一开始就有"#/"导致无法支付的bug(url未注册)
		// try{
			
			let nowDate = new Date();
			this.$store.commit("CHANGE_HEADER",{isHome:true,Title:"身边订票"});// 设置头部标题(目前没用,留着是因为底部tabbar需要根据是否是首页而显示)
			this.$store.commit("SET_SHOWBACK",false);//不显示返回按钮(这里没什么用)
			this.$store.commit("SET_SHOWHEADER",false);//不显示头部
			
			
			// 设置初始时间
			if(this.$store.getters.getInfo.startDate.server){
				// 如果之前查过(初始化时候server是null)
				this.handleConfirm(this.$store.getters.getInfo.startDate.server);//记录时间
				this.startTime = this.formatNow(this.$store.getters.getInfo.startDate.server);//格式化显示时间
			}
			else{
				// 开始进入首页
				let number = Date.now()+24*60*60*1000;//默认时间是明天
				this.handleConfirm(new Date(number));
				this.startTime = this.formatNow(new Date(number))
			}
			// 获取本地历史搜索数据
			this.localStorage = this.getLocalStore().reverse();
			
			// 获取位置(如果是第一次进来就获取位置)
			if(this.$store.getters.getIsFirst){
				// 还没有获取过,说明第一个打开网页
				this.$store.dispatch("setisFirst",false);//再设置不是第一次进来
				
				// 获取默认的出发地址
				this.$store.dispatch("getCityDefault").then(result=>{
					// 获取地理位置
					navigator.geolocation.getCurrentPosition(this.showPosition,this.getPositionError);
				})

				// 获取乘客信息和优惠信息
				this.$store.dispatch("getPassenger");
				
			}
			else{
				// 不是第一次进入就不需要再次获取地理位置(此部分因为功能迭代后不需要显示就废弃了)
				// this.locationLoad = false;
				// if(this.$store.getters.getLocationResult){
				// 	this.locationName = "最近上车点:"+this.$store.getters.getLocationResult.Name;//显示已经定位的位置
				// }
				// else{
				// 	this.locationName = "";
				// }
			}
		// }
		// catch(error){
		// 	alert(error);
		// }
	},
	filters:{
		
	},
	watch:{
		
	},
	computed:{
		getStartCity(){
			// 获取开始地址(需要保持和store同步)
			this.startCity = this.$store.state.tickets.startCity;
			return this.startCity.Name;
		},
		getEndCity(){
			// 获取到达地址(需要保持和store同步)
			this.endCity = this.$store.state.tickets.endCity;
			return this.endCity.Name;
		},
	},
	methods:{
		/** 格式化时间 */
		formatDate(data){
			return Utils.formatDate(data);
		},
		/** 接受浏览器返回的定位位置 */
		showPosition(position){
			let {latitude,longitude,accuracy,altitude,altitudeAccuracy} = position.coords;
			// 返回定位位置给服务器判断最近上车点
			this.$store.dispatch("setLocationResult",{
				latitude:latitude,
				longitude:longitude
			}).then(data=>{
				// this.locationLoad = false;//停止界面加载提示
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
					// this.locationName = "";
				}

				// this.showRefresh = false;//正常返回就不要显示重新加载了
				// return Promise.resolve();
			}).catch(error=>{
				// this.locationLoad = false;//停止界面加载提示
			})
		},
		/** 定位数据获取失败调用的函数 */
		getPositionError(error){
			if(error){
				// 获取位置出错
				// this.locationLoad = false;//停止界面加载提示
				// this.locationName = "";
			}
		},
		/** 刷新定位(弃用) */
		refreshLocation(){
			//重新定位
			navigator.geolocation.getCurrentPosition(this.showPosition,this.getPositionError);
		},
		/** 获取出发地点(跳转页面) */
		GoStartCity(){
			// 提示加载中
			Indicator.open({
				text: '加载中...',
				spinnerType: 'double-bounce'
			});

			this.$store.dispatch("setStartCityList").then((data)=>{
				Indicator.close();//关闭加载提示
				this.$router.push({name:"ticketstartcity"});
			}).catch(error=>{
				Indicator.close();
				Toast({
				  message: "网络错误,请稍后重试...",
				  position: 'bottom',
				  duration: 3000
				});
			});
		},
		/** 跳转选取出发日期页面 */
		openDate(){
			this.$router.push({name:"ticketdate"});
		},
		/** 获取到达地点(跳转页面) */
		GoEndCity(){
			// 提示加载中
			Indicator.open({
				text: '加载中...',
				spinnerType: 'double-bounce'
			});

			this.$store.dispatch("setEndCityList").then((data)=>{
				Indicator.close();
				this.$router.push({name:"ticketendcity"});
			}).catch(error=>{
				Indicator.close();
				Toast({
				  message: "网络错误,请稍后重试...",
				  position: 'bottom',
				  duration: 3000
				});
			});
		},
		/** 格式化时间显示到页面上和记录这个时间 */
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
		/** 返回格式化日期 */
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
		/** 点击查询按钮 */
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
		// onStartValuesChange(picker, values){
		// 	this.$store.dispatch("setStartCity",{Code:"00000",Name:values[0]});
		// },
		// onEndValuesChange(picker, values){
		// 	this.$store.dispatch("setEndCity",{Code:"00000",Name:values[0]});
		// },
		// showSearchRecord(){
		// 	this.searchrecord = !this.searchrecord;
		// },
		clearLocalStore(){
			window.localStorage.clear("City");
			this.localStorage = [];
		}
	},
}
</script>