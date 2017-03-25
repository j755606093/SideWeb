<template type="x/template" id="index">
	<div class="home">
		<div class="home__swpier">
			<div class="swiper-container">
		    <!-- Additional required wrapper -->
		    <div class="swiper-wrapper">
	        <div class="swiper-slide">
						<img src="../icon/banner1.png">
	        </div>
	        <div class="swiper-slide">
	        	<img src="../icon/banner2.png">
	        </div>
		    </div>
		    <!-- If we need pagination -->
		    <div class="swiper-pagination"></div>
			</div>
			<!-- <div class="online--number">
				<img src="../icon/juxing.png">
				<p>在线人数</p>	
				<p>{{onlineNumber}}</p>
			</div> -->
		</div>
		<div id="header_block" style="height: 80px;width:100%;">
			<div id="headertop" class="home__header">
				<div class="header_title">
					<span @click="switchPage(0)" :class="{active:pageIndex===0}">车找人</span>
					<span @click="switchPage(1)" :class="{active:pageIndex===1}">人找车</span>
					<router-link to="/search" class="action--btn">
						<img src="../icon/seach_icon.png">
					</router-link>
					<div @click="refresh" class="action--btn">
						<img src="../icon/Refresh_ICON.png">
					</div>
				</div>
				<div class="header_message">
					<span class="message--new">欢迎使用城市圈</span>
					<!-- <span @click="openCodePage" v-if="!isFocusMe" style="color:#0074D9">关注我</span> -->
					<!-- <span class="message--new">有43条新消息</span> -->
					<div class="header_message--taxis">
						<span @click="sort(2)" :class="{active:sortIndex===2}">最新发布</span>
						<span @click="sort(1)" :class="{active:sortIndex===1}">最近出发</span>
					</div>
				</div>
			</div>
		</div>
		<div v-show="pageIndex===0" class="home__lists">
			<template v-for="(item,index) in CarInfo">
				<my-list :types="pageIndex" :list="item"></my-list>
			</template>
			<div class="no-more-data" v-if="CarNoMoreData">
				<p>没有更多数据~</p>
			</div>
			<div id="car__last"></div>
		</div>
		<div v-show="pageIndex===1" class="home__lists">
			<template v-for="(item,index) in PeopleInfo">
				<my-list :types="pageIndex" :list="item"></my-list>
			</template>
			<div class="no-more-data" v-if="PeopleNoMoreData">
				<p>没有更多数据~</p>
			</div>
			<div id="people__last"></div>
		</div>
		<mt-popup
		  v-model="showCodePage"
		  class="code__page">
		  <slot>
				<div class="code__page--body">
					<div class="code__page--header">
						<p>长按关注 <span style="color:#60e7bf;font-weight: 900;">揭西城市圈拼车平台</span> 公众号</p>
					</div>
					<div class="code__page--img">
						<img src="../icon/code.png">
					</div>
				</div>
				<p class="code__page-close-page">点击灰色区域关闭弹窗~</p>
		  </slot>
		</mt-popup>
	</div>
</template>

<style lang="css">
@import "../../css/sharecar_index.css";
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import Swiper from "swiper";
import List from "./list.vue";
import { MessageBox, Toast, Indicator, Popup } from 'mint-ui';
import TripDetail from "./TripDetail.vue";
const _ = require("underscore");

export default {
	data () {
		return {
			CarInfoPage:1,// 找车
			CarNoMoreData:false,//没有更多数据
			CarInterntUse:false,//正在使用
			PeopleInfoPage:1,//找人
			PeopleNoMoreData:false,//没有更多数据
			PeopleInterntUse:false,//正在使用
			sortIndex:0,//排序索引,0默认,1发车,2发布

			onlineNumber:0,//显示的在线人数
			onlineTimeContorl:null,//保存循环的变量

			headerTop:0,//头部距离顶部距离
			headerRealTopElement:null,
			headerTopElement:null,
			home__last:null,//底部元素,用来计算和顶部的距离
			car__last:null,//第一页的底部元素
			people__last:null,//第二页的底部元素

			trip_detail_status:false,//旅程详情页显示

			scrollFunction:null,//监听函数地址

			isFocusMe:false,//默认没有关注
			showCodePage:false,//默认不显示二维码
		}
	},
	created(){
		//获取用户地理位置
		navigator.geolocation.getCurrentPosition(this.showPosition,this.getPositionError);

		this.$store.dispatch("getFocusMe").then(result=>{
			this.isFocusMe = result.Data;
			// console.log(result);
		}).catch(error=>{
			console.log(error);
		})

		// 如果没有用户信息就去获取
		// if(!this.$store.getters.getUserInfo){
		// 	this.$store.dispatch("getUserInfo");
		// }
		// 没有列表数据
		if(this.$store.getters.getCarInfo.length===0){
			this.getCarData().then(result=>{
				if(this.$store.getters.getPeopleInfo.length===0){
					this.getPeopleData();
					Indicator.close();
				}
			})
			.catch(error=>{
				this.toast("服务器错误,请稍后重试...");
			});
		}
		
		this.randomOnlineNumber();
	},
	mounted(){
		const mySwiper = new Swiper('.swiper-container', {
	    autoplay: 2000,
	    loop: true,
	    pagination: '.swiper-pagination',
	    autoplayDisableOnInteraction : false,
	  });
		
		//记录当然需要的元素
		this.headerTopElement = document.getElementById("headertop");
		this.headerRealTopElement = document.getElementById("header_block");
		this.car__last = document.getElementById("car__last");
		this.people__last = document.getElementById("people__last");
		
		/** 保存地址,便于移除监听事件 */
		this.scrollFunction = _.throttle(()=>{
			/** 头部tick到顶部 */
			let status = this.headerTopElement.offsetTop-document.body.scrollTop;
			let realTop = this.headerRealTopElement.offsetTop-document.body.scrollTop;
                                  
			if(realTop<=0||status<-170){
				this.headerTopElement.style.position = "fixed";
				this.headerTopElement.style.top = "0";
				this.headerTopElement.style.left = "0";
			}
			else{
				this.headerTopElement.style.position = "relative";
			}
			/** 监听第一页的距离 */
			let indexOne = this.car__last.offsetTop-document.body.scrollTop;
			
			if(this.pageIndex===0&&indexOne<700&&!this.CarNoMoreData&&!this.CarInterntUse){
				// 当前页&&距离小于700&&还有数据&&没有请求
				this.getCarData();
			}

			/** 监听第二页 */
			let indexTwo = this.people__last.offsetTop-document.body.scrollTop;

			if(this.pageIndex===1&&indexTwo<700&&!this.PeopleNoMoreData&&!this.PeopleInterntUse){
				// 当前页&&距离小于700&&还有数据&&没有请求
				this.getPeopleData();
			}
		},500,{leading: false});

		/** 监听滚动 */
		window.addEventListener('scroll',this.scrollFunction);
	},
	computed:{
		CarInfo(){
			return this.$store.getters.getCarInfo;
		},
		PeopleInfo(){
			return this.$store.getters.getPeopleInfo;
		},
		// 页面索引
		pageIndex(){
			return this.$store.getters.getPageIndex;
		},
		//用户位置
		Location(){
			return this.$store.getters.getUserLocation;
		}
	},
	methods:{
		/** 加载动画(需要手动关闭) */
		loading() {
			Indicator.open({
				spinnerType: 'fading-circle'
			});
		},
		toast(title) {
			Toast({
				message: title,
				position: 'bottom',
				duration: 3000
			});
		},
		/** 模拟在线人数 */
		randomOnlineNumber(){
			// 如果本地有数据就本地拿,更像是服务器那边的数据
			let number = window.localStorage.getItem("jgkj_online");
			if(number){
				this.onlineNumber = parseInt(number);
			}
			else{
				this.onlineNumber = parseInt(Math.random()*1000);
			}
			
			this.onlineTimeContorl = setInterval(()=>{
				let random = parseInt(Math.random()*10);
				let action = Math.random()*10>4?false:true;

				if(action){
					this.onlineNumber -= random;
					if(this.onlineNumber<=0){
						this.onlineNumber = 20;
					}
				}
				else{
					this.onlineNumber += random;
				}
				window.localStorage.setItem("jgkj_online",this.onlineNumber);
			},2000)
		},
		/** 2发布时间排序,1发车时间 */
		sort(index){
			if(this.sortIndex===index)return;
			this.sortIndex = index;

			/** 如果是第一个页面 */
			if(this.pageIndex===0){
				// 2
				this.$store.dispatch("setCarInfoReverse",{
					Index:1,
					Size:10,
					OrderBy:index,
					isRefresh:true
				});
			}
			else{
				// 1
				this.$store.dispatch("setPeopleInfoReverse",{
					Index:1,
					Size:10,
					OrderBy:index,
					isRefresh:true
				});
			}
		},
		/** 切换主页 */
		switchPage(index){
			this.$store.dispatch("setPageInfo",index);
		},
		/** 打开详情页 */
		openDetailPage(index){
			this.types = this.pageIndex;
			this.tripId = this.showPageData[index].Id;
			this.trip_detail_status = true;
		},
		/** 刷新信息 */
		refresh(){
			this.loading();
			if(this.pageIndex===0){
				this.CarNoMoreData = false;
				this.CarInfoPage = 2;
				this.$store.dispatch("getCarInfo",{
					Index:1,
					Size:10,
					OrderBy:this.sortIndex,
					isRefresh:true,
					Location:this.Location
				})
				.then(result=>{
					if(result.length<10){
						// 没有更多数据
						this.CarNoMoreData = true;
					}
					Indicator.close();
					this.toast("刷新成功");
				})
				.catch((e)=>{
					Indicator.close();
				})
			}
			else{
				this.PeopleNoMoreData = false;
				this.PeopleInfoPage = 2;
				this.$store.dispatch("getPeopleInfo",{
					Index:1,
					Size:10,
					OrderBy:this.sortIndex,
					isRefresh:true,
					Location:this.Location
				})
				.then(result=>{
					if(result.length<10){
						// 没有更多数据
						this.PeopleNoMoreData = true;
					}
					Indicator.close();
					this.toast("刷新成功");
				}).catch((e)=>{
					Indicator.close();
				})
			}
		},
		/** 接受浏览器返回的定位位置 */
		showPosition(position){
			let {latitude,longitude,accuracy,altitude,altitudeAccuracy} = position.coords;

			this.$store.dispatch("setLocation",{
				X:longitude,
				Y:latitude
			});
		},
		/** 定位数据获取失败调用的函数 */
		getPositionError(error){
			if(error){
				console.log(error);
			}
		},
		/** 获取第一页数据 */
		getCarData(){
			this.autoShowPage();// 自动弹出

			this.loading();
			this.CarInterntUse = true;//正在使用
			return this.$store.dispatch("getCarInfo",{
				Index:this.CarInfoPage,
				Size:10,
				OrderBy:this.sortIndex,
				Location:this.Location
			}).then(result=>{
				Indicator.close();
				if(result.length<10){
					// 没有更多数据
					this.CarNoMoreData = true;
				}
				this.CarInfoPage++;
				this.CarInterntUse = false;//关掉使用
				return result;
			}).catch(error=>{
				Indicator.close();
			})
		},
		/** 获取第二页数据 */
		getPeopleData(){
			this.autoShowPage();// 自动弹出

			this.loading();
			this.PeopleInterntUse = true;//正在使用
			return this.$store.dispatch("getPeopleInfo",{
				Index:this.PeopleInfoPage,
				Size:10,
				OrderBy:this.sortIndex,
				Location:this.Location
			}).then(result=>{
				Indicator.close();
				if(result.length<10){
					// 没有更多数据
					this.PeopleNoMoreData = true;
				}
				this.PeopleInfoPage++;
				this.PeopleInterntUse = false;//关掉使用
				return result;
			}).catch(error=>{
				Indicator.close();
			})
		},
		/** 打开二维码 */
		openCodePage(){
			this.showCodePage = true;
		},
		autoShowPage(){
			if(!this.isFocusMe&&(this.CarInfoPage===3||this.PeopleInfoPage===3)){
				this.isFocusMe = true;
				this.openCodePage();
			}
		}
	},
	activated(){
		console.log("activated")
	},
	destroyed(){
		window.removeEventListener("scroll", this.scrollFunction, false);
		clearInterval(this.onlineTimeContorl);
	},
	components:{
		"my-list":List,
		"mt-popup": Popup,
		"trip-detail":TripDetail
	}
}
</script>