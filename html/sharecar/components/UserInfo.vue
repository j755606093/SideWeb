<template type="x/template">
	<div id="userinfo" class="userinfo">
		<my-header :showBack="true" headerTitle="修改号码信息"></my-header>
		<div v-if="UserInfo" class="userinfo--phone">
			<input ref="input" type="tel" :placeholder="UserInfo.Mobile" v-model="Phone" maxlength="11" name="phone">
			<div class="userinfo--btns">
				<div @click="changePhone" v-show="Status===0" class="btns__click--after">
					<p>点击更换联系号码</p>
				</div>
				<div @click="confirm" v-show="Status===1" class="btns__click--before">
					<p>确定更换</p>
				</div>
			</div>
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
		width:150px;
		.btns__click--after{
			height:85px;
			line-height: 85px;
			width:100%;
			text-align: center;
			>p{
				color:rgb(200,200,200);
				font-size:15px;
			}
		}
		.btns__click--before{
			height:85px;
			line-height: 85px;
			width:100%;
			text-align: center;
			>p{
				color:$blue;
				font-size:15px;
			}
		}
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
			Status:0,//0 是更换前,1是更换后
		}
	},
	created(){
		if(!this.UserInfo){
			// 如果是直接通过url进来的,那就跳到用户界面先
			this.$router.replace({name:"user"})
		}
		else{
			this.Phone = this.UserInfo.Mobile;
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
			this.$refs.input.focus();//弹出键盘
			this.Phone = "";//清空 
			this.Status = 1;
		},
		confirm(){
			if(!this.checkPhone()){
				this.toast("手机号格式错误!");
				this.$refs.input.focus();//弹出键盘
				return;
			}
			this.loading();
			this.$store.dispatch("setUserPhone",{
				Mobile:this.Phone
			}).then(result=>{
				this.Status = 0;
				Indicator.close();
				this.toast(result)
			})
			.catch(error=>{
				Indicator.close();
			})
		},
		checkPhone(){
			return /^1[23578][0-9]{9}/.test(this.Phone);
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