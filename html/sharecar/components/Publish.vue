<template type="x/template">
	<div id="publishtrip" class="publishtrip">
		<my-header :showBack="true" headerTitle="发布旅程"></my-header>
		<div class="swtich-role">
			<span @click="switchRole(0)" :class="{active:Role===0}">我是乘客</span>
			<span @click="switchRole(1)" :class="{active:Role===1}">我是司机</span>
		</div>
		<div class="publish animated slideInUp">
			<div class="publish__info">
				<div  class="publish__info--line">
					<div class="line__left--dot"></div>
					<input @click="searchStartKeyup" v-model="searchStartText" @keyup="searchStartKeyup" type="text" placeholder="请输入出发地" name="search">
					<div v-show="showStartSearchResult" class="line-action">
						<div @click="deleteAddress(0)" class="img">
							<img src="../icon/select_icon.png">
						</div>
						<span @click="cancelAddress(0)">取消</span>
					</div>
				</div>
				<div class="publish__info--line">
					<div class="line__left--dot dot-red"></div>
					<input @click="searchEndKeyup" v-model="searchEndText" @keyup="searchEndKeyup" type="text" placeholder="请输入到达地" name="search">
					<div v-show="showEndSearchResult" class="line-action">
						<div @click="deleteAddress(1)" class="img">
							<img src="../icon/select_icon.png">
						</div>
						<span @click="cancelAddress(1)">取消</span>
					</div>
				</div>
				<div @click="actionDatePicker(true)" class="publish__info--line">
					<div class="line__left">
						<img src="../icon/clock_icon.png">
					</div>
					<template v-if="datePickerText.length===4">
						<span class="line__span--gray">{{datePickerText}}</span>
					</template>
					<template v-else>
						<span>{{datePickerText}}</span>
					</template>
				</div>
				<div @click="actionNumberPicker(true)" class="publish__info--line">
					<div class="line__left">
						<img src="../icon/me_grey_icon.png">
					</div>
					<template v-if="Role===0">
						<template v-if="numberPickerText==='默认1人'">
							<span class="line__span--gray">默认1人</span>
						</template>
						<template v-else>
							<span>{{numberPickerText}}</span>
						</template>
					</template>
					<template v-else>
						<template v-if="numberPickerText==='默认1人'">
							<span class="line__span--gray">默认1人座位</span>
						</template>
						<template v-else>
							<span>{{numberPickerText}}座位</span>
						</template>
					</template>
				</div>
			</div>
			<div class="publish__info--line box_shadow">
				<div class="line__left">
					<img src="../icon/phone_icon.png">
				</div>
				<input v-model="submitResult.phone" maxlength="11" class="phone" placeholder="联系电话必填" type="tel" name="phone">
			</div>
			<div style="margin-top:10px;" class="publish__info--line box_shadow">
				<div class="line__span">
					<span>备注:</span>
				</div>
				<input v-model="submitResult.remark" class="remark" placeholder="" type="text" name="remark">
			</div>
			<!-- 提交按钮 -->
			<div v-show="showSubmitBtn" class="publish__btn">
				<button @click="submitOrder">确定发布</button>
			</div>
			<!-- 开始地址结果列表 -->
			<div id="startSearchList" v-show="showStartSearchResult" class="search__result">
				<div @click="startAddress(index)" class="search__result--line" v-for="(item,index) in searchStartList">
					<div class="img">
						<img src="../icon/place_icon.png">
					</div>
					<div class="location-name">
						<div class="line">
							<span>{{item.name}}</span>
						</div>
						<div class="line">
							<span class="gray">{{item.district}}</span>
						</div>
					</div>
				</div>
				<div style="float:left;" id="startSearchList_last"></div>
			</div>
			<!-- 到达地址结果列表 -->
			<div id="endSearchList" style="top:115px;" v-show="showEndSearchResult" class="search__result">
				<div @click="endAdress(index)" class="search__result--line" v-for="(item,index) in searchEndList">
					<div class="img">
						<img src="../icon/place_icon.png">
					</div>
					<div class="location-name">
						<div class="line">
							<span>{{item.name}}</span>
						</div>
						<div class="line">
							<span class="gray">{{item.district}}</span>
						</div>
					</div>
				</div>
				<div style="float:left;" id="endSearchList_last"></div>
			</div>
		</div>
		<!-- 选择出发日期 -->
		<mt-popup
		  v-model="datePickerPageShow"
		  position="bottom"
		  class="mt_page">
		  <slot>
				<div class="popup-header">
 			  	<span @click="actionDatePicker(false)">取消</span>
 			  	<span>出发日期</span>
	  			<span style="color:#0074D9" @click="nextStep">下一步</span>
 			  </div>

		  	<mt-picker :visibleItemCount="7" value-key="title" :slots="datePicker" @change="dateValuesChange"></mt-picker>
		  </slot>
		</mt-popup>
		<!-- 选择人数 -->
		<mt-popup
		  v-model="numberPickerPageShow"
		  position="bottom"
		  class="mt_page">
		  <slot>
				<div class="popup-header">
 			  	<span @click="actionNumberPicker(false)">上一步</span>
 			  	<span>人数</span>
	  			<span style="color:#0074D9" @click="actionNumberPicker(false)">确定</span>
 			  </div>

		  	<mt-picker :visibleItemCount="7" :slots="numberPicker" @change="numberValuesChange"></mt-picker>
		  </slot>
		</mt-popup>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
@import "./some.scss";
.publishtrip{
	margin-top:50px;
	.swtich-role{
		width:100%;
		@include display_flex('row');
		height:45px;
		line-height:45px;
		background-color:#fff;
		text-align: center;
		box-shadow: 0 3px 3px 3px #f5f5f5;
		>span{
			flex:1;
			width:50%;
			height:45px;
			line-height:45px;
			color:rgb(200,200,200);
			position:relative;
			font-size:14px;
			font-weight: 900;
		}
		>span.active{
			color:rgb(50,50,50);
			&:after{
				content:"";
				position:absolute;
				bottom:5px;
				left:44%;
				width:20px;
				background-color:$blue;
				height:4px;
			}
		}
	}
}
.publish{
	width:100%;
	padding:10px;
	position:relative;
	.publish__info{
		width:100%;
		height:190px;
		background-color: #fff;
		padding:10px 0;
		border-radius:5px;
		margin-bottom: 10px;
		box-shadow: 0 3px 3px 3px #f5f5f5;
	}
	.publish__info--line{
		height:45px;
		line-height: 45px;
		border-radius:5px;
		// @include display_flex('row');
		
		justify-content:flex-start;
		background-color:#fff;
		width:100%;
		position:relative;
		>div{
			float:left;
		}
		div.line__left{
			width:65px;
			height:45px;
			text-align:center;
			// @include display_flex('row');
			>img{
				width:10px;
				height:10px;
			}
		}
		div.line__span{
			width:65px;
			height:45px;
			text-align:right;
			// @include display_flex('row');
			span{
				height:45px;
				line-height:45px;
				font-size:14px;
				color:rgb(50,50,50);
				margin-right:5px;
			}
		}
		div.line-action{
			position:absolute;
			top:0;
			right:5px;
			height:45px;
			line-height:45px;
			width:60px;
			background-color:#fff;
			>div.img{
				height:45px;
				// line-height:45px;
				display:inline-block;
				width:50%;
				float:left;
				text-align:center;
				>img{
					width:15px;
					height:15px;
					margin-top:15px;
				}
			}
			>span{
				color:#c8c8c8;
				height:45px;
				float:left;
				width:50%;
				line-height:45px;
				display:inline-block;
			}
		}
		span{
			font-size: 14px;
		}
		span.line__span--gray{
			color:#c8c8c8;
		}
		input{
			display:inline-block;
			// text-align:center;
			border:none;
			outline:none;
			height:45px;
			font-size:14px;
			// line-height:40px;
			width:75%;
			float:left;
		}
		div.line__left--dot{
			width:65px;
			height:45px;
			position: relative;
			&:after{
				content:"";
				position:absolute;
				width:10px;
				height:10px;
				border-radius: 50%;
				background-color:$my_green;
				top:18px;
				left:28px;
			}
		}
		div.dot-red{
			&:after{
				background-color:$my_red;
			}
		}
	}
	/** 发布按钮 */
	.publish__btn{
		width:100%;
		padding:0 5px;
		height:45px;
		line-height:45px;
		text-align:center;
		margin-top:45px;
		>button{
			border:none;
			outline:none;
			border-radius:5px;
			width:100%;
			background-color:#515151;
			height:45px;
			font-size:16px;
			color:#fff;
		}
	}
	/** 搜索结果列表 */
	.search__result{
		position:absolute;
		top:65px;
		left:10px;
		right:10px;
		height:400px;
		z-index:100;
		background-color: #fff;
		border-top:1px solid #fafafa;
		overflow-y:scroll;
		.search__result--line{
			float:left;
			width:100%;
			height:60px;
			position:relative;
			>div.img{
				position:absolute;
				height:60px;
				width:65px;
				line-height: 60px;
				top:0;
				left:0;
				text-align:center;
				>img{
					height:10px;
					width:10px;
					// margin-top: 35px;
				}
			}
			.location-name{
				// padding:5px 0;
				padding-left: 65px;
				width:100%;
				float:left;
				height:60px;
				.line{
					height:30px;
					line-height:30px;
					width:100%;
					@include text_nowrap;
				}
				span{
					font-size:15px;
				}
				span.gray{
					color:#c8c8c8;
				}
			}
		}
	}
}
.mt_page{
	width: 100%;
  height: 55%;
  background-color: #fff;
  overflow-y: scroll;
  .popup-header {
    height: 50px;
    width: 100%;
    line-height: 50px;
    background-color: #fff;
    color: $white;
    text-align: center;
    position: relative;
    span {
      display: inline-block;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      width: 60px;
      color:#000;
    }
    span:last-child {
      position: absolute;
      top: 0;
      right: 0;
      color:#c8c8c8;
      font-size: 12px;
    }
    span:first-child {
      position: absolute;
      top: 0;
      left: 0;
      color:#c8c8c8;
      font-size: 12px;
    }
  }
}
.animated{
	animation-duration: 0.4s;
}
.picker-slot{
	font-size:14px;
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import List from "./list.vue";
import Header from "./Header.vue";
import { Toast, Indicator, Popup,Picker } from 'mint-ui';
const _ = require("underscore");

export default {
	data () {
		return {
			Role:0,//0是乘客,1是司机
			
			datePickerPageShow:false,//显示选择日期
			datePicker:[{
    		flex: 1,
    		values: [],
    		className: 'slot1',
    		textAlign: 'center'
       }, {
    		flex: 1,
    		values: [],
    		className: 'slot2',
    		textAlign: 'center'
       }, {
    		flex: 1,
    		values: ["0 分","30 分"],
    		className: 'slot3',
    		textAlign: 'center'
      }],
      datePickerText:"",//出发日期字符串
			
			numberPickerPageShow:false,//显示选择人数
			numberPicker:[{
    		flex: 1,
    		values: ["1人","2人","3人","4人","5人","6人"],
    		className: 'slot1',
    		textAlign: 'center'
      }],
      numberPickerText:"默认1人",//人数
			
			searchStartText:"",//搜索的地址
			searchEndText:"",
			searchStartList:[],//开始搜索结果
			searchStartIndex:1,//页数
			searchStartNoData:false,//没有数据

			searchEndList:[],//到达搜索结果
			searchEndIndex:1,//页数
			searchEndNoData:false,//没有数据

			showEndSearchResult:false,//是否显示搜索结果
			showStartSearchResult:false,//

			searchStartFunction:null,//搜索处理函数
			searchEndFunction:null,//搜索处理函数

			/** 提交结果 */
			submitResult:{
				start:null,
				end:null,
				time:null,
				number:null,
				phone:null,
				remark:""
			}
		}
	},
	created(){
		this.datePickerText = "今天"+Utils.formatWeek(new Date());// 显示今天几号

		this.initDatePickerDay();//初始化日期
		this.initDatePickerTime();//初始化时间

		/** 定义按键函数使用 */
		this.searchStartFunction = _.debounce(()=>{
			this.$store.dispatch("getStartSearch",{
				text:this.searchStartText,
				page:1
			}).then(result=>{
				this.searchStartIndex = 2;
				this.searchStartList = result.tips;
			});
		},500);
		
		/** 定义按键函数使用 */
		this.searchEndFunction = _.debounce(()=>{
			this.$store.dispatch("getEndSearch",{
				text:this.searchEndText,
				page:1
			}).then(result=>{
				this.searchEndIndex = 2;
				this.searchEndList = result.tips;
			})
		},500);
	},
	mounted(){
		// 监听开始地址滚动
		// document.getElementById("startSearchList").addEventListener('scroll', _.throttle(()=> {
		// 	if(!this.showStartSearchResult||this.searchStartNoData)return;//列表不显示或者没有更多数据时候不执行

		// 	let last = document.getElementById("startSearchList_last").offsetTop - document.getElementById("startSearchList").scrollTop;

		// 	if (last < 400) {
		// 		this.$store.dispatch("getStartSearch",{
		// 			text:this.searchStartText,
		// 			page:this.searchStartIndex
		// 		}).then(result=>{
		// 			this.searchStartIndex++;
		// 			if(result.tips.lenght<10){
		// 				this.searchStartNoData = true;//没有更多数据
		// 			}
		// 			this.searchStartList = this.searchStartList.concat(result.tips);
		// 		})
		// 	}
		// }, 400, { leading: false }));

		// 监听到达地址滚动
		// document.getElementById("endSearchList").addEventListener('scroll', _.throttle(()=> {
		// 	if(!this.showEndSearchResult||this.searchEndNoData)return;//列表不显示或者没有更多数据时候不执行

		// 	let last = document.getElementById("endSearchList_last").offsetTop - document.getElementById("endSearchList").scrollTop;

		// 	if (last < 400) {
		// 		this.$store.dispatch("getEndSearch",{
		// 			text:this.searchEndText,
		// 			page:this.searchEndIndex
		// 		}).then(result=>{
		// 			this.searchEndIndex++;
		// 			if(result.tips.lenght<10){
		// 				this.searchEndNoData = true;//没有更多数据
		// 			}
		// 			this.searchEndList = this.searchEndList.concat(result.tips);
		// 		})
		// 	}
		// }, 400, { leading: false }));
	},
	computed:{
		/** 显示提交按钮 */
		showSubmitBtn(){
			return this.submitResult.start&&this.submitResult.end&&this.submitResult.number&&this.submitResult.phone&&this.submitResult.time;
		}
	},
	methods:{
		formatJSON(data){
			return JSON.parse(JSON.stringify(data));
		},
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
		/** 切换页面选择角色 */
		switchRole(index){
			this.Role = index;
		},
		/** 初始化选择的时间 */
		initDatePickerDay(){
			// 设置可选择的出发时间(一共七天)
			for(let i=0;i<30;i++){
				let date = new Date(Date.now()+i*24*60*60*1000);
				let json = {};
				switch(i){
					case 0:
						json.title = "今天";
						break;
					case 1:
						json.title = "明天";
						break;
					case 2:
						json.title = "后天";
						break;
					case 3:
						json.title = "大后天";
						break;
					default:
						json.title = `${date.getMonth()+1}月${date.getDate()}号`;
				}
				json.value = date;
				json.value.setSeconds(0);
				this.datePicker[0].values.push(json);
			}
		},
		/** 初始化选择的时间 */
		initDatePickerTime(){
			let date = new Date();
			let hour = date.getHours();//获取现在的小时

			for(let i=hour;i<24;i++){
				this.datePicker[1].values.push(`${i} 点`);
			}
		},
		/** 选择开始地点 */
		startAddress(index){
			this.searchStartText = this.searchStartList[index].district+this.searchStartList[index].name;
			this.submitResult.start = this.searchStartList[index];//保存结果
			this.searchBlur();
		},
		/** 删除值 */
		deleteAddress(index){
			if(index===0){
				this.searchStartText = "";
			}
			else{
				this.searchEndText = "";
			}
		},
		/** 取消结果页显示 */
		cancelAddress(){
			this.searchBlur();
		},
		/** 选择到达地点 */
		endAdress(index){
			this.searchEndText = this.searchEndList[index].district+this.searchEndList[index].name;
			this.submitResult.end = this.searchEndList[index];//保存结果
			this.searchBlur();
		},
		searchStartKeyup(){
			this.showStartSearchResult = true;//显示搜索结果
			this.showEndSearchResult = false;//隐藏另一个
			if(this.searchStartText==="")return;
			this.searchStartFunction();
		},
		/** 输入框blur */
		searchBlur(){
			this.showStartSearchResult = false;//隐藏搜索结果
			this.showEndSearchResult = false;//隐藏
		},
		searchEndKeyup(){
			this.showEndSearchResult = true;//显示搜索结果
			this.showStartSearchResult = false;//隐藏另一个
			if(this.searchEndText==="")return;
			this.searchEndFunction();
		},
		/** 隐藏显示日期选择 */
		actionDatePicker(action){
			this.datePickerPageShow = action;
		},
		/** 隐藏显示选择人数 */
		actionNumberPicker(action){
			this.numberPickerPageShow = action;
		},
		/** 下一步 */
		nextStep(){
			this.actionDatePicker(false);
			this.actionNumberPicker(true);
		},
		/** 时间改变出发的函数 */
		dateValuesChange(picker,values){
			let date = new Date();

			// 显示的时候才允许设置值
			if(this.datePickerPageShow){
				let time = this.getDateValues(values[1],values[2]);
				this.submitResult.time = values[0].value;
				this.submitResult.time.setHours(time.hour);//设置小时
				this.submitResult.time.setMinutes(time.minute);//设置分钟
				
				this.datePickerText = values[0].title+" "+values[1]+values[2];
				// console.log(this.submitResult.time);
			}
		},
		/** 格式化字符串提取时间 */
		getDateValues(h,m){
			let hour = "",
					minute = "";
			if(h.length===3){
				// '0 点'这类
				hour = h.slice(0,1);
			}
			else{
				// '11 点'这类
				hour = h.slice(0,2);
			}
			if(m.length===3){
				minute = m.slice(0,1);
			}
			else{
				minute = m.slice(0,2);
			}
			return {
				hour:hour,
				minute:minute
			}
		},
		/** 选择人数改变触发的函数 */
		numberValuesChange(picker,values){
			if(this.numberPickerPageShow){
				// 显示的时候才允许设置值
				this.numberPickerText = values[0];
				this.submitResult.number = parseInt(values[0].slice(0.1));
			}
		},
		/** 检查手机号 */
		inspectPhone(){
			return /^1[23578][0-9]{9}/.test(this.submitResult.phone)
		},
		submitOrder(){
			if(!this.inspectPhone()){
				this.toast("手机号不正确!");
				return;
			}
			
			// 获取开始和到达地理位置
			let startLocation = this.submitResult.start.location.split(",");
			let endLocation = this.submitResult.end.location.split(",");

			//组装数据
			let json = {
				Phone:this.submitResult.phone,
				Seat:this.submitResult.number,
				SPoint:this.searchStartText,
				EPoint:this.searchEndText,
				STime:this.submitResult.time,
				Remark:this.submitResult.remark,
				SpointLocation:{
					X:startLocation[0],
					Y:startLocation[1]
				},
				Spointid:this.submitResult.start.id,
				EpointLocation:{
					X:endLocation[0],
					Y:endLocation[1]
				},
				EpointId:this.submitResult.end.id,
			}

			/** 发送数据 */
			if(this.Role===0){
				this.$store.dispatch("publishPassengerTrip",json).then(result=>{
					if(result.Code===200){
						this.toast("发布成功");
						this.$router.replace({ name: 'tripdetail', params: { types: 1,tripId:result.Data }});
					}
					else{
						this.toast(result.Message);
					}
				})
			}
			else{
				this.$store.dispatch("publishCarTrip",json).then(result=>{
					if(result.Code===200){
						this.toast("发布成功");
						this.$router.replace({ name: 'tripdetail', params: { types: 0,tripId:result.Data }});
					}
					else{
						this.toast(result.Message);
					}
				})
			}
		}
	},
	filters:{
		formatTime(time){
			const formatDate = new Date(time);//转换为DATE对象
			const Today = new Date();

			let text = ""

			if(Today.getDate()===formatDate.getDate()&&formatDate.getMonth()===Today.getMonth()){
				// 说明是今天
				text = "今天";
			}
			else{
				text = `${formatDate.getMonth()+1}月${formatDate.getDate()}号`;
			}

			text = `${text} (${Utils.formatWeek(formatDate)})`;
			text = `${text} ${formatDate.getHours()}:${formatDate.getMinutes()>9?formatDate.getMinutes():"0"+formatDate.getMinutes()}`;
			return text;
		}
	},
	components:{
		"my-header":Header,
		"mt-picker":Picker,
		"mt-popup":Popup
	}
}
</script>