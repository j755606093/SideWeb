<template type="x/template">
	<div id="userinfo" class="userinfo">
		<my-header :showBack="true" headerTitle="修改号码信息"></my-header>
		<div v-if="UserInfo" class="userinfo--phone">
			<input ref="inputphone" type="tel" :placeholder="UserInfo.Mobile" v-model="Phone" maxlength="11" name="phone">
			<div class="userinfo--btns">
				<div @click="changePhone" v-show="Status===0" class="btns__click--after">
					<p>点击更换联系号码</p>
				</div>
				<div @click="confirm(0)" v-show="Status===1" class="btns__click--before">
					<p>确定更换</p>
				</div>
			</div>
		</div>
		<div v-if="UserInfo" class="userinfo--phone userinfo--name">
			<input ref="inputname" type="text" :placeholder="UserInfo.Nickname" v-model="NickName" maxlength="11" name="nickname">
			<div class="userinfo--btns">
				<div @click="changeName" v-show="StatusName===0" class="btns__click--after">
					<p>点击更换昵称</p>
				</div>
				<div @click="confirm(1)" v-show="StatusName===1" class="btns__click--before">
					<p>确定更换</p>
				</div>
			</div>
		</div>
		<div class="update--info">
			<button @click="updateUserInfo">同步微信信息</button>
			<p>若您最近更新了微信头像等信息,建议您同步最新数据以免显示不准确~</p>
		</div>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
.userinfo--phone{
	height:85px;
	line-height: 85px;
	width:100%;
	background-color: #fff;
	margin-top:50px;
	padding:0 20px;
	position:relative;
	>input{
		height:40px;
		width:100%;
		outline:none;
		border:none;
		font-size:15px;
		font-weight: 900;
		color:rgb(30,30,30);
		z-index:10;
		background-color: transparent;
	}
	.userinfo--btns{
		position:absolute;
		top:0;
		right:0;
		height:85px;
		line-height: 85px;
		width:100%;
		.btns__click--after{
			height:85px;
			line-height: 85px;
			width:100%;
			text-align: right;
			>p{
				color:rgb(200,200,200);
				font-size:15px;
				margin-right:20px;
			}
		}
		.btns__click--before{
			height:85px;
			line-height: 85px;
			width:100%;
			text-align: right;
			>p{
				color:$blue;
				font-size:15px;
				margin-right:20px;
			}
		}
	}
}
.userinfo--name{
	margin-top:10px;
}
.update--info{
	width:100%;
	height:100px;
	margin-top:20px;
	text-align:center;
	>button{
		border:none;
		outline: none;
		width:80%;
		height:40px;
		margin-top:5px;
		background-color: $blue;
		border-radius: 5px;
		font-size:16px;
		color:#fff;
	}
	>p{
		color:rgb(50,50,50);
		font-size:12px;
		text-align:center;
		padding:0 20%;
		margin-top:10px;
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
			Phone:"",
			NickName:"",
			Status:0,//0 是更换前,1是更换后
			StatusName:0,//0 是更换前,1是更换后
		}
	},
	created(){
		if(!this.UserInfo){
			// 如果是直接通过url进来的,那就跳到用户界面先
			this.$router.replace({name:"user"})
		}
		else{
			this.Phone = this.UserInfo.Mobile;
			this.NickName = this.UserInfo.Nickname;
		}
	},
	activated(){
		
	},
	computed:{
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
		changePhone(){
			this.$refs.inputphone.focus();//弹出键盘
			this.Phone = "";//清空 
			this.Status = 1;
		},
		changeName(){
			this.$refs.inputname.focus();//弹出键盘
			this.NickName = "";//清空 
			this.StatusName = 1;
		},
		confirm(index){
			// 修改手机号
			if(index===0){
				this.$refs.inputphone.blur();//键盘
				if(!this.checkPhone()){
					this.toast("手机号格式错误!");
					// this.$refs.inputphone.focus();//弹出键盘
					return;
				}
				this.loading();
				this.$store.dispatch("setUserPhone",{
					Mobile:this.Phone
				}).then(result=>{
					/** 后面要修改loal本地存储的用户信息 */
					this.Status = 0;
					Indicator.close();
					this.toast(result)
				})
				.catch(error=>{
					Indicator.close();
				})
			}
			// 修改昵称
			if(index===1){
				this.$refs.inputname.blur();//键盘
				if(this.NickName===""){
					this.toast("用户名不允许为空!");
					// this.$refs.inputphone.focus();//弹出键盘
					return;
				}
				this.loading();
				this.$store.dispatch("setUserNickName",{
					NickName:this.NickName
				}).then(result=>{
					/** 后面要修改loal本地存储的用户信息 */
					this.StatusName = 0;
					Indicator.close();
					this.toast(result)
				})
				.catch(error=>{
					Indicator.close();
				})
			}
		},
		checkPhone(){
			return /^1[23578][0-9]{9}/.test(this.Phone);
		},
		updateUserInfo(){
			this.$store.dispatch("updateUserInfo").then(result=>{
				this.toast(result.Message)
			})
		}
	},
	filters:{
		
	},
	components:{
		"my-list":List,
		"my-header":Header,
	}
}
</script>