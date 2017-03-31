<template>
<div id="checkin">
	<div class="qd__header">
		<img class="qd__header__bg" src="picture/check_bg.png">
		<div class="qd__header--top qd__header--block">
			<p class="qd__text--total-text">累计签到</p>
			<p class="qd__text--total-day">{{CreditInfo.ContCount}}</p>
			<span class="qd__text--total-card">总积分{{CreditInfo.Point}}</span>
		</div>
		<div v-if="CreditInfo.Record.length!==0" class="qd__header--bottom qd__header--block">
			<div class="qd__header-diamond__list">
				<div class="qd__header-diamond">
					<p class="diamond__block">
						<img class="diamond_img" :src="CreditInfo.Record[0].IsSignIn?'picture/check_select_icon.png':'picture/diamond_icon.png'"></img>
					</p>
					<p class="diamond__text">{{CreditInfo.Record[0].Point}}钻石</p>
				</div>
				<div class="qd__header-diamond">
					<p class="diamond__block">
						<img class="diamond_img" :src="isCheckin?'picture/check_select_icon.png':'picture/diamond_icon.png'"></img>
					</p>
					<p class="diamond__text">{{CreditInfo.Record[1].Point}}钻石</p>
					<div @click="checkIn" v-show="!isCheckin" class="qd__btn animated rubberBand">
						<span>点击签到</span>
					</div>
				</div>
				<div class="qd__header-diamond">
					<p class="diamond__block">
						<img class="diamond_img" src="picture/diamond_icon.png"></img>
					</p>
					<p class="diamond__text">{{CreditInfo.Record[2].Point}}钻石</p>
				</div>
				<div class="qd__header-diamond">
					<p class="diamond__block">
						<img class="diamond_img" src="picture/diamond_icon.png"></img>
					</p>
					<p class="diamond__text">{{CreditInfo.Record[2].Point+5>=30?30:CreditInfo.Record[2].Point+5}}钻石</p>
				</div>
				<div class="qd__header-diamond">
					<p class="diamond__block">
						<img class="diamond_img" src="picture/diamond_icon.png"></img>
					</p>
					<p class="diamond__text">{{CreditInfo.Record[2].Point+10>=30?30:CreditInfo.Record[2].Point+10}}钻石</p>
				</div>
				<div class="qd__header-diamond">
					<p class="diamond__block">
						<img class="diamond_img" src="picture/diamond_icon.png"></img>
					</p>
					<p class="diamond__text">{{CreditInfo.Record[2].Point+15>=30?30:CreditInfo.Record[2].Point+15}}钻石</p>
				</div>
			</div>
		</div>
	</div>
	<!-- 赚钻石 -->
	<div class="qd__task">
		<div class="qd__task--header">
			<p>赚钻石</p>
			<div><img src="picture/right_icon.png"></div>
		</div>
		<div class="qd__task--body">
			<div @click="openNativePage(index)" v-for="(item,index) in TaskInfo" class="task-body--list">
				<div class="task-line">
					<img src="picture/diamond_icon.png">
					<span>+{{item.Point}}</span>
				</div>
				<p class="task-line">{{item.Content}}</p>
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
import Utils from "../../Utils/utils.js";
import { MessageBox, Toast, Indicator, Popup } from 'mint-ui';

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
			TaskInfo:[],//积分任务

			debug:false,//是否是测试环境
		}
	},
	created(){
		this.getCheckinInfo();//获取用户签到信息
		this.getTaskInfo();//获取积分任务
	},
	mounted(){
		
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
		hideModel(){
			this.model = false;
		},
		/** 用户点击签到 */
		checkIn(){
			if(!this.CreditInfo.IsSignIn){
				// 没有签到
				this.goToCheckIn().then(result=>{
					if(result){
						this.isCheckin = true;
						this.CreditInfo.ContCount++;
						this.toast("签到成功!");
					}
					else{
						this.toast(result.Message);
					}
				})
			}
		},
		/** 获取签到信息 */
		getCheckinInfo(){
			this.$store.dispatch("getCheckinInfo").then(result=>{
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
			return this.$store.dispatch("goToCheckIn").then(result=>{
				return result.Data?true:false;
			})
		},
		/** 获取赚积分信息 */
		getTaskInfo(){
			this.$store.dispatch("getTaskInfo").then(result=>{
				if(result.Data){
					this.TaskInfo = result.Data;
				}
			})
		},
		/** 打开原生界面 */
		openNativePage(index){
			// 组装数据
			// let urlData = this.TaskInfo[index].Url;
			let urlData = "info,SMinePersonalCenterViewController,id=postid&age=12";
			let json = {};
			if(urlData){
				let ArrayData = urlData.split(",");
				json.androidPageName = ArrayData[0];
				json.iosPageName = ArrayData[1];
				if(ArrayData[2]!==""){
					json.json = {};
					let jsonData = ArrayData[2].split("&");
					for(let i=0;i<jsonData.length;i++){
						let lineData = jsonData[i].split("=");
						json.json[lineData[0]] = lineData[1];
					}
				}
				this.$store.dispatch("openNativePage",json);//调用原生打开页面
			}
		}
	},
	computed:{
		UserInfo(){
			return this.$store.getters.getUserInfo;
		}
	},
	components:{
		
	}
}

export default Vue_App;
</script>

<style lang="sass">
@import "../../sass/checkin.scss";
</style>