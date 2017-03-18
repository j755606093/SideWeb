<template>
<div id="checkin">
	<div class="qd__header">
		<img class="qd__header__bg" src="picture/check_bg.png">
		<div class="qd__header--top qd__header--block">
			<p class="qd__text--total-text">累计签到</p>
			<p class="qd__text--total-day">7</p>
			<span class="qd__text--total-card">总积分120</span>
		</div>
		<div class="qd__header--bottom qd__header--block">
			<div class="qd__header-diamond__list">
				<div class="qd__header-diamond">
					<p class="diamond__block">
						<img class="diamond_img" src="picture/check_select_icon.png"></img>
					</p>
					<p class="diamond__text">5钻石</p>
				</div>
				<div class="qd__header-diamond">
					<p class="diamond__block">
						<img class="diamond_img" src="picture/diamond_icon.png"></img>
					</p>
					<p class="diamond__text">5钻石</p>
					<div class="qd__btn animated rubberBand">
						<span>点击签到</span>
					</div>
				</div>
				<div class="qd__header-diamond">
					<p class="diamond__block">
						<img class="diamond_img" src="picture/diamond_icon.png"></img>
					</p>
					<p class="diamond__text">5钻石</p>
				</div>
				<div class="qd__header-diamond">
					<p class="diamond__block">
						<img class="diamond_img" src="picture/diamond_icon.png"></img>
					</p>
					<p class="diamond__text">5钻石</p>
				</div>
				<div class="qd__header-diamond">
					<p class="diamond__block">
						<img class="diamond_img" src="picture/diamond_icon.png"></img>
					</p>
					<p class="diamond__text">5钻石</p>
				</div>
				<div class="qd__header-diamond">
					<p class="diamond__block">
						<img class="diamond_img" src="picture/diamond_icon.png"></img>
					</p>
					<p class="diamond__text">5钻石</p>
				</div>
			</div>
		</div>
	</div>
	<div class="qd__task">
		<div class="qd__task--header">
			<p>赚钻石</p>
			<div><img src="picture/right_icon.png"></div>
		</div>
		<div class="qd__task--body">
			<div class="task-body--list">
				<div class="task-line">
					<img src="picture/diamond_icon.png">
					<span>+100</span>
				</div>
				<p class="task-line">完善资料</p>
			</div>
			<div class="task-body--list">
				<div class="task-line">
					<img src="picture/diamond_icon.png">
					<span>+100</span>
				</div>
				<p class="task-line">完善资料</p>
			</div>
			<div class="task-body--list">
				<div class="task-line">
					<img src="picture/diamond_icon.png">
					<span>+100</span>
				</div>
				<p class="task-line">完善资料</p>
			</div>
			<div class="task-body--list">
				<div class="task-line">
					<img src="picture/diamond_icon.png">
					<span>+100</span>
				</div>
				<p class="task-line">完善资料</p>
			</div>
			<div class="task-body--list">
				<div class="task-line">
					<img src="picture/diamond_icon.png">
					<span>+100</span>
				</div>
				<p class="task-line">完善资料</p>
			</div>
			<div class="task-body--list">
				<div class="task-line">
					<img src="picture/diamond_icon.png">
					<span>+100</span>
				</div>
				<p class="task-line">完善资料</p>
			</div>
		</div>
	</div>
	<div class="qd__product">
		<div class="qd__product--header">
			<p>换商品</p>
			<div><img src="picture/right_icon.png"></div>
		</div>
		<div class="product__list">
			<div class="list--block">
				<div class="product__list--img">
					<img src="picture/norebate.png">
				</div>
				<div class="product__list--text">
					<p>aj1北卡蓝一双</p>
					<div class="product-need-diamond">
						<img src="picture/diamond_icon.png">
						<span>1000钻石</span>
					</div>
				</div>
			</div>
			<div class="list--block">
				<div class="product__list--img">
					<img src="picture/norebate.png">
				</div>
				<div class="product__list--text">
					<p>aj1北卡蓝一双</p>
					<div class="product-need-diamond">
						<img src="picture/diamond_icon.png">
						<span>1000钻石</span>
					</div>
				</div>
			</div>
			<div class="list--block">
				<div class="product__list--img">
					<img src="picture/norebate.png">
				</div>
				<div class="product__list--text">
					<p>aj1北卡蓝一双</p>
					<div class="product-need-diamond">
						<img src="picture/diamond_icon.png">
						<span>1000钻石</span>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="model" @click="hideModel" v-show="showModel"></div>
</div>
</template>

<script type="text/babel">
import Utils from "./Utils/utils.js";
import { MessageBox, Toast, Indicator, Popup } from 'mint-ui';
import "whatwg-fetch";

let Vue_App =  {
	data () {
		return {
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
		
		this.getUserInfo();// 获取用户信息
		this.getCheckinInfo();//获取用户签到信息
		// this.getTaskInfo();//获取积分任务
	},
	mounted(){
		
	},
	methods:{
		hideModel(){
			this.model = false;
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
				this.UserInfo = JSON.parse(window.jgkj.getUserInfo());
				this.debugInfo = this.UserInfo;
			}
			else{
				// debug数据
				this.UserInfo =  {
			    "Access_Token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMDAwMDAwMSIsImp0aSI6ImE1MjhjNmQ0LTY0ZmMtNDZhOC1iMGI0LWZjZGMxODk1NTdjMSIsImlhdCI6MTQ4OTgzODkzNSwiTWVtYmVyIjoibm9ybWFsIiwibmJmIjoxNDg5ODM4OTM0LCJleHAiOjE0OTEwNDg1MzQsImlzcyI6IlN1cGVyQXdlc29tZVRva2VuU2VydmVyIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDoxNzgzLyJ9.8zJaEVAdK6chuoJfWJvWdVZVIQBvZynQYjUQw60dX0g",
			    "Expires_In": 0,
			    "UserId": "10000001",
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
		}
	},
	computed:{
		
	},
	components:{
		
	}
}

export default Vue_App;
</script>

<style lang="sass">
@import "./sass/checkin.scss";
</style>