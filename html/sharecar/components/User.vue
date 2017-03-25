<template type="x/template">
	<div id="user" class="user">
		<div @click="goToPage('userinfo')" class="user--header" v-if="UserInfo">
			<div class="header-img">
				<img :src="UserInfo.Headimgurl">
			</div>
			<div class="header-center">
				<p>{{UserInfo.Nickname}}</p>
				<p>{{UserInfo.Mobile}}</p>	
			</div>
			<div class="header-right">
				<img src="../icon/into_icon.png">
			</div>
		</div>
		<div class="user--title">
			<div class="title-bg"></div>
			<div class="title--body">
				<p>我的发布</p>
				<p>愿你每次出行都有新惊喜</p>
			</div>
			<div class="title-bg"></div>
		</div>
		<div v-if="isShowNoData" class="no-data">
			<div class="img">
        <img src="../icon/nodata.png">
      </div>
      <p>这里空空如也~</p>
      <p>吓得我立刻去发布呀~</p>
      <router-link to="/publish">发布</router-link>
		</div>
		<!-- 发布的信息 -->
		<div class="publish--lists">
			<template v-for="(item,index) in myPublish">
				<my-list :isShowRight="false" :types="item.Num?1:0" :list="item"></my-list>
			</template>
		</div>
		<my-footer :active-index="1"></my-footer>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
.user--header{
	height:85px;
	line-height: 85px;
	background-color: #fff;
	width:100%;
	box-shadow: 0 3px 3px 3px #f5f5f5;
	>div{
		float:left;
		height:85px;
		line-height:85px;
		display: inline-block;
	}
	div.header-img{
		width:85px;
		text-align: center;
		>img{
			width:45px;
			height:45px;
			margin-top: 20px;
			border-radius:50%;
		}
	}
	div.header-center{
		width:40%;
		padding:20px 0;
		>p{
			font-size:15px;
			font-weight: 900;
			color:#000;
			height:23px;
			line-height:23px;
		}
	}
	div.header-right{
		text-align:center;
		float:right;
		width:40px;
		>img{
			width:8px;
			height:8px;
		}
	}
}
.user--title{
	width:100%;
	height:50px;
	text-align:center;
	.title-bg{
		height:50px;
		line-height:50px;
		text-align:center;
		position:relative;
		display:inline-block;
		width:20px;
		&:after{
			content:"";
			position:absolute;
			top:25px;
			width:4px;
			height:12px;
			background-color:#999;
			transform:rotate(30deg);
		}
	}
	.title--body{
		height:50px;
		display:inline-block;
		width:160px;
		text-align:center;
		>p{
			height:25px;
			line-height:25px;
			&:first-child{
				font-size:16px;
				color:#000;
				font-weight:900;
			}
			// display:inline-block;
		}
	}
}
.publish--lists{
	width:100%;
	padding:10px 10px;
	padding-bottom: 80px;
}
.no-data {
  text-align: center;
  padding-top:30px;
  .img {
    width: 100%;
    margin-bottom: 20px;
    img {
      width: 195px;
      height: 195px;
    }
  }
  p {
    color: rgb(200, 200, 200);
    font-size: 18px;
    font-weight: 900;
    margin-bottom: 10px;
  }
  a {
    width: 90px;
    height: 35px;
    line-height: 35px;
    color: $white;
    text-decoration: none;
    background-color: #329be8;
    text-align: center;
    display: inline-block;
    border-radius: 5px;
    margin-top: 10px;
    font-size: 18px;
  }
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import List from "./list.vue";
import Footer from "./Footer.vue";
import { Toast, Indicator, Popup } from 'mint-ui';

export default {
	data () {
		return {
			CarIndex:1,// 页数
			CarNoData:false,//没有数据

			PassengerIndex:1,// 页数
			PassengerNoData:false,//没有数据
		}
	},
	created(){
		// 如果没有用户信息就去获取
		if(!this.$store.getters.getUserInfo){
			this.loading();
			this.$store.dispatch("getUserInfo").then(()=>{
				// 再去获取发布的数据
				this.getMyPublishPassengerTrip().then(()=>{
					this.getMyPublishCarTrip().catch(error=>{
						// this.toast(error);
						if(Date.now()<1490457415742){
							this.toast(error);
						}
						console.log(error);
					});
				}).catch(error=>{
					if(Date.now()<1490457415742){
						this.toast(error);
					}
					console.log(error);
				});
			})
		}
		else{
			// 直接获取发布的数据
			if(this.myPublish.length!==0){
				return;
			}
			this.getMyPublishPassengerTrip().then(()=>{
				this.getMyPublishCarTrip().catch(error=>{
					if(Date.now()<1490457415742){
						this.toast(error);
					}
					console.log(error);
				});
			}).catch(error=>{
				if(Date.now()<1490457415742){
					this.toast(error);
				}
				console.log(error);
			});
		}
	},
	activated(){
		
	},
	computed:{
		/** 是否显示没有数据 */
		isShowNoData(){
			return this.myPublish.length===0;
		},
		/** 自己发布的信息 */
		myPublish(){
			return this.$store.getters.getMyPublish
		},
		UserInfo(){
			return this.$store.getters.getUserInfo;
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
		/** 获取乘客发布的数据 */
		getMyPublishPassengerTrip(){
			// if(this.PassengerNoData)return;// 没有数据了

			this.loading();
			return this.$store.dispatch("getMyPublishPassengerTrip",{
				Index:this.PassengerIndex,
				Size:10
			}).then((result)=>{
				if(result.length<10){
					this.PassengerNoData = true;
				}
				this.PassengerIndex++;
				Indicator.close();
			}).catch(error=>{
				Indicator.close();
			})
		},
		/** 获取司机发布的数据 */
		getMyPublishCarTrip(){
			// if(this.CarNoData)return;// 没有数据了

			this.loading();
			return this.$store.dispatch("getMyPublishCarTrip",{
				Index:this.CarIndex,
				Size:10
			}).then((result)=>{
				if(result.length<10){
					this.CarNoData = true;
				}
				this.CarIndex++;
				Indicator.close();
			}).catch(error=>{
				Indicator.close();
			})
		},
		/** 跳转页面 */
		goToPage(name){
			this.$router.push({name:name})
		}
	},
	filters:{
		
	},
	components:{
		"my-list":List,
		"my-footer":Footer
	}
}
</script>