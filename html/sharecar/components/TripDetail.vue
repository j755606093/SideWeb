<template type="x/template">
	<div class="tripdetail">
		<my-header :showBack="true" headerTitle="旅程详情"></my-header>
		<div v-if="isReady" class="trip__info">
			<my-list :types="types" :list="tripData" nogo="true"></my-list>
			<div class="trip__remark">
				<p>备注:{{tripData.Remark?tripData.Remark:'无'}}</p>
			</div>
			<div class="trip__tip">
				<p>平台需要统计车主座位数量情况，在初次交流15分钟后。我们会在微信平台发送信息让乘客与司机确定旅程情况~</p>
			</div>
			<a href="tel:0663-5519299" class="trip__contact">
				<div class="trip--contact-way">
					<img src="../icon/phone_icon.png">
				</div>
				<span>电话联系</span>
				<span>(13871895108)</span>
			</a>
			<div class="trip__contact">
				<div class="trip--contact-way">
					<img src="../icon/messnge_icon.png">
				</div>
				<span>短信联系</span>
			</div>
		</div>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
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
.trip__contact{
	height:40px;
	line-height:40px;
	width:100%;
	border-radius:5px;
	background-color:#fff;
	@include display_flex("row");
	margin-top:10px;
	div.trip--contact-way{
		height:40px;
		width:20px;
		@include display_flex("row");
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

			tripData:{}
		}
	},
	created(){
		this.tripId = this.$route.params.tripId;
		let types = this.$route.params.types;

		if(!this.tripId){

		}
		
		if(types==="0"){
			this.types = parseInt(types);
			this.loading();
			this.$store.dispatch("getTripDetail",this.tripId).then(result=>{
				if(result.Data){
					this.tripData = result.Data;
					this.isReady = true;//开始显示
				}
				else{
					this.toast(result.Message);
				}
				Indicator.close();
			})
		}else{
			this.types = parseInt(this.types);
			this.loading();
			this.$store.dispatch("getTripDetailPeople",this.tripId).then(result=>{
				if(result.Data){
					this.tripData = result.Data;
					this.isReady = true;//开始显示
				}
				else{
					this.toast(result.Message);
				}
				Indicator.close();
			})
		}
	},
	computed:{
		
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
	},
	filters:{
		
	},
	components:{
		"my-list":List,
		"my-header":Header,
	}
}
</script>