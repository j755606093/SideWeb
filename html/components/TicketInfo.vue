<template type="x/template">
	<div class="rebatepage">
		<div class="rebate-header">
			<img src="../picture/rebate_img.png">
			<p class="header-money">¥<span>{{rebateInfo.Money}}</span></p>
		</div>
		<div class="rebate-body">
			<section>
				<p class="empty"></p>
				<p class="money">¥<span>{{rebateInfo.Money}}</span></p>
				<p class="limit">满 {{rebateInfo.LimitMoney}} 元可用</p>
				<p class="name">{{rebateInfo.Name}}</p>
				<p class="time">{{rebateInfo.StartDate}}</p>
				<p class="time">至</p>
				<p class="time">{{rebateInfo.EndDate}}</p>
			</section>
		</div>
		<div class="get-rebate">
			<button @click="getRebate">领取</button>
			<!-- <button class="isuse" v-else>你已经领取过</button> -->
		</div>
	</div>
</template>

<style lang="sass">
@import "../sass/utils.scss";
.rebatepage{
	width:100%;
	padding:0 10px;
	padding-top:60px;
	padding-bottom: 60px;
}
.rebate-header{
	width:100%;
	position:relative;
	img{
		width:100%;
		height:200px;
	}
	.header-money{
		position:absolute;
		top:10px;
		right:30px;
		width:40px;
		height:40px;
		font-size:12px;
		font-weight:900;
		color:#fff;
		font-weight: 900;
		span{
			font-size: 40px;
			margin-left:5px;
		}
	}
	@include responsive("iphone5"){
		img{
			width:100%;
			height:160px;
		}
	}
}
.rebate-body{
	// height:200px;
	section{
		margin:0 20px;
	}
	width:100%;
	border:0.5px solid #c8c8c8;
	border-top:none;
	text-align: center;
	p.empty{
		border-bottom:0.5px solid #c8c8c8;
		height:20px;
	}
	p.money{
		margin-top:10px;
		height:50px;
		font-size:12px;
		font-weight:900;
		color:rgb(50,50,50);
		font-weight: 900;
		span{
			font-size: 36px;
			margin-left:5px;
		}
	}
	p.limit{
		font-weight:900;
		color:rgb(50,50,50);
		font-size:12px;
		height:30px;
		line-height: 30px;
	}
	p.name{
		font-weight:900;
		color:rgb(50,50,50);
		font-size:15px;
		height:30px;
		line-height: 30px;
	}
	p.time{
		color:#c8c8c8;
		height:20px;
		&:last-child{
			margin-bottom: 20px;
		}
	}
}
.get-rebate{
	position:fixed;
	bottom:10px;
	left:0;
	width:100%;
	padding:0 20px;
	button{
		height:40px;
		// margin:0 10px;
		border:none;
		outline: none;
		color:$white;
		font-size:16px;
		border-radius: 5px;
		background-color: #329be8;
		width:100%;
	}
	button.isuse{
		background-color: #c8c8c8;
	}
}
</style>

<script type="text/babel">
import Utils from "../Utils/utils";
const _ = require("underscore");
import { MessageBox, Toast, Indicator } from 'mint-ui';

export default {
	data () {
		return {
			rebateid:"",
			rebateInfo:{}
		}
	},
	created(){
		this.loading();
		this.$store.commit("CHANGE_HEADER",{isHome:false,Title:"优惠券"});//修改标题为优惠券
		this.$store.commit("SET_SHOWBACK",true);//显示返回键
		this.$store.commit("SET_SHOWHEADER",true);//显示头部
		this.rebateid = this.$route.params.id;
		this.fetchRebate();//获取优惠券信息
	},
	filters:{
		
	},
	watch:{
		
	},
	computed:{
		
	},
	methods:{
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
		formatDate(data){
			return Utils.formatDate(data);
		},
		fetchRebate(){
			// /api/Rebate/GetCodeInfo?code=lvdzju
			this.$store.dispatch("getRebateInfo",this.rebateid).then(result=>{
				Indicator.close();
				if(result.Data){
					this.rebateInfo = result.Data;
				}
				else{
					MessageBox.alert(result.Message).then(result=>{
						this.$router.replace({name:"ticketbody"});
						// this.$router.go(-1);
					})
				}
			})
		},
		/** 领取优惠券 */
		getRebate(){
			this.loading();
			this.$store.dispatch("getRebate",this.rebateid).then(result=>{
				Indicator.close();
				if(result.Code===200){
					this.toast("领取成功,返回首页立即使用吧!");
					this.rebateInfo.IsUse = 1;
				}
				else{
					this.toast(result.Message);
				}
			})
		}
	}
}
</script>