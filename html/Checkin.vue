<template>
<div id="checkin">
	<!-- 顶部的签到按钮 -->
	<div class="circle-btn">
		<div class="circle-model">
			<div class="circle mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent">
				<p class="status">已签到</p>
				<span class="hr"></span>
				<p class="check-day">连续1天</p>
			</div>
		</div>
	</div>
	<!-- 菜单 -->
	<div class="credits-menu">
		<!-- 菜单栏 -->
		<div class="menu">
			<button @click="myCredit" class="mdl-button mdl-js-button mdl-js-ripple-effect">我的积分10<i class="fa fa-caret-down"></i></button>
			<button @click="getCredit" class="mdl-button mdl-js-button mdl-js-ripple-effect">赚积分<i class="fa fa-caret-down"></i></button>
		</div>
		<!-- 我的积分 -->
		<div class="my-credit animated bounceIn" v-show="showMyCredit">
			<div class="credit-header">
				<p>积分记录</p>
			</div>
			<div class="credit-lists">
				<div class="list">
					<span class="name">签到</span>
					<span class="time">2016-10-05</span>
					<span class="number">+5</span>
				</div>
				<div class="list">
					<span class="name">签到</span>
					<span class="time">2016-10-05</span>
					<span class="number">+5</span>
				</div>
				<div class="list">
					<span class="name">签到</span>
					<span class="time">2016-10-05</span>
					<span class="number">+5</span>
				</div>
			</div>
		</div>
		<!-- 赚积分 -->
		<div class="get-credit animated bounceIn" v-show="showGetCredit">
			<div class="credit-header">
				<p>赚积分当前花</p>
			</div>
			<div class="credit-lists">
				<div class="list">
					<span class="name">签到</span>
					<span class="time">2016-10-05</span>
					<span class="number">+5</span>
				</div>
				<div class="list">
					<span class="name">签到</span>
					<span class="time">2016-10-05</span>
					<span class="number">+5</span>
				</div>
				<div class="list">
					<span class="name">签到</span>
					<span class="time">2016-10-05</span>
					<span class="number">+5</span>
				</div>
			</div>
		</div>
	</div>
	<!-- 积分换礼物 -->
	<div class="credit-exchange">
		<div class="exchange-header">
			<span>积分换礼</span>
			<span>更多</span>
		</div>
		<div class="exchange-body">
			<div class="lists">
				<div class="list">
					
				</div>
			</div>
		</div>
	</div>
	<div class="model" @click="hideModel" v-show="showModel"></div>
</div>
</template>

<script type="text/babel">
import Utils from "./Utils/utils.js";

export default {
	props: ['Data'],
	data () {
		return {
			showMyCredit:false,//显示我的积分
			showGetCredit:false,//显示赚积分
			showModel:false,//显示遮罩层
		}
	},
	created(){
		
	},
	methods:{
		/** 显示我的积分 */
		myCredit(){
			this.showMyCredit = !this.showMyCredit;
			this.showModel = this.showMyCredit;
		},
		/** 显示赚积分 */
		getCredit(){
			this.showGetCredit = !this.showGetCredit;
			this.showModel = this.showGetCredit;
		},
		/** 关闭我的积分,赚积分菜单 */
		hideModel(){
			this.showGetCredit = false;
			this.showMyCredit = false;
			this.showModel = false;
		}
	},
	components:{
		
	}
}
</script>

<style lang="sass">
@import "./sass/checkin.scss";
</style>