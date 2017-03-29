<template type="x/template">
	<div id="tripdetail" class="tripdetail">
		<my-header :showBack="true" headerTitle="旅程详情"></my-header>
		<div v-if="isReady" class="trip__info animated slideInRight">
			<my-list :isDetail="true" :types="types" :list="tripData" nogo="true"></my-list>
			<div class="trip__remark">
				<p>备注:{{tripData.Remark?tripData.Remark:'无'}}</p>
			</div>
			<div v-if="isShowDistanceInfo" class="trip__line">
				<p>行程距离约为:{{distance|formatDistance}}km</p>
				<p>估算行程时间:{{distanceTime|formatDistanceTime}}</p>
			</div>
			<!-- <div class="trip__tip">
				<p>平台需要统计车主座位数量情况，在初次交流15分钟后。我们会在微信平台发送信息让乘客与司机确定旅程情况~</p>
			</div> -->
			<div class="tick_bottom">
				<a :href="'tel:'+tripData.Phone" class="trip__contact">
					<div class="trip--contact-way">
						<img src="../icon/phone_icon.png">
					</div>
					<span>电话联系</span>
					<span>({{tripData.Phone}})</span>
				</a>
				<a :href="'sms:'+tripData.Phone" class="trip__contact">
					<div class="trip--contact-way">
						<img src="../icon/messnge_icon.png">
					</div>
					<span>短信联系</span>
				</a>
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
#app{
	position: relative;
	height:100%;
}
.tripdetail{
	margin-top:60px;
}
.trip__info{
	width:100%;
	padding:0 10px;
}
.trip__remark{
	background-color: #fff;
	border-radius: 5px;
	padding:10px 25px;
	margin-top:10px;
	box-shadow: 0 3px 3px 3px #f5f5f5;
	>p{
		line-height: 26px;
		font-size:14px;
	}
}
.trip__tip{
	text-align: center;
	margin:35px 20px;
	>p{
		font-size:14px;
		color:rgb(200,200,200);
		line-height:26px;
	}
}
.trip__line{
	background-color: #fff;
	border-radius: 5px;
	padding:5px 25px;
	margin-top:10px;
	box-shadow: 0 3px 3px 3px #f5f5f5;
	>p{
		line-height: 30px;
		font-size:14px;
	}
}
.trip__contact{
	height:40px;
	line-height:40px;
	width:100%;
	border-radius:5px;
	background-color:#fff;
	display:block;
	// @include display_flex("row");
	margin-top:10px;
	box-shadow: 0 3px 3px 3px #f5f5f5;
	text-align:center;
	div.trip--contact-way{
		height:40px;
		width:20px;
		display: inline-block;
		// @include display_flex("row");
		>img{
			width:12px;
			height:12px;
		}
	}
	span{
		height:40px;
		line-height:40px;
		color:rgb(50,50,50);
		font-size:15px;
		margin-left:5px;
	}
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
.animated{
	animation-duration: 0.4s;
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import List from "./list.vue";
import Header from "./Header.vue";
import { Toast, Indicator, Popup } from 'mint-ui';

export default {
	data () {
		return {
			tripId:"",
			isReady:false,
			types:-1,

			tripData:{},

			distance:"",//距离
			distanceTime:"",//时间
			isShowDistanceInfo:false,//默认不显示
		}
	},
	created(){
		this.tripId = this.$route.params.tripId;
		this.types = parseInt(this.$route.params.types);
		
		if(this.types===0){
			this.loading();
			this.$store.dispatch("getTripDetail",this.tripId).then(result=>{
				if(result.Data){
					this.tripData = result.Data;

					// 获取行程距离时间
					this.getDistance({
						SpointLocation:this.tripData.SpointLocation,
						EpointLocation:this.tripData.EpointLocation,
					}).then(distance=>{			
						this.isReady = true;//开始显示
						this.isShowDistanceInfo = true;//显示距离
						Indicator.close();
					}).catch(error=>{
						this.isReady = true;//开始显示
						console.log(error)
						Indicator.close();
						this.toast("获取行程失败...");
					})
				}
				else{
					this.toast(result.Message);
				}
			}).catch(error=>{
				this.$router.push({path:"/"});
				Indicator.close();
			})
		}else{
			this.loading();
			this.$store.dispatch("getTripDetailPeople",this.tripId).then(result=>{
				if(result.Data){
					this.tripData = result.Data;

					// 获取行程距离时间
					this.getDistance({
						SpointLocation:this.tripData.SpointLocation,
						EpointLocation:this.tripData.EpointLocation,
					}).then(distance=>{
						this.isReady = true;//开始显示
						this.isShowDistanceInfo = true;//显示距离
						Indicator.close();
					}).catch(error=>{
						this.isReady = true;//开始显示
						console.log(error)
						Indicator.close();
						this.toast("获取行程失败...");
					})
				}
				else{
					this.toast(result.Message);
				}
				Indicator.close();
			}).catch(error=>{
				this.$router.push({path:"/"});
				Indicator.close();
			})
		}
	},
	computed:{
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
		getDistance(data){
			return this.$store.dispatch("getDistance",data).then(result=>{
				this.distance = result.distance;
				this.distanceTime = result.distanceTime;
			})
		},
		/** 加载动画(需要手动关闭) */
		loading() {
			Indicator.open({
				spinnerType: 'fading-circle'
			});
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
		formatDistance(value){
			let distance = parseInt(value);
			return parseFloat(distance/1000).toFixed(2);
		},
		formatDistanceTime(value){
			let time = parseInt(value);
			// console.log(time)
			let hour = parseInt(time/60/60);
			let minth = parseInt(time/60%60);
			return hour+"小时"+minth+"分钟";
		}
	},
	components:{
		"my-list":List,
		"mt-popup": Popup,
		"my-header":Header,
	}
}
</script>