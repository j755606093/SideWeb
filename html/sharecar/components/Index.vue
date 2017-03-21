<template type="x/template" id="index">
	<div class="home">
		<div class="home__swpier">
			<div class="swiper-container">
		    <!-- Additional required wrapper -->
		    <div class="swiper-wrapper">
	        <div class="swiper-slide">
						<img src="../icon/swiper1.png">
	        </div>
	        <div class="swiper-slide">
	        	<img src="../icon/swiper1.png">
	        </div>
	        <div class="swiper-slide">
	        	<img src="../icon/swiper1.png">
	        </div>
		    </div>
		    <!-- If we need pagination -->
		    <div class="swiper-pagination"></div>
			</div>
			<div class="online--number">
				<span>在线人数{{onlineNumber}}</span>
			</div>
		</div>
		<div class="home__header">
			<div class="header_title">
				<span @click="switchPage(0)" :class="{active:pageIndex===0}">人找车</span>
				<span @click="switchPage(1)" :class="{active:pageIndex===1}">车找人</span>
				<div class="action--btn">
					<img src="../icon/seach_icon.png">
				</div>
				<div class="action--btn">
					<img src="../icon/Refresh_ICON.png">
				</div>
			</div>
			<div class="header_message">
				<span class="message--new">有43条新消息</span>
				<div class="header_message--taxis">
					<span @click="sort(0)" :class="{active:sortIndex===0}">发布时间 ↑</span>
					<span @click="sort(1)" :class="{active:sortIndex===1}">发布时间 ↓</span>
				</div>
			</div>
		</div>
		<div class="home__lists">
			<template v-for="(item,index) in showPageData">
				<my-list :types="pageIndex" :list="item" :index="index"></my-list>
			</template>
		</div>
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

export default {
	data () {
		return {
			CarInfoPage:1,// 找车
			CarNoMoreData:false,//没有更多数据
			PeopleInfoPage:1,//找人
			PeopleNoMoreData:false,//没有更多数据
			sortIndex:0,//排序索引
			pageIndex:0,//页面索引

			onlineNumber:100
		}
	},
	created(){
		this.$store.dispatch("getCarInfo",{
			Index:this.CarInfoPage,
			Size:10
		})
		.then(result=>{
			if(result.length<10){
				// 没有更多数据
				this.CarNoMoreData = true;
			}
			this.$store.dispatch("getPeopleInfo",{
				Index:this.PeopleInfoPage,
				Size:10
			}).then(items=>{
				if(items.length<10){
					// 没有更多数据
					this.PeopleNoMoreData = true;
				}
			})
		})
		.catch(error=>{
			this.toast("服务器错误,请稍后重试...");
		});
		this.randomOnlineNumber();
	},
	mounted(){
		const mySwiper = new Swiper('.swiper-container', {
	    autoplay: 2000,
	    loop: true,
	    pagination: '.swiper-pagination',
	    autoplayDisableOnInteraction : false,
	  });
	},
	computed:{
		CarInfo(){
			return this.$store.getters.getCarInfo;
		},
		PeopleInfo(){
			return this.$store.getters.getPeopleInfo;
		},
		showPageData(){
			if(this.pageIndex===0){
				return this.CarInfo;
			}
			else{
				return this.PeopleInfo;
			}
		}
	},
	methods:{
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
			
			setInterval(()=>{
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
		/** 发布时间排序 */
		sort(index){
			this.sortIndex = index;
		},
		/** 切换主页 */
		switchPage(index){
			this.pageIndex = index;
		}
	},
	components:{
		"my-list":List
	}
}
</script>