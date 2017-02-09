<template>
<div id="checkin">
	<!-- 顶部的签到按钮 -->
	<div class="circle-btn">
		<div class="circle-model">
			<span :style="[{'background-color': CreditInfo.IsSignIn?'#fff':'#b6daf2'}]" :class="['fa',!CreditInfo.IsSignIn?'circle-animate':'','circle-move']"></span>
		</div>
		<div @click="checkIn" class="circle mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" :style="[{'background-color': CreditInfo.IsSignIn?'#2ecc71':'#3498db'}]">
			<p class="status" v-if="!CreditInfo.IsSignIn">立即签到</p>
			<p class="status" v-else>已签到</p>
			<span class="hr"></span>
			<p class="check-day">连续{{CreditInfo.ContCount}}天</p>
		</div>
	</div>
	<!-- 菜单 -->
	<div class="credits-menu">
		<!-- 菜单栏 -->
		<div class="menu">
			<p @click="myCredit" class="mdl-button mdl-js-button mdl-js-ripple-effect">我的积分10<i class="fa fa-caret-down"></i></p>
			<p @click="getCredit" class="mdl-button mdl-js-button mdl-js-ripple-effect">赚积分<i class="fa fa-caret-down"></i></p>
		</div>
		<!-- 我的积分 -->
		<div class="my-credit animated fadeIn" v-show="showMyCredit">
			<div class="credit-header">
				<p>积分记录</p>
			</div>
			<div class="credit-lists" v-for="(item,index) in CreditInfo.Record">
				<div class="list">
					<span class="name">{{item.Content}}</span>
					<span class="time">{{item.RecordDate}}</span>
					<span class="number">{{'+'+item.Point}}</span>
				</div>
			</div>
		</div>
		<!-- 赚积分 -->
		<div class="get-credit animated fadeIn" v-show="showGetCredit">
			<div class="credit-header">
				<p>赚积分当钱花</p>
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
	<textarea style="font-size:1.4rem;width:100%;sass/border:1px solid #333" v-model="debugValue" rows="4" cols="50"></textarea>
	
		<button style="font-size:1.4rem;border:1px solid #000;margin:10px 0" @click="test">点击测试</button>
		<button style="font-size:1.4rem;border:1px solid #000;margin:10px 0" @click="cleartest">清空</button>
		<p id="testid" style="font-size:1.4rem;">{{debugInfo}}</p>
	<div class="model" @click="hideModel" v-show="showModel"></div>
</div>
</template>

<script type="text/babel">
import Utils from "./Utils/utils.js";

let Vue_App =  {
	data () {
		return {
			showMyCredit:false,//显示我的积分
			showGetCredit:false,//显示赚积分
			showModel:false,//显示遮罩层

			isCheckin:false,//是否签到过

			CreditInfo:{
				IsSignIn:false,//是否签到过
				ContCount:0,//连续签到
				Record:[]
			},//用户积分信息
			UserInfo:null,//用户信息,
			TaskInfo:[],//积分任务

			debug:false,//是否是测试环境
			debugValue:"window.jgkj.getUserInfo()",
			debugInfo:"这里输出信息"
		}
	},
	created(){
		this.debug = (function() {
			let debug = false;
			let url = window.location.href;
			if (url.slice(0, 5) === "https") {
				debug = false;
			} else {
				debug = true;
			}
			return debug;
		})();
		this.config = {
			headers: {
				'Content-Type': 'application/json',
				'Authorization':""
			},
			serverUrl: this.debug ? "http://192.168.31.86" : "https://app.samecity.com.cn"
		}
		
		// this.getUserInfo();// 获取用户信息
		// this.getCheckinInfo();//获取用户签到信息
		window.getData = (data)=>{
			this.debugInfo = data;
		}
	},
	mounted(){
		this.getUserInfo();// 获取用户信息
		this.getCheckinInfo();//获取用户签到信息
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
		},
		/** 用户点击签到 */
		checkIn(){
			if(!this.CreditInfo.IsSignIn){
				// 没有签到
				this.goToCheckIn().then(result=>{
					if(result){
						this.CreditInfo.IsSignIn = true;
						this.CreditInfo.ContCount++;
					}
					else{
						console.log("error")
					}
				})
				
			}
		},
		/** 获取用户信息 */
		getUserInfo(){
			if(typeof window.jgkj !=="undefined"){
				this.UserInfo = window.jgkj.getUserInfo();
				this.debugInfo = this.UserInfo;
			}
			if(typeof window.webkit!=="undefined"){
				window.webkit.messageHandlers.getUserInfo.postMessage(['getData',]);
			}
			else{
				// debug数据
				this.UserInfo =  {
			    "Access_Token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDAwMDAwMSIsImp0aSI6ImJkNGZjN2Y5LTE3MzMtNGNkNS1hZGNiLWY1YzY1YWE5YmQ0NiIsImlhdCI6MTQ4NjQ1Mjc0MCwiTWVtYmVyIjoibm9ybWFsIiwibmJmIjoxNDg2NDUyNzQwLCJleHAiOjE0ODc2NjIzNDAsImlzcyI6IlN1cGVyQXdlc29tZVRva2VuU2VydmVyIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDoxNzgzLyJ9.JG19RNq6w4mwUR9DEMKu6lOG8GP_3UNqq5ViZFWV3rY",
			    "Expires_In": 0,
			    "UserId": 10000001,
			    "UserName": "你是什么鬼",
			    "Avatar": "string",
			    "Remark": "string"
			  }
			}

			this.config.headers.Authorization = this.UserInfo.Access_Token;
		},
		/** 获取签到信息 */
		getCheckinInfo(){
			fetch(this.config.serverUrl+"/api/SignIn/GetSignInInfo/"+this.UserInfo.UserId,{
				method: "GET",
				headers: this.config.headers,
			})
			.then(result => result.json())
			.then(result=>{
				if(result.Data){
					this.CreditInfo = result.Data;
					if(this.CreditInfo.IsSignIn!==0){
						this.isCheckin = true;
					}
				}
			})
		},
		/** 签到 */
		goToCheckIn(){
			return fetch(this.config.serverUrl+"/api/SignIn/IntegIncret/"+this.UserInfo.UserId,{
				method: "GET",
				headers: this.config.headers,
			})
			.then(result => result.json())
			.then(result=>{
				if(result.Data){
					return true;
				}
				else{
					return false;
				}
			})
		},
		/** 获取赚积分信息 */
		getTaskInfo(){
			fetch(this.config.serverUrl+"/api/SignIn/GetPointTask/"+this.UserInfo.UserId,{
				method: "GET",
				headers: this.config.headers,
			})
			.then(result => result.json())
			.then(result=>{
				if(result.Data){
					this.TaskInfo = result.Data;
				}
			})
		},
		test(){
			this.debugInfo = eval(this.debugValue);
		},
		cleartest(){
			this.debugValue = "";
		},
	},
	computed:{
		DataChange(data){
			console.log(data)
		}
	},
	components:{
		
	}
}

export default Vue_App;
</script>

<style lang="sass">
@import "./sass/checkin.scss";
</style>