<template>
	<div id="pay" class="position">
		<!-- 车票信息 -->
		<div class="ticket-info">
			<div class="header">
				<span>大型高一</span>
				<span class="font-red">¥143</span>
			</div>
			<div class="address-info">
				<div class="start box">
					<p>镇江</p>
					<p>08:15</p>
					<p>南门客运站</p>
				</div>
				<div class="center box">
					<p>12-03 周六</p>
				</div>
				<div class="end box">
					<p>宁波</p>
					<p>宁波</p>
				</div>
			</div>
			<div class="tip-info">
				<p>查看取票,退票说明,预订须知<i class="fa fa-caret-down"></i></p>
			</div>
		</div>
		<div class="pay-people">
			<input placeholder="输入code..." class="input" type="text" v-model="Code">
			<button class="btn" @click="postCode">提交</button>
		</div>
		<!-- <button class="btn" @click="pay">点击支付</button> -->
		<mt-popup
		  v-model="popupVisible"
		  position="top"
		  class="root-popup">
		  <slot>
		  	<p class="popup" v-text="popupText"></p>
		  </slot>
		</mt-popup>
	</div>
</template>

<style lang="sass">
@import "../css/ticketpay.css";
button{
	padding:10px 0;
	width:90%;
	margin:0 5%;
}
.root-popup{
	width:100%;
}
.popup{
	width:100%;
	height:50px;
	line-height:50px;
	text-align:center;
	color:#fff;
	background-color:rgba(0,0,0,0.6);
	font-size:1.2rem;
}
.input{
	width:100%;
	height:30px;
	line-height:30px;
	font-size:1.3rem;
}
.btn{
	background-color:#001f3f;
	padding:10px 0;
	color:#fff;
	font-size:1.3rem;
}
</style>

<script type="text/babel">
import { mapGetters } from 'vuex'
import Utils from "../Utils/utils";
import { Indicator,Toast } from 'mint-ui';

export default {
	data () {
		return {
			startCity:"",
			endCity:"",
			busInfo:null,
			popupVisible:false,//提示框是否显示
			popupText:"我是提示框",//提示框文字
			Code:"",//微信code
		}
	},
	created(){
		// if(this.$store.getters.getBusInfo===null){
		// 	//数据为空,一般是直接进入这个页面才会这样
		// 	this.$router.replace({path:"/home/ticketbody"})
		// }
		this.busInfo = this.$store.getters.getBusInfo;
		this.startCity = this.$store.state.tickets.startCity;
		this.endCity = this.$store.state.tickets.endCity;

		this.$store.commit("CHANGE_HEADER",{isHome:false,Title:this.startCity.Name+" - "+this.endCity.Name});
	},
	computed:{
		
	},
	methods:{
		formatData(data){
			return JSON.parse(JSON.stringify(data));
		},
		pay(){
			console.log(this.formatData(this.busInfo))
		},
		popupMessage(text){
			this.popupText = text;
			this.popupVisible = true;
		},
		postCode(){
			// 提示加载中
			Indicator.open({
				text: '加载中...',
				spinnerType: 'double-bounce'
			});
			this.$http.post("http://wx.1yhp.net/api/Order/WxPay",{Code:this.Code}).then(res=>{
				Indicator.close();
				if(res.data.Status===0){
					this.popupMessage(res.data.Message);
				}
				else{
					this.popupMessage(JSON.stringify(res.data));
					this.payMoney(res.data.Data);
				}
			}).catch(error=>{
				this.popupMessage(error);
			})
		},
		payMoney(paydata){
			window.WeixinJSBridge.invoke("getBrandWCPayRequest",paydata,function(r){
				if(r.err_msg==="get_brand_wcpay_request:ok"){
					// 支付成功
					// 再根据小票拿数据
					// 需要延迟2秒以上再去查找订单,否则会出现找不到的情况
					Indicator.open({
						text: '支付成功...',
						spinnerType: 'double-bounce'
					});
					setTimeout(()=>{
						Indicator.close();
					},3000);
				}
			});
		}
	}
}
</script>