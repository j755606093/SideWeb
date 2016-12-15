<template>
	<div id="pay" class="position">
		<!-- 车票信息 -->
		<div class="ticket-info">
			<!-- <div class="header">
				<span v-text="busInfo.Route"></span>
				<span class="font-red" v-text="'¥'+busInfo.Price"></span>
			</div> -->
			<div class="address-info">
				<div class="start box">
					<!-- <p class="first" v-text="busInfo.StartTime.slice(0,busInfo.StartTime.length-3)"></p> -->
					<p class="center" v-text="busInfo.StartPoint"></p>
					<p class="last" v-text="busInfo.StartCity"></p>
				</div>
				<div class="center box">
					<p class="first" v-text="busInfo.StartTime.slice(0,busInfo.StartTime.length-3)"></p>
					<p class="arrow-message" v-text="busInfo.Route"></p>
					<p class="arrow"></p>
				</div>
				<div class="end box">
					<p v-text="busInfo.EndPoint"></p>
					<p>{{busInfo.AcrossCity}}</p>
				</div>
			</div>
			<div class="tip-info" @click="openTip">
				<p>查看取票,退票说明,预订须知<i class="fa fa-caret-down"></i></p>
				<span>余票{{busInfo.TicketNum}}</span>
			</div>
		</div>
		<!-- 乘客信息 -->
		<div class="people-info">
			<div class="info-head">
				<span>填写乘客信息:</span>
				<!-- <span>还剩余票{{busInfo.TicketNum}}</span> -->
			</div>
			<!-- 列出乘客信息 -->
			<div class="info-list" v-if="AllFare.length!==0">
				<div class="list" v-for="(item,index) in AllFare">
					<div class="check" @click="setFare(index)">
						<span :class="[item.active?'active':'']"><i class="fa fa-check"></i></span>
					</div>
					<div class="list-body">
						<div class="list-top">
							<span class="name" v-text="item.name"></span>
							<span class="type">成人票</span>
							<span class="get-ticket" v-if="item.isGetTicket" >取票人</span>
							<span class="set-ticket" @click="setGetTicketMan(index)" v-else>设为取票人</span>
						</div>
						<!-- <div class="list-bottom">
							<p>身份证<span v-text="item.code"></span></p>
						</div> -->
					</div>
					<span @click="trashMan(index)"><i class="fa fa-trash"></i></span>
				</div>
			</div>
			<!-- 添加乘客 -->
			<div class="info-man">
				<div class="info-man-name info">
					<span>乘客姓名</span>
					<input type="text" placeholder="请填写真实姓名以免取不出票" v-model="fareName">
				</div>
				<!-- <div class="info-man-card info">
					<span>身份证</span>
					<input type="text" placeholder="请填写证件号码" v-model="certificate">
				</div> -->
			</div>
			<div class="click-append" @click="append">
				<i class="fa fa-plus-circle"></i>
				<button>确定添加</button>
			</div>
		</div>

		<!-- 取票人信息 -->
		<!-- <div class="people-info">
			<div class="info-head">
				<span>取票人信息</span>
				<span>一张订单只需填写一人</span>
			</div> -->
			<!-- 列出取票人信息 -->
			<!-- <div class="info-list" v-if="isHaveGetTicketMan">
				<div class="list">
					<div class="check">
						<span><i class="fa fa-check"></i></span>
					</div>
					<div class="list-body">
						<div class="list-top">
							<span class="name">周周周</span>
							<span class="type">成人票</span>
						</div>
						<div class="list-bottom">
							<p>身份证<span>440802199406011519</span></p>
						</div>
					</div>
					<span><i class="fa fa-trash"></i></span>
				</div>
			</div> -->
			<!-- 添加乘客 -->
			<!-- <div class="info-man" v-else>
				<div class="info-man-name info">
					<span>乘客姓名</span>
					<input type="text" placeholder="请填写真实姓名以免取不出票" v-model="fareName">
				</div>
				<div class="info-man-card info">
					<span>身份证</span>
					<input type="text" placeholder="请填写证件号码" v-model="certificate">
				</div>
			</div>
			<div class="click-append">
				<button @click="append">确定添加</button>
			</div>
		</div> -->


		<!-- 联系人信息 -->
		<div class="contact-info">
			<div class="info">
				<span>联系手机</span>
				<input type="text" placeholder="用于接收通知短信" v-model="payInfoData.contactPhone">
			</div>
		</div>
		<!-- 其他信息 -->
		<div class="other-info">
			<div class="info">
				<span class="first">优惠券</span>
				<span class="center">没有优惠券</span>
				<div class="last">
					<span @click="GetDiscount" class="right"><i class="fa fa-angle-right"></i></span>
				</div>
			</div>
		</div>
		<!-- <div class="other-info">
			<div class="info">
				<span class="first">汽车乘意险</span>
				<span class="center">15元/份</span>
				<div class="last">
					<span @click="GetInSure" :class="[isInsure?'active':'']"><i class="fa fa-check"></i></span>
				</div>
			</div>
		</div> -->
		<!-- 提示信息 -->
		<div class="root-tip-info">
			<div class="text">
				<p>友情提示:</p>
				<p>*自助取票请提前到出发车站取票。</p>
				<p>*乘客信息需为实际乘车人，否则影响保险保障的权益哦。</p>
			</div>
		</div>
		<!-- <div class="pay-people">
			<input placeholder="输入code..." class="input" type="text" v-model="Code">
			<button class="btn" @click="postCode">提交</button>
		</div> -->

		<!-- 底部提交订单 -->
		<div class="submit-box">
			<div class="order-info">
				<p>订单总额<span v-text="'¥'+payInfoData.payMoney"></span></p>
				<p>
					<span>票价<span v-text="'¥'+payInfoData.ticketMoney"></span></span>
					<!-- <span>保险费<span v-text="'¥'+payInfoData.Allinsure"></span></span> -->
				</p>
			</div>
			<div class="submit-order">
				<button @click="submitOrder">同意并提交</button>
			</div>
		</div>


		<!-- 查看取票...信息 -->
		<mt-popup
		  v-model="tipPopupVisible"
		  position="right"
		  class="tip-popup-visible">
		  <slot>
		  	<div class="body">
		  		<h3>声明:</h3>
			  	<p>1.汽车票产品因受全国各客运站的不同规定和要求，无法承诺百分之百代购成功。如购票未成功，您的资金将在1-7个工作日内全额安全退还至原支付账户。</p>
			  	<p>2.目前仅支持购买售卖全价票（含成人及身高超过1.50米的儿童）。</p>
			  	<p>3.暂不支持儿童票、免票（携儿童）、学生票、优待票等特殊票种的购买，请乘客根据需要在出发车站自行购买，携带儿童数量有限，请注意提前至车站报备。</p>
			  	<h3>取票说明</h3>
			  	<p>提前至少30分钟（节假日等高峰期建议提前一小时）凭购票成功短信，或订单详情中显示的“取票订单号”、“取票号”、“取票密码”等信息前往出发车站取票，并请准备好预订时的身份证件以备查。建议优先在自助取票机取票，如无自助取票机，请将取票信息提供给售票窗口或服务台的工作人员取票</p>
			  	<h3>退票、改签说明：</h3>
			  	<p>2.若在我司申请在线退票，车站将收取10%-20%退票手续费，实际请以短信通知金额为准。</p>
			  	<p>3.暂不支持改签，如需改签，请在发车前到出发车站按规定办理或退票后重新购买。</p>
			  	<p>3.暂不支持改签，如需改签，请在发车前到出发车站按规定办理或退票后重新购买。</p>
			  	<p>5.套餐类产品中汽车票及附加的优惠券、门票等均不支持在线退改，如需退车票，请至车站取票后办理。</p>
			  	<button @click="backTip">返回</button>
		  	</div>
		  </slot>
		</mt-popup>
		<!-- 消息提示信息 -->
		<mt-popup
		  v-model="popupVisible"
		  position="top"
		  class="message-popup-visible">
		  <slot>
		  	<p class="popup" v-text="popupText"></p>
		  </slot>
		</mt-popup>
	</div>
</template>

<script type="text/babel">
import { mapGetters } from 'vuex'
import Utils from "../Utils/utils";
const _ = require("underscore");
import { Indicator,Toast,MessageBox } from 'mint-ui';

export default {
	data () {
		return {
			startCity:"",
			endCity:"",
			busInfo:{},
			popupVisible:false,//提示框是否显示
			tipPopupVisible:false,//取票信息说明
			popupText:"我是提示框",//提示框文字
			// Code:"",//微信code
			isInsure:true,
			fareName:"",//输入的乘客名
			certificate:"",//输入的乘客凭证,身份证这类
			AllFare:[
				// {
				// 	name:"周岳谢",
				// 	// code:"440802199406011519",
				// 	active:false,
				// 	isGetTicket:false
				// },
				// {
				// 	name:"周周周",
				// 	// code:"440802199406011519",
				// 	active:true,
				// 	isGetTicket:false
				// },
				// {
				// 	name:"舟舟周",
				// 	// code:"440802199406011519",
				// 	active:false,
				// 	isGetTicket:false
				// },
				// {
				// 	name:"粥粥周",
				// 	// code:"440802199406011519",
				// 	active:true,
				// 	isGetTicket:false
				// }
			],//所有的乘客信息
			isHaveGetTicketMan:false,//是否有取票人信息
			
			//订单信息
			payInfoData:{
				passenger:null,//乘客
				inSureMoney:0,//单笔保险费
				getTicketMan:null,//取票人信息
				Allinsure:0,//保险费用(总共)
				ticketMoney:this.$store.getters.getBusInfo.Price,//票的单价
				payMoney:0,//总共支付的钱
				contactPhone:""
			},//订单信息
		}
	},
	beforeCreate(){
		if(this.$store.getters.getBusInfo===null){
			//数据为空,一般是直接进入这个页面才会这样
			this.$router.replace({path:"/home/ticketbody"});
			return;
		}
	},
	created(){
		this.busInfo = this.$store.getters.getBusInfo;
		this.startCity = this.$store.state.tickets.startCity;
		this.endCity = this.$store.state.tickets.endCity;
		
		let startDate = this.$store.getters.getInfo.startDate;
		this.$store.commit("CHANGE_HEADER",{
			isHome:false,
			Title:startDate.date+" "+startDate.week
		});

		this.computeAll();
		// console.log(this.formatData(this.busInfo))
	},
	computed:{
		startDate(){
			return this.$store.getters.getInfo.startDate.date+this.$store.getters.getInfo.startDate.week;
		}
	},
	methods:{
		/**
		 * 格式化vue数据
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		formatData(data){
			return JSON.parse(JSON.stringify(data));
		},
		// pay(){
		// 	console.log(this.formatData(this.busInfo))
		// },
		/**
		 * 提示框里的信息
		 * @param  {[type]} text [description]
		 * @return {[type]}      [description]
		 */
		popupMessage(text){
			Toast({
			  message: text,
			  position: 'center',
			  duration: 3000
			});
			// this.popupText = text;
			// this.popupVisible = true;
		},
		// postCode(){
		// 	// 提示加载中
		// 	Indicator.open({
		// 		text: '加载中...',
		// 		spinnerType: 'double-bounce'
		// 	});
		// 	this.$http.post("http://wx.1yhp.net/api/Order/WxPay",{Code:this.Code}).then(res=>{
		// 		Indicator.close();
		// 		if(res.data.Status===0){
		// 			this.popupMessage(res.data.Message);
		// 		}
		// 		else{
		// 			this.popupMessage(JSON.stringify(res.data));
		// 			this.payMoney(res.data.Data);
		// 		}
		// 	}).catch(error=>{
		// 		this.popupMessage(error);
		// 	})
		// },
		// payMoney(paydata){
		// 	window.WeixinJSBridge.invoke("getBrandWCPayRequest",paydata,function(r){
		// 		if(r.err_msg==="get_brand_wcpay_request:ok"){
		// 			// 支付成功
		// 			// 再根据小票拿数据
		// 			// 需要延迟2秒以上再去查找订单,否则会出现找不到的情况
		// 			Indicator.open({
		// 				text: '支付成功...',
		// 				spinnerType: 'double-bounce'
		// 			});
		// 			setTimeout(()=>{
		// 				Indicator.close();
		// 			},3000);
		// 		}
		// 	});
		// },
		/**
		 * 查看取票退票说明
		 * @return {[type]} [description]
		 */
		openTip(){
			this.tipPopupVisible = true;
		},
		/**
		 * 获取所有的乘客数组
		 * @return {[type]} [description]
		 */
		getAllFare(){
			let data = _.filter(this.AllFare,item=>{
				return item.active;
			});

			this.payInfoData.passenger = data;
			return data;
		},
		/**
		 * 计算所有的乘客的钱
		 * @return {[type]} [description]
		 */
		computeTicketMoney(){
			let len = this.getAllFare().length;
			this.payInfoData.payMoney = this.payInfoData.ticketMoney*len + this.payInfoData.Allinsure;
		},
		/**
		 * 计算保险费
		 * @return {[type]} [description]
		 */
		computeInsureMoney(){
			if(this.isInsure){
				// 设置了保险
				this.payInfoData.Allinsure = this.payInfoData.inSureMoney*this.getAllFare().length;
			}
			else{
				this.payInfoData.Allinsure = 0;
			}
		},
		computeAll(){
			this.computeInsureMoney();
			this.computeTicketMoney();
		},
		/**
		 * 获取取票人信息
		 * @return {[type]} [description]
		 */
		getGetTicketMan(){
			let data = _.filter(this.AllFare,item=>{
				return item.isGetTicket;
			});

			this.payInfoData.getTicketMan = data;
			return data;
		},
		/**
		 * 提交订单
		 * @return {[type]} [description]
		 */
		submitOrder(){
			if(this.getAllFare().length===0){
				this.popupMessage("请先添加或者选择乘客!");
				return;
			}
			else{
				if(this.getGetTicketMan().length===0){
					this.popupMessage("请设置一个取票人!");
					return;
				}
				else{
					if(this.inspectPhone()){
						this.computeAll();
						Indicator.open({
							text: '加载中...',
							spinnerType: 'double-bounce'
						});

						// 获取乘客名字,逗号相连
						let arrayData = "";
						for(let i=0;i<this.payInfoData.passenger.length;i++){
							arrayData = arrayData+","+this.AllFare.name;
						}

						this.$store.dispatch("payMoney",{
							Name:arrayData,
							Mobile:this.payInfoData.contactPhone,
							Num:arrayData.length
						}).then(result=>{
							console.log(result);
							Indicator.close();
							this.popupMessage("支付失败,请稍后再试!");
						})
						// setTimeout(()=>{
						// 	Indicator.close();
						// 	this.popupMessage("支付失败,请稍后再试!");
						// },2000)
					}
					else{
						this.popupMessage("请填写正确的联系手机号!");
					}
				}
			}
		},
		/**
		 * 退出提示框提示页(关闭)
		 * @return {[type]} [description]
		 */
		backTip(){
			// 退出tip
			this.tipPopupVisible = false;
			this.popupVisible = false;
		},
		/**
		 * 检查手机号
		 * @return {[type]} [description]
		 */
		inspectPhone(){
			return /^1[23578][0-9]{9}$/.test(this.payInfoData.contactPhone);
		},
		/**
		 * 添加乘客信息
		 * @return {[type]} [description]
		 */
		append(){
			// 添加乘客至AllFare
			// 首先检查输入是否正确
			if(Utils.isChinaName(this.fareName)&&this.fareName.length>=2){
				// 是中文
				if(this.AllFare.length>this.busInfo.TicketNum){
					// 如果添加人数大于剩余票数
					this.popupMessage("乘客数不允许大于余票数!");
				}
				else{
					this.AllFare.push({
						name:this.fareName,
						// code:this.certificate,
						active:true,
						isGetTicket:false
					});
					// 清空输入的信息
					this.fareName = "";
					this.certificate = "";

					this.popupMessage("添加成功!");
					this.computeAll();
				}
			}
			else{
				this.popupMessage("请输入正确的姓名!");
			}
		},
		/**
		 * 选择乘客check按钮
		 * @param {[type]} index [description]
		 */
		setFare(index){
			// 若没有选中,那么设置为乘客
			// 添加的乘客不允许大于余票
			let lastTicket = parseInt(this.busInfo.showTicketInfo);

			if(this.getAllFare().length>lastTicket && !this.AllFare[index].active){
				// 选中的已经超过3个人
				this.popupMessage("乘客数已经超过余票数!");
			}
			else{
				this.AllFare[index].active = !this.AllFare[index].active;
				this.computeAll();
			}
		},
		/**
		 * 删除乘客信息
		 * @param  {[type]} index [description]
		 * @return {[type]}       [description]
		 */
		trashMan(index){
			let array = this.formatData(this.AllFare);

			MessageBox.confirm('确定删除'+array[index].name+'?').then(action => {
				// this.AllFare = array.slice(0,index).concat(array.slice(index+1));
				this.AllFare.splice(index,1);
				this.computeAll();
			}).catch(error=>{
				// error=cancel
				console.log(error)
			});
		},
		/**
		 * 设置汽车保险
		 */
		GetInSure(){
			this.isInsure = !this.isInsure;
			this.computeAll();
		},
		/**
		 * 设置取票人
		 * @param {[type]} index [description]
		 */
		setGetTicketMan(index){
			_.map(this.AllFare,item=>{
				item.isGetTicket = false;
			})
			this.AllFare[index].isGetTicket = true;
		},
		GetDiscount(){
			// 查看选取优惠券
		}
	}
}
</script>

<style lang="sass">
@import "../css/ticketpay.css";
</style>