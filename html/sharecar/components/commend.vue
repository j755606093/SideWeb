<template type="x/template">
	<!-- 推荐页页面 -->
	<div ref="commend" id="commend" class="commend">
		<my-header :showBack="true" headerTitle="匹配行程推荐"></my-header>
		<div ref="commend_list" id="commend_list" class="commend--lists">
			<template v-for="(item,index) in ListData">
				<!-- 有Num说明是多少个人,也就是乘客 -->
				<my-list :types="item.Num?1:0" :list="item"></my-list>
			</template>
			<div id="last_bottom" ref="last_bottom"></div>
			<div v-show="NoData" class="no-data">
				<p>没有更多数据~</p>
			</div>
		</div>
		<!-- 显示头像 -->
		<mt-popup
			position="center"
			:closeOnClickModal="false"
		  v-model="Avatar.isShow"
		  class="avatar__page">
		  <slot>
				<img class="avatar__page--img animated zoomIn" :src="Avatar.Headimgurl">
				<div @click="closeAvatar" class="avatar__page--close animated zoomIn">
					<!-- <img src="../icon/cancal_icon.png"> -->
					<i class="fa fa-times"></i>
				</div>
		  </slot>
		</mt-popup>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
.commend--lists{
	margin-top: 60px;
	padding:0 10px;
}
.avatar__page{
	width:260px;
	height:260px;
	border-radius: 10px;
	background-color: transparent;
	.avatar__page--img{
		width:100%;
		height:100%;
		border-radius: 10px;
		border:none;
	}
	.avatar__page--close{
		position:absolute;
		top:0;
		right:0;
		z-index:4000;
		width:20px;
		height: 20px;
		>i{
			width:20px;
			height:20px;
			font-size: 24px;
		}
	}
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import List from "./list.vue";
import { Toast, Indicator, Popup } from 'mint-ui';
import Header from "./Header.vue";
const _ = require("underscore");

export default {
	data () {
		return {
			Page:1,// 页数
			NoData:false,//没有数据
			ListData:[],//列表数据
			tripId:"",//获取的行程id
			types:-1,//默认类型-1
			scrollFunction:null,//滚动函数
			canScroll:false//是否可以滚动
		}
	},
	created(){
		this.tripId = this.$route.params.tripId;
		this.types = this.$route.params.types;//driver,passenger
		this.canScroll = true;//可以滚动

		this.loading();
		this.$store.dispatch("getSimilar",{
			Id:this.tripId,
			Types:this.types,
			Page:this.Page,
			Size:10
		}).then(result=>{
			this.Page++;
			Indicator.close();
			if(result.Data){
				if(result.Data.length<10){
					this.NoData = true;
				}
				this.ListData = result.Data;
			}
			else{
				this.toast(result.Message);
				this.$router.push({path:"/"});
			}
		}).catch(error=>{
			this.$router.push({path:"/"});
			Indicator.close();
		})
	},
	mounted(){
		this.scrollFunction = _.throttle(()=>{
			if(!this.canScroll){
				// 因为无法移除window的滚动监听事件,所以需要增加这个来判断是否当前页面
				return;
			}
			let last = document.getElementById("last_bottom").offsetTop - document.body.scrollTop;
			if(last<800){
				this.getMoreData();
			}
		},400,{leading:false})
		window.addEventListener("scroll",this.scrollFunction,true)
	},
	destroyed(){
		window.removeEventListener("scroll", this.scrollFunction, false);
		this.canScroll = false;//不可以滚动
	},
	activated(){
		
	},
	computed:{
		UserInfo(){
			return this.$store.getters.getUserInfo;
		},
		// 需要显示的用户头像
		Avatar(){
			return this.$store.getters.getShowUserAvatar;
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
		/** 加载动画(需要手动关闭) */
		loading() {
			Indicator.open({
				spinnerType: 'fading-circle'
			});
		},
		/** 获取更多数据 */
		getMoreData(){
			if(this.NoData){
				return;
			}
			this.loading();
			this.$store.dispatch("getSimilar",{
				Id:this.tripId,
				Types:this.types,
				Page:this.Page,
				Size:10
			}).then(result=>{
				this.Page++;
				Indicator.close();
				if(result.Data){
					if(result.Data.length<10){
						this.NoData = true;
					}
					this.ListData = this.ListData.concat(result.Data);
				}
				else{
					this.toast(result.Message);
				}
			}).catch(error=>{
				this.$router.push({path:"/"});
				Indicator.close();
			})
		},
		//点击图片关闭
		closeAvatar(){
			this.$store.dispatch("showPicture",{
				Headimgurl:"",
				isShow:false
			})
		}
	},
	filters:{
		
	},
	components:{
		"my-list":List,
		"mt-popup": Popup,
		"my-header":Header,
	}
}
</script>