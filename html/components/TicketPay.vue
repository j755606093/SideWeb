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
		<!-- 车站信息 -->
		<div class="station-info">
			<span>乘车点:</span>
			<span class="center nowrap">{{selectStation}}</span>
			<span @click="showStation" style="color:#0074D9;text-align:right;">更多</span>
			<!-- <span>{{busInfo.StartAddress}}</span> -->
		</div>
		<!-- 乘客信息 -->
		<div class="people-info">
			<div class="info-head">
				<span>乘客信息</span>
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
							<span class="name" @click="setFare(index)" v-text="item.Name"></span>
							<span class="type">{{item.Mobile}}</span>
							<template v-if="item.Mobile">
								<span class="get-ticket" v-if="item.isGetTicket">联系人</span>
								<span class="set-ticket" @click="setGetTicketMan(index)" v-else>设为联系人</span>
							</template>
						</div>
						<!-- <div class="list-bottom">
							<p>身份证<span v-text="item.code"></span></p>
						</div> -->
					</div>
					<!-- <span>{{item.Mobile}}</span> -->
					<span @click="trashMan(index)"><i class="fa fa-trash"></i></span>
				</div>
			</div>
			<!-- 添加乘客 -->
			<div class="info-man">
				<div class="info-man-name info">
					<span>乘客姓名</span>
					<input type="text" placeholder="请填写真实姓名" v-model="fareName">
					
				</div>
				<div class="info-man-card info">
					<span>手机号</span>
					<input type="text" placeholder="选填(可用于联系)" v-model="certificate">
					<button @click="append"><i class="fa fa-plus-circle"></i>添加</button>
				</div>
			</div>
			<!-- <div class="click-append" @click="append">
				<i class="fa fa-plus-circle"></i>
				<button>确定添加</button>
			</div> -->
		</div>

		<!-- 取票人信息 -->
		<div class="people-info">
			<div class="info-head">
				<span>联系信息</span>
				<!-- <span>一张订单只需填写一人</span> -->
			</div>
			<div class="contact-info">
				<div class="info">
					<span>联系人手机</span>
					<input type="text" placeholder="必填(用于联系)" v-model="payInfoData.contactPhone">
				</div>
			</div>
		</div>
		<!-- 其他信息 -->
		<div class="people-info">
			<div class="contact-info">
				<div class="info-head">
					<span>其它信息</span>
					<!-- <span>一张订单只需填写一人</span> -->
				</div>
				<div class="info">
					<span>优惠券</span>
					<span @click="showDiscountWindow" class="center">你有{{optionsDiscount.length}}个优惠券</span>
					<span class="last" v-show="selectDiscount.length!==0">{{`已选${selectDiscount.length}个`}}</span>
				</div>
				<div class="info discount-code">
					<span class="first">优惠码</span>
					<input class="center" type="text" placeholder="请输入您的优惠码" v-model="payInfoData.discountcode">
					<!-- <span class="center">有优惠码?</span> -->
					<div class="last">
						<button class="right" @click="checkCodeStatus">验证</button>
						<!-- <span @click="GetDiscount" class="right"><i class="fa fa-angle-down"></i></span> -->
					</div>
				</div>
				<div class="info show-discount animated fadeInDown" v-if="havediscountcode">
					<span>优惠码信息</span>
					<span class="center">{{discountCode.Name}}</span>
					<span class="last" v-if="isUseCode" @click="useDiscountCode">已使用</span>
					<span class="last" v-else @click="useDiscountCode">立即使用</span>
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
			<!-- <div class="text">
				<p>友情提示:</p>
				<p>*自助取票请提前到出发车站取票。</p>
				<p>*乘客信息需为实际乘车人，否则影响保险保障的权益哦。</p>
			</div> -->
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
					<span>优惠<span v-text="'¥'+discountMoney"></span></span>
				</p>
			</div>
			<div class="submit-order">
				<button @click="submitOrder">提交订单</button>
			</div>
		</div>

		<!-- 乘车点 -->
		<mt-popup
		  v-model="stationPopupVisible"
		  class="station-popup-visible">
		  <slot>
		  	<div class="station">
		  		<mt-radio
					  title="乘车点选择"
					  v-model="selectStation"
					  :options="options">
					</mt-radio>
					<button @click="checkSelectStation" class="btn">确定</button>
		  	</div>
		  </slot>
		</mt-popup>
		<!-- 优惠券选择 -->
		<mt-popup
		  v-model="discountPopupVisible"
		  class="station-popup-visible">
		  <slot>
		  	<div class="station">
		  		<mt-checklist
					  title="优惠券选择"
					  v-model="selectDiscount"
					  :options="optionsDiscount">
					</mt-checklist>
					<button @click="checkSelectDiscount" class="btn">确定</button>
		  	</div>
		  </slot>
		</mt-popup>
		<!-- 查看取票...信息 -->
		<mt-popup
		  v-model="tipPopupVisible"
		  position="top"
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
		<!-- 支付信息 -->
		<mt-popup
			v-if="payInfoPopupVisible"
		  v-model="payInfoPopupVisible"
		  position="right"
		  class="payinfo-popup-visible">
		  <slot>
		  	<div class="pay-body">
		  		<div class="info-body">
		  			<div class="status">
		  				<i class="fa fa-check-circle"></i>
		  				<p>生成订单成功!</p>
		  				<p class="time">请在半小时之内支付订单 {{countdownTime}}</p>
		  			</div>
		  		</div>
		  		<div class="ticket-body">
		  			<div class="pay-info">
		  				<div class="address-info">
								<div class="start box">
									<!-- <p class="first" v-text="busInfo.StartTime.slice(0,busInfo.StartTime.length-3)"></p> -->
									<p class="center" v-text="serverPayInfo.LineInfo.StartPoint"></p>
									<p class="last" v-text="serverPayInfo.LineInfo.StartCity"></p>
								</div>
								<div class="center box">
									<!-- <p class="first" v-text="busInfo.StartTime.slice(0,busInfo.StartTime.length-3)"></p> -->
									<p class="arrow-message" v-text="serverPayInfo.LineInfo.Route"></p>
									<p class="arrow"></p>
								</div>
								<div class="end box">
									<p v-text="serverPayInfo.LineInfo.EndPoint"></p>
									<p>{{serverPayInfo.LineInfo.AcrossCity}}</p>
								</div>
							</div>
							<div class="info-box passager-info">
								<p>
									<span class="type">乘车日期:</span>
									<span class="name">{{serverPayInfo.LineInfo.Date+" "+this.$store.getters.getInfo.startDate.week+" "+serverPayInfo.LineInfo.BoardTime}}</span>
								</p>
							</div>
							<div class="info-box passager-info">
								<p>
									<span class="type">乘车地址:</span>
									<!-- <span class="name"></span> -->
									{{selectStation}}
								</p>
							</div>
							<div class="info-box passager-info">
								<p>
									<span class="type">乘客:</span>
									<span class="name">{{serverPayInfo.UsrInfo.Name.join(',')}}</span>
								</p>
							</div>
							<!-- <div class="info-box get-ticket">
								<p>
									<span class="type">联系人:</span>
									<span class="name">{{serverPayInfo.UsrInfo.TktHolder}}</span>
								</p>
							</div> -->
							<div class="info-box get-ticket">
								<p>
									<span class="type">联系方式:</span>
									<span class="name">{{serverPayInfo.UsrInfo.Mobile}}</span>
								</p>
							</div>
		  			</div>
		  			<!-- <button @click="outpay">点击退出</button> -->
		  		</div>
		  		<div class="pay-ticket-info">
		  			<div class="pay-ticket-info-header">
		  				<p>订单信息</p>
		  			</div>
		  			<div class="pay-ticket-info-body">
		  				<p>订单编号:{{serverPayInfo.OrderInfo.Id}}</p>
		  				<p>下单日期:{{serverPayInfo.OrderInfo.OrderTime}}</p>
		  				<p class="all">总额: <span style="color:red">{{serverPayInfo.OrderInfo.TotalPrice+'¥'}}</span></p>
		  				<span style="clear:both;"></span>
		  			</div>
		  		</div>
		  		<!-- 立即支付 -->
		  		<div class="now-pay">
		  			<button @click="payMoney">立即支付</button>
		  		</div>
		  		<div class="out-order" style="margin-top:20px;margin-bottom:20px;">
		  			<a>取消订单</a>
		  		</div>
		  	</div>
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
			payInfoPopupVisible:false,//支付
			popupText:"我是提示框",//提示框文字
			// Code:"",//微信code
			isInsure:true,
			fareName:"",//输入的乘客名
			certificate:"",//输入的乘客凭证,身份证这类
			AllFare:[
				// {
				// 	Name:"周岳谢",
				// 	// code:"440802199406011519",
				// 	active:false,
				// 	isGetTicket:false
				// },
			],//所有的乘客信息
			isHaveGetTicketMan:false,//是否有取票人信息
			stationPopupVisible:false,//显示乘车点
			selectStation:"",//选择的乘车点
			options:[],//可选择的乘车点列表
			discountPopupVisible:false,//优惠券选择
			selectDiscount:[],//选择的优惠券
			optionsDiscount:[],//优惠券列表
			rebateid:"",//优惠券id列表
			discountMoney:0,//优惠的钱数
			discountCode:{},//优惠码信息
			isUseCode:false,//是否使用优惠码
			
			//订单信息
			payInfoData:{
				passenger:null,//乘客
				inSureMoney:0,//单笔保险费
				getTicketManName:"",//取票人名字
				Allinsure:0,//保险费用(总共)
				ticketMoney:0,//票的单价
				payMoney:0,//总共支付的钱
				contactPhone:"",//取票人手机号
				discountcode:"",//优惠码
			},//订单信息

			TicketPay:null,//服务器产生的订单信息
			havediscountcode:false,//是否有优惠码
			countdown:null,//倒计时
			storeCountTime:null,//记录倒计时数字
			countdownTime:null,//倒计时文字显示
			serverPayInfo:{
				OrderInfo:{},
				UsrInfo:{},
				LineInfo:{},
				PayInfo:{},
			},//服务器返回的订单信息
		}
	},
	beforeCreate(){
		if(this.$store.getters.getIsFirst){
			//数据为空,一般是直接进入这个页面才会这样
			this.$router.replace({path:"/home/ticketbody"});
		}
	},
	created(){
		this.startCity = this.$store.state.tickets.startCity;
		this.endCity = this.$store.state.tickets.endCity;

		if(!this.$store.getters.getIsFirst){
			this.busInfo = this.$store.getters.getBusInfo;
			this.payInfoData.ticketMoney = this.$store.getters.getBusInfo.Price;

			let startDate = this.$store.getters.getInfo.startDate;
			this.$store.commit("CHANGE_HEADER",{
				isHome:false,
				Title:startDate.date+" "+startDate.week
			});
		}

		//设置乘车点
		this.selectStation = this.busInfo.StartAddress[0];
		this.options = this.busInfo.StartAddress;

		//设置优惠券
		if(this.$store.getters.getRebate){
			let rebate = this.$store.getters.getRebate;
			_.map(rebate,item=>{
				let data = item;
				data.label = `${item.Name} (满${item.LimitMoney}元减${item.Money}元)`;
				data.value = item.Id;
				data.disabled = false;
				this.optionsDiscount.push(data);
			})
		}
		
		
		//获取本地的取票人数据....现在冲服务器获取
		// this.getLocalStorePhone();
		this.payInfoData.contactPhone = this.$store.getters.getPhone;//获取服务器上的取票人手机号

		let passenger = this.$store.getters.getPassenger;
		//获取乘客信息
		let rebate = this.$store.getters.getRebate;//获取优惠码
		for(let i=0;i<passenger.length;i++){
			passenger[i].active = false;
			passenger[i].isGetTicket = false;
			// if(passenger[i].Mobile!==''){
			// 	passenger[i].isGetTicket = false;
			// }
			this.AllFare.push(passenger[i]);
			//如果乘客信息中有默认的取票人
			// if(passenger[i].IsDefault===1){
			// 	this.payInfoData.getTicketManName = passenger[i].Name;
			// 	this.payInfoData.contactPhone = passenger[i].Mobile;
			// }
		}
		// this.AllFare = this.getLocalStorePassager();

		this.computeAll();
		
		// this.$store.dispatch("getWXconfig")
		// 	.then(result=>{
		// 		let data = result.Data;
		// 		data.debug = true;
		// 		data.jsApiList = ["chooseWXPay","openLocation","getLocation"];
		// 		wx.config(data);
		// 		wx.ready(function(){
		// 			alert("ready");
		// 		});
		// 		wx.error(function(res){
		// 			alert(res)
		// 		})
		// 	})
		
	},
	computed:{
		startDate(){
			return this.$store.getters.getInfo.startDate.date+this.$store.getters.getInfo.startDate.week;
		},
		concatName(){
			// 获取乘客名字,逗号相连
			let arrayData = "";
			for(let i=0;i<this.AllFare.length;i++){
				arrayData = this.AllFare[i].name+","+arrayData;
			}

			return arrayData.split(",")[0];
		},
	},
	watch:{
		selectDiscount(newval){
			// console.log(newval)
			let len = newval.length;
			if(len===0){
				this.computeAll();
				return;
			}

			if(len===1){
				this.rebateid = newval[0];
				this.computeAll();
				return;
			}
			
			let optionsDiscount = this.optionsDiscount;
			let lastId = newval[len-1];
			
			//找到最新加入的一项
			let lastOption = _.find(optionsDiscount,(item)=>{
				return item.Id===lastId;
			});
			
			//查看最后一个是不是单选
			if(lastOption&&lastOption.IsSingle===1){
				this.rebateid = lastOption.Id;//只留自己
				this.selectDiscount = [lastOption.Id];
			}
			else{
				this.rebateid = this.rebateid+","+lastOption.Id;
			}
			
			//筛选所有的IsSingle=1选项
			for(let i=0;i<len;i++){
				let data = _.find(optionsDiscount,(item)=>{
					return item.Id===newval[i]
				});
				if(data.IsSingle===1){
					this.rebateid = lastOption.Id;//只留自己
					this.selectDiscount = [lastOption.Id];
				}
			}
			this.computeAll();
			// console.log(this.rebateid)
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
		// haveDiscountCode(){
		// 	this.havediscountcode = !this.havediscountcode;
		// },
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
			  position: 'bottom',
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
		payMoney(){
				Indicator.open({
					text: '加载中...',
					spinnerType: 'double-bounce'
				});
			let id = this.serverPayInfo.OrderInfo.Id;
			this.$store.dispatch("showWXpay",id)
				.then(data=>{
					Indicator.close();
					let paydata = data.Data;

					// paydata.success = function(res){
					// 	Toast({
					// 	  message: '支付成功!',
					// 	  iconClass: 'fa fa-check',
					// 	  duration:3000,
					// 	  className:"success"
					// 	});
					// }
					window.WeixinJSBridge.invoke("getBrandWCPayRequest",paydata,function(r){
						if(r.err_msg==="get_brand_wcpay_request:ok"){
							Toast({
							  message: '支付成功!',
							  iconClass: 'fa fa-check',
							  duration:3000,
							  className:"success"
							});
						}
					});
					// wx.chooseWXPay(paydata)
				})
		},
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
			let money = this.payInfoData.ticketMoney*len + this.payInfoData.Allinsure-this.discountMoney;
			
			if(money<0){
				this.payInfoData.payMoney = 0;
			}
			else{
				this.payInfoData.payMoney = money.toFixed(2);
			}
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
		/**
		 * 计算优惠券和优惠券
		 * @return {[type]} [description]
		 */
		computeDiscound(){
			let len = this.selectDiscount.length;
			this.discountMoney = 0;
			if(len!==0){
				for(let i=0;i<len;i++){
					let data = _.find(this.optionsDiscount,(item)=>{
						return item.Id===this.selectDiscount[i]
					});
					this.discountMoney += data.Money;
				}
			}
			// 优惠码
			if(this.isUseCode){
				this.discountMoney += this.discountCode.Money;
			}
		},
		computeAll(){
			this.computeInsureMoney();
			this.computeDiscound();
			this.computeTicketMoney();
		},
		/**
		 * 获取取票人信息
		 * @return {[type]} [description]
		 */
		getGetTicketMan(){
			let name = this.payInfoData.getTicketManName;
			if(Utils.isChinaName(name)&&name.length>=2||name===""){
				//取票人名字必须是汉字,或者为空
				// window.localStorage.setItem("GetTicketName",this.payInfoData.getTicketManName);
				return false;
			}
			else{
				return true;
			}
		},
		CountDown(){
			this.storeCountTime = 60*30-1;//半个小时
			this.countdown = setInterval(()=>{
				if(this.storeCountTime===0){
					clearInterval(this.countdown);
					this.countdown = null;
					return;
				}
				let minth = parseInt(this.storeCountTime/60);
				let second = parseInt(this.storeCountTime%60);
				if(minth<10){
					this.countdownTime = "0"+minth+":";
				}
				else{
					this.countdownTime = minth+":";
				}

				if(second<10){
					this.countdownTime = this.countdownTime+"0"+second;
				}
				else{
					this.countdownTime = this.countdownTime+second;
				}
				this.storeCountTime--;
			},1000)
		},
		/**
		 * 提交订单
		 * @return {[type]} [description]
		 */
		submitOrder(){
			// this.CountDown();
			// this.payInfoPopupVisible = true;
			// return;

			if(this.getAllFare().length===0){
				this.popupMessage("请先添加或者选择乘客!");
				return;
			}
			else{
				if(this.getGetTicketMan()){
					this.popupMessage("取票人信息不正确,请设置取票人或检查修改!");
					return;
				}
				else{
					if(this.inspectPhone()){
						this.computeAll();
						Indicator.open({
							text: '加载中...',
							spinnerType: 'double-bounce'
						});
											
						let arrayData = null;
						let arrayId = [];
						for(let i=0;i<this.AllFare.length;i++){
							// if(this.AllFare[i].IsDefault===1){
							// 	//找到取票人
							// 	arrayData = this.AllFare[i];
							// }
							if(this.AllFare[i].active){
								//获取乘客id
								arrayId.push(this.AllFare[i].Id)
							}
						}
						
						//获取优惠信息
						let rebateid = "";
						if(this.isUseCode){
							//如果使用了优惠码
							if(this.rebateid===""){
								rebateid = this.discountCode.Id;
							}
							else{
								rebateid=== this.rebateid+","+this.discountCode.Id;
							}
						}
						else{
							//灭有使用优惠码
							rebateid = this.rebateid;
						}

						this.$store.dispatch("payMoney",{
							// LinkmanId:arrayData.Id,
							LinkmanId:this.payInfoData.contactPhone,
							PassengerIds:arrayId,
							RebateId:rebateid,
							StartAddress:this.selectStation
						}).then(result=>{
							Indicator.close();
							if(result.Code!==200){
								this.popupMessage(result.Message);
							}
							else{
								this.CountDown();
								this.serverPayInfo = result.Data;
								// this.TicketPay = result.Data;
								this.payInfoPopupVisible = true;
							}
						}).catch(error=>{
							Indicator.close();
							this.popupMessage("服务器繁忙,请稍后再试...");
						})
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
			if(/^1[23578][0-9]{9}$/.test(this.payInfoData.contactPhone)){
				// this.setLocalStorePhone(this.payInfoData.contactPhone);
				return true;
			}
			else{
				return false;
			}
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
					let check = /^1[23578][0-9]{9}$/.test(this.certificate);
					if(!check&&this.certificate!==''){
						this.popupMessage("请填写正确的联系手机号!");
						return;
					}
					let json = {
						Name:this.fareName,
						Mobile:this.certificate,
						active:true,
						isGetTicket:false
					}
					Indicator.open({
						text: '加载中...',
						spinnerType: 'double-bounce'
					});
					this.$store.dispatch("addPassenger",json)
						.then((result)=>{
							Indicator.close();
							if(result.Data){
								this.$store.dispatch("getPassenger");
								json.Id= result.Data;
								this.AllFare.push(json);
								// this.setLocalStorePassager(json);//存储本地
								// 清空输入的信息
								this.fareName = "";
								this.certificate = "";

								this.popupMessage("添加成功!");
								this.computeAll();
							}
							else{
								this.popupMessage(result.Message);
							}
						})
				}
			}
			else{
				this.popupMessage("请输入正确的姓名!");
			}
		},
		//获取储存的数据
		getLocalStorePassager(){
			if(window.localStorage.getItem("Passager")!==null){
				//之前有数据
				let oldValue = JSON.parse(window.localStorage.getItem("Passager"));//获取数据
				return oldValue;
			}
			else{
				// 第一次储存
				return [];
			}
		},
		getLocalStorePhone(){
			if(window.localStorage.getItem("Phone")!==null){
				//之前有数据
				this.payInfoData.contactPhone = window.localStorage.getItem("Phone");
			}
			if(window.localStorage.getItem("GetTicketName")!==null){
				this.payInfoData.getTicketManName = window.localStorage.getItem("GetTicketName");
			}
		},
		setLocalStorePhone(phone){
			window.localStorage.setItem("Phone",phone);
		},
		setLocalStorePassager(json){
			let data = this.getLocalStorePassager();

			let newData = [];

			// 检测是否已有相同的数据路线,删除重复的
			for(let i=0;i<data.length;i++){
				if(data[i].name!==json.name){
					newData.push(data[i])
				}
			}
			newData.push(json);//最后才推入这个

			window.localStorage.setItem("Passager",JSON.stringify(newData));
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

			MessageBox.confirm('确定删除'+array[index].Name+'?').then(action => {
				this.$store.dispatch("deletePassenger",array[index].Id)
					.then(result=>{
						if(result.Data){
							this.AllFare.splice(index,1);
							this.$store.dispatch("setPassenger",this.AllFare);
							this.computeAll();
						}
						else{
							this.popupMessage(result.Message);
						}
					})
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
			// if(!this.AllFare[index].active){
			// 	this.popupMessage("请先选中这个乘客才能设置取票人");
			// 	return;
			// }
			for(let i=0;i<this.AllFare.length;i++){
				this.AllFare[i].isGetTicket = false;
			}
			let data = this.AllFare[index];
			data.isGetTicket = true;
			this.$set(this.AllFare,index,data);
			
			// 设置取票人信息
			this.payInfoData.getTicketManName = data.Name;
			this.payInfoData.contactPhone = data.Mobile;
		},
		GetDiscount(){
			// 查看选取优惠券
		},
		outpay(){
			this.payInfoPopupVisible = false;
		},
		showStation(){
			this.stationPopupVisible = true;
		},
		showDiscountWindow(){
			if(this.optionsDiscount.length===0){
				return;
			}
			this.discountPopupVisible = true;
		},
		checkSelectStation(){
			if(this.selectStation!==""){
				this.stationPopupVisible = false;
			}
			else{
				this.popupMessage("你需要选择一个上车点.")
			}
		},
		checkSelectDiscount(){
			this.discountPopupVisible = false;
		},
		checkCodeStatus(){
			let discountcode = this.payInfoData.discountcode;
			if(discountcode===""){
				this.popupMessage("请输入优惠码!");
				this.havediscountcode = false;
				return;
			}
			this.$store.dispatch("checkRebateStatus",discountcode)
				.then(result=>{
					if(result.Data&&result.Data.IsUse===0){
						this.discountCode = result.Data;
						this.havediscountcode = true;
						this.popupMessage("优惠码可用");
					}
					else{
						this.havediscountcode = false;
						this.popupMessage("优惠码不可用或已使用过!");
					}
				})
		},
		useDiscountCode(){
			this.isUseCode = !this.isUseCode;
			this.computeAll();
		}
	}
}
</script>

<style lang="css" scoped>
@import "../css/ticketpay.css";
</style>