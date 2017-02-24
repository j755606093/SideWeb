<template type="x/template" id="ticketinfo">
	<div class="rebate">
		<div class="rebate-header">
			<img src="../picture/rebate_img.png">
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
			<button @click="getRebate" v-if="rebateInfo.IsReceive===0">领取</button>
			<button class="isuse" v-else>你已经领取过</button>
		</div>
	</div>
</template>

<style lang="sass">
@import "../sass/utils.scss";
.rebate{
	width:100%;
	padding:0 10px;
	margin-top:60px;
}
.rebate-header{
	width:100%;
	img{
		width:100%;
		height:200px;
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
	position:absolute;
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
		this.$store.commit("CHANGE_HEADER",{isHome:false,Title:"优惠券"});
		this.$store.commit("SET_SHOWHEADER",true);
		this.rebateid = this.$route.params.id;
		this.fetchRebate();
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
			// /api/Rebate/GetQrcodeRebate?id=15250485
			this.$store.dispatch("getRebateInfo",this.rebateid).then(result=>{
				if(result.Data){
					this.rebateInfo = result.Data;
				}
				else{
					MessageBox.alert(result.Message).then(result=>{
						this.$router.push({name:"ticketbody"});
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