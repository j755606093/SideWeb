<template type="x/template" id="ticketpay">
	<div id="pay" class="position">
		<div class="header">	
			<img src="../picture/car_bg.png">
			<div class="header-title">
				<div @click="goback"><img src="../picture/back_icon.png"></div>
				<span v-text="startDate.date+' '+startDate.week"></span>
			</div>
			<div class="header-router">
				<div class="router">
					<div :class="{active:list.NodeType===2||list.NodeType===1,other:list.NodeType===0,last:list.NodeType===2}" v-for="(list,index) in busInfo.Stations">
						<span :class="{gray:list.NodeType===0,active:list.NodeType===2||list.NodeType===1}">{{list.Point.length>3?list.Point.slice(0,3)+'..':list.Point}}</span>
					</div>
				</div>
			</div>
		</div>
		<!-- 车票信息 -->
		<div class="ticket-info">
			<div class="left">
				<span v-text="busInfo.StartTime.slice(0,busInfo.StartTime.length-3)">08:23</span>
				<span v-text="busInfo.CoName">东方快车</span>
				<span>{{busInfo.Route}}</span>
			</div>
			<div class="center">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</div>
			<div class="right">
				<div class="top">
					<div class="name">
						<p>{{busInfo.StartPoint}}</p>
						<p>{{busInfo.EndPoint}}</p>
					</div>
					<div class="info">
						<p @click="openTip">
							<img src="../picture/problem.png" style="width: 16px;height:16px;">
						</p>
						<p v-text="busInfo.TicketNum+'张余票'">123张余票</p>
					</div>
				</div>
				<div class="bottom">
					<img src="../picture/time.png">
					<p>{{startDate.date}}</p>
				</div>
			</div>
		</div>
		<!-- 乘客信息 -->
		<div class="passenger-info">
			<!-- 选择的乘客 -->
			<div class="passenger-selected">
				<div v-if="item.active" class="line" v-for="(item,index) in AllFare">
					<div @click="setFare(index)"><img src="../picture/delete.png"></div>
					<span class="center">{{item.Name}}</span>
					<span class="right">{{item.Mobile}}</span>
				</div>
			</div>
			<!-- 乘客信息 -->
			<div class="write-info">
				<div class="line">
					<span>添加 / 修改乘车人</span>
					<div @click="showPage(1)" class="img"><img src="../picture/add_passenger.png"></div>
				</div>
			</div>
		</div>
		<!-- 手机号 -->
		<div class="write-info">
			<div class="line">
				<input type="text" v-model="payInfoData.contactPhone" name="phone" placeholder="手机号(用于联系)">
				<div class="img"><img src="../picture/phone.png"></div>
			</div>
		</div>
		<!-- 上车点 -->
		<div class="write-info">
			<div class="line">
				<span style="color:rgb(20,20,20)">{{payInfoData.remark?payInfoData.remark:selectStation}}</span>
				<div @click="showPage(2)" class="img"><img src="../picture/green_station.png"></div>
			</div>
		</div>
		<!-- 优惠券 -->
		<div class="write-info">
			<div class="line">
				<span v-if="optionsDiscount.length===0">没有可用优惠券</span>
				<span v-else>{{'优惠券('+canuseOne.length+'张可用)'}}</span>
				<span style="color:#000" v-if="discountMoney!==0" class="info">{{'- ¥'+discountMoney}}</span>
				<span class="info" v-else>未使用</span>
				<div @click="showPage(3)" class="img">
					<img src="../picture/coupon.png"></div>
			</div>
		</div>
		<!-- 备注 -->
		<div class="write-info">
			<div class="line">
				<input type="text" v-model="payInfoData.playRemark" name="playRemark" placeholder="旅程备注">
				<div class="img"><img src="../picture/edit.png"></div>
			</div>
		</div>
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

		<!-- 选择乘客 -->
		<mt-popup
		  v-model="passengerPopupVisible"
		  position="right"
		  class="action-page">
		  <slot>
		  	<div class="action">
		  		<div class="page-header">
		  			<div @click="showPage(1,true)"><img src="../picture/back_icon.png"></div>
		  			<!-- <span class="center">选择乘车人({{AllFare.length}})</span> -->
		  			<span class="center">选择乘车人</span>
		  			<span @click="showPage(1,true)" class="right">确定</span>
		  		</div>
		  		<div class="action-body">
		  			<!-- 点击新增乘客 -->
						<div class="write-info">
							<div class="line">
								<span>添加新乘车人</span>
								<div @click="showAddPassenger" class="img"><img src="../picture/add_passenger.png"></div>
							</div>
						</div>
		  			<!-- 添加乘客 -->
		  			<div v-show="showpassengeraction===1" class="add-action animated zoomIn">
							<div class="line">
								<input type="text" v-model="fareName" name="fareName" placeholder="请填写真实姓名">
							</div>
							<div class="line">
								<input type="text" v-model="certificate" name="certificate" placeholder="选填(可用于联系)">
								<button @click="append"><i class="fa fa-plus-circle"></i> 添加</button>
							</div>
						</div>
						<!-- 修改乘客 -->
		  			<div v-show="showpassengeraction===2" class="add-action animated zoomIn">
							<div class="line">
								<input type="text" v-model="fareName" name="fareName" placeholder="请填写真实姓名">
							</div>
							<div class="line">
								<input type="text" v-model="certificate" name="certificate" placeholder="选填(可用于联系)">
								<button @click="append"><i class="fa fa-plus-circle"></i> 修改</button>
							</div>
						</div>
		  		</div>
		  		<p class="refresh">有新乘客没有出现?点击刷新一下啦 <i class="fa fa-refresh"></i></p>
		  		<div class="action-select">
		  			<div class="line" v-for="(item,index) in AllFare">
		  				<div @click="setFare(index)" class="left"><img v-if="item.active" src="../picture/select.png"></div>
		  				<div class="center">
		  					<p>{{item.Name}}</p>
		  					<p>{{item.Mobile}}</p>
		  				</div>
		  				<div @click="showChaPassenger(index)" class="right"><img src="../picture/edit.png"></div>
		  			</div>
		  		</div>
		  	</div>
		  </slot>
		</mt-popup>
		<!-- 选择乘车点 -->
		<mt-popup
		  v-model="stationPopupVisible"
		  position="right"
		  class="action-page">
		  <slot>
		  	<div class="action">
		  		<div class="page-header">
		  			<div @click="showPage(2,true)"><img src="../picture/back_icon.png"></div>
		  			<span class="center">选择上车地点</span>
		  			<span @click="showPage(2,true)" class="right">确定</span>
		  		</div>
		  		<div class="action-body">
		  			<!-- 备注上车点 -->
						<div class="write-info">
							<div class="line">
								<input type="text" v-model="payInfoData.remark" name="remark" placeholder="备注更方便您的上车点">
								<div class="img"><img src="../picture/edit.png"></div>
							</div>
						</div>
		  		</div>
		  		<p class="refresh">地址没有出现?点击刷新一下啦 <i class="fa fa-refresh"></i></p>
		  		<div class="action-select">
		  			<div class="line" v-for="(item,index) in options">
		  				<div @click="setUpCar(index)" class="left"><img v-if="item===selectStation" src="../picture/select.png"></div>
		  				<div class="center">
		  					<p>{{item}}</p>
		  					<p style="color:#c8c8c8" v-if="item===selectStation">{{payInfoData.remark?payInfoData.remark:'系统默认备注'}}</p>
		  				</div>
		  			</div>
		  		</div>
		  	</div>
		  </slot>
		</mt-popup>
		<!-- 优惠券选择 -->
		<mt-popup
		  v-model="discountPopupVisible"
		  position="right"
		  class="action-page">
		  <slot>
		  	<div class="action">
		  		<div class="page-header">
		  			<div @click="showPage(3,true)"><img src="../picture/back_icon.png"></div>
		  			<span class="center">我的优惠券</span>
		  			<span @click="showPage(3,true)" class="right">确定</span>
		  		</div>
		  		<div class="action-use">
		  			<!-- 头部切换 -->
						<div class="popup-header">
					  	<span :class="{active:canuseIndex===1}" @click="SetCanUse(1)">可用</span>
					  	<span :class="{active:canuseIndex===2}" @click="SetCanUse(2)">不可用</span>
					  </div>
					  <!-- 内容 -->
						<div v-show="canuseIndex===1" class="page animated fadeIn">
							<!-- 可用优惠券 -->
							<div :class="{rebate:true,disabled:item.disabled,active:selectDiscount.indexOf(item.value)>-1}" v-for="(item,index) in canuseOne">
								<div class="left">
									<div class="circle">
										<span></span>
										<span></span>
										<span></span>
										<span></span>
										<span></span>
										<span></span>
										<span></span>
										<span></span>
										<span></span>
									</div>
									<div class="title">
										<p><span>¥</span>{{item.Money}}</p>
										<span>{{'满'+item.LimitMoney+'可用'}}</span>
									</div>
								</div>
								<div class="right">
									<div class="info">
										<span>{{item.Name}}</span>
										<span>{{item.StartDate}} 至 {{item.EndDate}}</span>
									</div>
									<div @click="selectRebeat(index)" class="check">
										<img src="../picture/select.png">
										<span></span>
									</div>
								</div>
							</div>
						</div>
						<div v-show="canuseIndex===2" class="page animated fadeIn">
							<!-- 不可用优惠券 -->
							<div :class="{rebate:true,disabled:item.disabled,active:selectDiscount.indexOf(item.value)>-1}" v-for="(item,index) in canuseTwo">
								<div class="left">
									<div class="circle">
										<span></span>
										<span></span>
										<span></span>
										<span></span>
										<span></span>
										<span></span>
										<span></span>
										<span></span>
										<span></span>
									</div>
									<div class="title">
										<p><span>¥</span>{{item.Money}}</p>
										<span>{{'满'+item.LimitMoney+'可用'}}</span>
									</div>
								</div>
								<div class="right">
									<div class="info">
										<span>{{item.Name}}</span>
										<span>{{item.StartDate}} 至 {{item.EndDate}}</span>
									</div>
									<div class="check">
										<img src="../picture/select.png">
										<span></span>
									</div>
								</div>
							</div>
						</div>
		  		</div>
		  	</div>
		  </slot>
		</mt-popup>
		<!-- 下单支付 -->
		<mt-popup
		  v-model="payInfoPopupVisible"
		  position="right"
		  class="action-page">
		  <slot>
		  	<div class="action">
		  		<div style="background-color: #f35252" class="page-header">
		  			<div @click="goback"><img src="../picture/back_icon.png"></div>
		  			<span style="font-size:16px;" class="center">预订成功,请在半小时内支付订单 {{countdownTime}}</span>
		  		</div>
		  		<div class="action-body">
		  			<!-- 票信息 -->
		  			<div class="ticket-info">
							<div class="left">
								<span v-text="busInfo.StartTime.slice(0,busInfo.StartTime.length-3)">08:23</span>
								<span v-text="busInfo.CoName">东方快车</span>
								<span>{{busInfo.Route}}</span>
							</div>
							<div class="center">
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
								<span></span>
							</div>
							<div class="right">
								<div class="top">
									<div class="name">
										<p>{{busInfo.StartPoint}}</p>
										<p>{{busInfo.EndPoint}}</p>
									</div>
									<div class="info"></div>
								</div>
								<div class="bottom">
									<img src="../picture/time.png">
									<p>{{startDate.date+" "+startDate.week}}</p>
								</div>
							</div>
						</div>
						<!-- 乘客信息 -->
						<div class="passenger-info">
							<div class="passenger-selected">
								<div v-if="item.active" class="line" v-for="(item,index) in AllFare">
									<span style="margin-left:10px;" class="center">{{item.Name}}</span>
									<span style="margin-right:10px;" class="right">{{item.Mobile}}</span>
								</div>
							</div>
						</div>
						<!-- 手机号 -->
						<div class="write-info">
							<div class="line">
								<span style="color:rgb(20,20,20)">{{payInfoData.contactPhone+' (取票人号码)'}}</span>
								<div class="img"><img src="../picture/phone.png"></div>
							</div>
						</div>
						<!-- 上车点备注 -->
						<div class="write-info">
							<div class="line">
								<span style="color:rgb(20,20,20)">{{payInfoData.remark?payInfoData.remark:selectStation}}</span>
								<div class="img"><img src="../picture/green_station.png"></div>
							</div>
						</div>
						<!-- 旅行备注 -->
						<div class="write-info">
							<div class="line">
								<span style="color:rgb(20,20,20)">{{payInfoData.playRemark?payInfoData.playRemark:'用户未备注'}}</span>
								<div class="img"><img src="../picture/edit.png"></div>
							</div>
						</div>
						<!-- 订单信息 -->
						<div class="pay-ticket-info">
							<p>订单信息</p>
							<p>订单编号:{{serverPayInfo.OrderInfo.Id}}</p>
							<p>下单日期:{{serverPayInfo.OrderInfo.OrderTime}}</p>
						</div>
						<!-- 立即支付 -->
						<div class="pay">
							<div class="left">
								<p>订单总价<span v-text="'¥'+serverPayInfo.OrderInfo.TotalPrice"></span></p>
							</div>
							<div class="right">
								<span @click="cancelOrder">取消订单</span>
								<button @click="payMoney">立即支付</button>
							</div>
						</div>
		  		</div>
		  	</div>
		  </slot>
		</mt-popup>
	</div>
</template>

<script type="text/babel">
// import { mapGetters } from 'vuex'
import Utils from "../Utils/utils";
const _ = require("underscore");
import { Indicator,Toast ,MessageBox} from 'mint-ui';

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
				remark:"",//上车点备注
				playRemark:"",//旅行备注
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

			passengerPopupVisible:false,//选择乘客
			showpassengeraction:0,//1显示添加乘客信息,2显示修改乘客

			canuseIndex:1,//默认是显示可用优惠券
			canuseOne:[],//可使用的优惠券列表
			canuseTwo:[],//不可使用的优惠券列表
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
		this.$store.commit("SET_SHOWHEADER",false);

		if(!this.$store.getters.getIsFirst){
			this.busInfo = this.$store.getters.getBusInfo;
			this.payInfoData.ticketMoney = this.$store.getters.getBusInfo.Price;

			// let startDate = this.$store.getters.getInfo.startDate;
			// this.$store.commit("CHANGE_HEADER",{
			// 	isHome:false,
			// 	Title:this.startDate.date+" "+this.startDate.week
			// });
		}

		//设置乘车点
		this.selectStation = this.busInfo.StartAddress?this.busInfo.StartAddress[0]:"";
		this.options = this.busInfo.StartAddress?this.busInfo.StartAddress:[];

		//设置优惠券
		if(this.$store.getters.getRebate){
			let rebate = this.$store.getters.getRebate;
			_.map(rebate,item=>{
				let data = Object.assign({},item);
				data.value = item.Id;
				data.disabled = false;
				data.StartDate = this.formatNow(data.StartDate);
				data.EndDate = this.formatNow(data.EndDate);
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
		// startDate(){
		// 	return this.$store.getters.getInfo.startDate.date+this.$store.getters.getInfo.startDate.week;
		// },
		startDate(){
			let date = new Date(this.$store.getters.getInfo.startDate.server);
			let year = date.getYear()-100+2000;
			let month = date.getMonth()+1;
			let day = date.getDate();

			// return month+"月"+day+"日";
			return {
				date:year+"年 "+(month>9?month:"0"+month)+"月 "+(day>9?day:"0"+day)+"号 ",
				week:this.$store.getters.getInfo.startDate.week
			};
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
		/** 观察选择的优惠券 */
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
			//如果最后一个是单选就只能选择最后点击的那个
			if(lastOption&&lastOption.IsSingle===1){
				this.rebateid = lastOption.Id;//只留自己
				this.selectDiscount = [lastOption.Id];
			}
			else{
				this.rebateid = this.rebateid+","+lastOption.Id;
			}
			
			//筛选已选择里所有的IsSingle=1的选项
			//这一步是防止上一步漏掉之前的单选选项
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
		goback(){
			this.$router.go(-1);
		},
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

					if(!paydata){
						this.popupMessage(data.Message);
						return;
					}

					// paydata.success = function(res){
					// 	Toast({
					// 	  message: '支付成功!',
					// 	  iconClass: 'fa fa-check',
					// 	  duration:3000,
					// 	  className:"success"
					// 	});
					// }
					window.WeixinJSBridge.invoke("getBrandWCPayRequest",paydata,(r)=>{
						if(r.err_msg==="get_brand_wcpay_request:ok"){
							Indicator.open({
								text: '支付成功,准备跳转至订单页!',
								spinnerType: 'double-bounce'
							});
							// Toast({
							//   message: '支付成功,准备跳转至订单页!',
							//   iconClass: 'fa fa-check',
							//   duration:1000,
							//   className:"success"
							// });
							setTimeout(()=>{
								window.location.href="./TicketOrder.html?orderid="+id
							},2000);
						}
						else{
							Toast({
							  message: '未支付成功',
							  iconClass: 'fa fa-close',
							  duration:1000,
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
		formatNow(date){
			let show = new Date(date);

			let year = show.getYear()-100+2000;
			let month = show.getMonth()+1;
			let day = show.getDate();

			// return month+"月"+day+"日";
			return year+"-"+(month>9?month:"0"+month)+"-"+(day>9?day:"0"+day)
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
							StartAddress:this.selectStation,
							Remark:this.payInfoData.remark,
							JourneyRmk:this.payInfoData.playRemark
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
				// 选中的已经超过
				this.popupMessage("乘客数已经超过余票数!");
			}
			else{
				this.AllFare[index].active = !this.AllFare[index].active;
				if(this.selectDiscount.length!==0){
					this.popupMessage("请重新选择优惠券!");
					this.selectDiscount=[];
				}
				
				this.ClassifyRebeat();//重新分类优惠券
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
							this.$store.dispatch("setPassenger",this.formatData(this.AllFare));
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
			let money = this.payInfoData.payMoney;//总额
			//这里禁用所有不可用的优惠券,防止用户选择
			for(let i=0;i<this.optionsDiscount.length;i++){
				let data = this.optionsDiscount[i];
				if(money<data.LimitMoney){
					// 不能选择这个优惠券
					this.$set(this.optionsDiscount,i,Object.assign({},this.optionsDiscount[i],{disabled:true}));
				}
				else{
					this.$set(this.optionsDiscount,i,Object.assign({},this.optionsDiscount[i],{disabled:false}));
				}
			}
			// console.log(this.formatData(this.optionsDiscount))
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
		},
		cancelOrder(){
			MessageBox.confirm('确定取消订单?').then(action => {
				this.$store.dispatch("cancelOrder",this.serverPayInfo.OrderInfo.Id).then(result=>{
				this.popupMessage("取消订单成功!");
					setTimeout(()=>{
						this.$router.go(-1);
					},1000);
				})
			});
		},
		showPage(index,close=false){
			switch(index){
				case 1:
					// 选择乘客
					this.ClassifyRebeat();
					this.passengerPopupVisible = close?false:true;
					break;
				case 2:
					// 乘车点
					this.stationPopupVisible = close?false:true;
					break;
				case 3:
					// 优惠券
					this.ClassifyRebeat();
					this.discountPopupVisible = close?false:true;
					break;
				case 4:
					//下单支付
					this.payInfoPopupVisible = close?false:true;
					break;
			}
		},
		/** 点击显示隐藏添加乘客 */
		showAddPassenger(){
			this.fareName = "";
			this.certificate = "";
			this.showpassengeraction = this.showpassengeraction===1?0:1;
		},
		/** 点击显示隐藏修改乘客 */
		showChaPassenger(index){
			this.showpassengeraction = 2;

			this.fareName = this.AllFare[index].Name;
			this.certificate = this.AllFare[index].Mobile;
		},
		/** 设置上车点 */
		setUpCar(index){
			this.selectStation = this.options[index];
			// if(this.payInfoData.remark===""){
			// 	this.payInfoData.remark = "系统默认备注";
			// }
		},
		/** 设置优惠券列表页 */
		SetCanUse(index){
			this.canuseIndex = index;
		},
		/** 分类优惠券列表显示 */
		ClassifyRebeat(){
			let all = this.optionsDiscount;//所有的优惠券
			this.canuseOne=[];
			this.canuseTwo=[];
			_.map(all,item=>{
				if(this.payInfoData.payMoney>=item.LimitMoney){
					this.canuseOne.push(item);
				}
				else{
					this.canuseTwo.push(item);
				}
			})
		},
		/** 选择优惠券 */
		selectRebeat(index){
			let Id = this.canuseOne[index].Id;
			let IsSingle = this.canuseOne[index].IsSingle;

			if(this.selectDiscount.indexOf(Id)>-1){
				let newdata = _.filter(this.selectDiscount,(item)=>{
					if(item===Id){
						return false;
					}
					return true;
				})
				this.selectDiscount = newdata;
			}
			else{
				this.selectDiscount.push(Id);
			}

			_.map(this.optionsDiscount,(item)=>{
				if(IsSingle !== item.IsSingle){
					item.disabled = true;
				}
				else{
					item.disabled = false;
				}
			})
		}
	}
}
</script>

<style lang="css">
@import "../css/ticketpay.css";
</style>