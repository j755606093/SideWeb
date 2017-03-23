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
					<span class="line__span--gray">{{datePickerText}}</span>
				</div>
				<div @click="actionNumberPicker(true)" class="publish__info--line">
					<div class="line__left">
						<img src="../icon/me_grey_icon.png">
					</div>
					<template v-if="Role===0">
						<span class="line__span--gray">默认1人</span>
					</template>
					<template v-else>
						<span class="line__span--gray">默认1座位</span>
					</template>
				</div>
			</div>
			<div class="publish__info--line box_shadow">
				<div class="line__left">
					<img src="../icon/phone_icon.png">
				</div>
				<input maxlength="11" class="phone" placeholder="联系电话必填" type="tel" name="phone">
			</div>
			<div style="margin-top:10px;" class="publish__info--line box_shadow">
				<div class="line__span">
					<span>备注:</span>
				</div>
				<input class="remark" placeholder="" type="text" name="remark">
			</div>
			<div v-show="showStartSearchResult" class="search__result">
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
			</div>
			<div style="top:115px;" v-show="showEndSearchResult" class="search__result">
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
	  			<span>下一步</span>
 			  </div>

		  	<mt-picker :visibleItemCount="7" :slots="datePicker" @change="dateValuesChange"></mt-picker>
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
	  			<span @click="actionNumberPicker(false)">确定</span>
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
		@include display_flex('row');
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
			@include display_flex('row');
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
			width:55%;
			float:left;
		}
		div.line__left--dot{
			width:65px;
			height:36.6666px;
			position: relative;
			&:after{
				content:"";
				position:absolute;
				width:10px;
				height:10px;
				border-radius: 50%;
				background-color:$my_green;
				top:13px;
				left:28px;
			}
		}
		div.dot-red{
			&:after{
				background-color:$my_red;
			}
		}
	}
	/** 搜索结果列表 */
	.search__result{
		position:absolute;
		top:65px;
		left:10px;
		right:10px;
		height:200px;
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
.picker-center-highlight{
	// margin-top:0 !important;
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
    		values: ["今天","明天","后天","大后天"],
    		className: 'slot1',
    		textAlign: 'center'
       }, {
    		flex: 1,
    		values: ["0 点", "1 点", "2 点", "3 点", "4 点", "5 点", "6 点", "7 点", "8 点", "9 点", "10 点", "11 点", "12 点", "13 点", "14 点", "15 点", "16 点", "17 点", "18 点", "19 点", "20 点", "21 点", "22 点", "23 点"],
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
    		values: ["1 人","2 人","3 人","4 人","5 人","6 人"],
    		className: 'slot1',
    		textAlign: 'center'
      }],
      numberPickerText:"",//人数
			
			searchStartText:"",//搜索的地址
			searchEndText:"",
			searchStartList:[],//开始搜索结果
			searchEndList:[],//到达搜索结果
			showEndSearchResult:false,//是否显示搜索结果
			showStartSearchResult:false,//

			searchStartFunction:null,//搜索处理函数
			searchEndFunction:null,//搜索处理函数
		}
	},
	created(){
		this.datePickerText = "今天"+Utils.formatWeek(new Date());
		/** 定义函数使用 */
		this.searchStartFunction = _.debounce(()=>{
			this.$store.dispatch("getStartSearch",this.searchStartText).then(result=>{
				this.searchStartList = result.tips;
			});
		},500);
		
		/** 定义函数使用 */
		this.searchEndFunction = _.debounce(()=>{
			this.$store.dispatch("getEndSearch",this.searchEndText).then(result=>{
				this.searchEndList = result.tips;
			})
		},500);
	},
	computed:{
		
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
		/** 选择开始地点 */
		startAddress(index){
			this.searchStartText = this.searchStartList[index].district+this.searchStartList[index].name;
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
			this.searchBlur();
		},
		searchStartKeyup(){
			this.showStartSearchResult = true;//显示搜索结果
			this.searchStartFunction();
		},
		/** 输入框blur */
		searchBlur(){
			this.showStartSearchResult = false;//隐藏搜索结果
			this.showEndSearchResult = false;//隐藏
		},
		searchEndKeyup(){
			this.showEndSearchResult = true;//显示搜索结果
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
		dateValuesChange(picker,values){
			if(this.datePickerPageShow){
				// 显示的时候才允许设置值
				this.datePickerText = values[0]+" "+values[1]+values[2];
			}
		},
		numberValuesChange(picker,values){
			if(this.numberPickerPageShow){
				// 显示的时候才允许设置值
				this.numberPickerText = values[0]
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