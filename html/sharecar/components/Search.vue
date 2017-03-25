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
					<input @click="searchStartKeyup" v-model="searchStartText" @keyup="searchStartKeyup" type="text" placeholder="出发地" name="search">
				</div>
				<div class="publish__info--line">
					<div class="line__left--dot dot-red"></div>
					<input @click="searchEndKeyup" v-model="searchEndText" @keyup="searchEndKeyup" type="text" placeholder="目的地" name="search">
				</div>
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
							<span class="gray">{{item.cityname+item.adname+item.address}}</span>
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
							<span class="gray">{{item.cityname+item.adname+item.address}}</span>
						</div>
					</div>
				</div>
				<div style="float:left;" id="endSearchList_last"></div>
			</div>
		</div>
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
		}
	},
	created(){
		/** 定义按键函数使用 */
		this.searchStartFunction = _.debounce(()=>{
			this.$store.dispatch("getStartSearch",{
				text:this.searchStartText,
				page:1
			}).then(result=>{
				this.searchStartIndex = 2;
				this.searchStartList = result.pois;
			});
		},500);
		
		/** 定义按键函数使用 */
		this.searchEndFunction = _.debounce(()=>{
			this.$store.dispatch("getEndSearch",{
				text:this.searchEndText,
				page:1
			}).then(result=>{
				this.searchEndIndex = 2;
				this.searchEndList = result.pois;
			})
		},500);
	},
	mounted(){
		// 监听开始地址滚动
		document.getElementById("startSearchList").addEventListener('scroll', _.throttle(()=> {
			if(this.searchStartNoData)return;//列表不显示或者没有更多数据时候不执行

			let last = document.getElementById("startSearchList_last").offsetTop - document.getElementById("startSearchList").scrollTop;

			if (last < 400) {
				this.$store.dispatch("getStartSearch",{
					text:this.searchStartText,
					page:this.searchStartIndex
				}).then(result=>{
					this.searchStartIndex++;
					if(result.pois.lenght<10){
						this.searchStartNoData = true;//没有更多数据
					}
					this.searchStartList = this.searchStartList.concat(result.pois);
				})
			}
		}, 400, { leading: false }));

		// 监听到达地址滚动
		document.getElementById("endSearchList").addEventListener('scroll', _.throttle(()=> {
			if(this.searchEndNoData)return;//列表不显示或者没有更多数据时候不执行

			let last = document.getElementById("endSearchList_last").offsetTop - document.getElementById("endSearchList").scrollTop;

			if (last < 400) {
				this.$store.dispatch("getEndSearch",{
					text:this.searchEndText,
					page:this.searchEndIndex
				}).then(result=>{
					this.searchEndIndex++;
					if(result.pois.lenght<10){
						this.searchEndNoData = true;//没有更多数据
					}
					this.searchEndList = this.searchEndList.concat(result.pois);
				})
			}
		}, 400, { leading: false }));
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
		searchStartKeyup(){
			this.showStartSearchResult = true;//显示搜索结果
			this.showEndSearchResult = false;//隐藏另一个
			if(this.searchStartText==="")return;
			this.searchStartFunction();
		},
		searchEndKeyup(){
			this.showEndSearchResult = true;//显示搜索结果
			this.showStartSearchResult = false;//隐藏另一个
			if(this.searchEndText==="")return;
			this.searchEndFunction();
		},
	},
	filters:{
		
	},
	components:{
		"my-header":Header,
	}
}
</script>