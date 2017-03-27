<template type="x/template">
	<div id="search" class="searchtrip">
		<my-header :showBack="true" headerTitle="搜索行程"></my-header>
		<div class="swtich-role">
			<span @click="switchRole(0)" :class="{active:Role===0}">我是乘客</span>
			<span @click="switchRole(1)" :class="{active:Role===1}">我是司机</span>
		</div>
		<div class="search">
			<div class="search__info">
				<div class="search__info--left">
					<div  class="search__info--line">
						<div class="line__left--dot"></div>
						<input @click="searchStartKeyup" v-model="searchStartText" @keyup="searchStartKeyup" type="text" placeholder="出发地" name="search">
					</div>
					<hr class="hr" />
					<div class="search__info--line">
						<div class="line__left--dot dot-red"></div>
						<input @click="searchEndKeyup" v-model="searchEndText" @keyup="searchEndKeyup" type="text" placeholder="目的地" name="search">
					</div>
				</div>
				<div class="search__info--right">
					<img src="../icon/seach_icon.png">
				</div>
			</div>
			<div :style="{height:searchResultHeight+'px'}" id="search-list" class="search-list">
				<template v-for="(item,index) in searchResult">
					<my-list :isShowRight="false" :types="item.Num?1:0" :list="item"></my-list>
				</template>
				<div class="no-data" v-if="Role===1&&searchPassengerNoData">
					<p>没有更多数据</p>
				</div>
				<div class="no-data" v-if="Role===0&&searchCarNoData">
					<p>没有更多数据</p>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
@import "./some.scss";
.searchtrip{
	margin-top:50px;
	.swtich-role{
		width:100%;
		// @include display_flex('row');
		height:45px;
		line-height:45px;
		background-color:#fff;
		text-align: center;
		box-shadow: 0 3px 3px 3px #f5f5f5;
		>span{
			width:50%;
			float:left;
			display:inline-block;
		}
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
				height:2px;
			}
		}
	}
}
.search{
	width:100%;
	position:relative;
	margin-top:10px;
	.search__info{
		width:100%;
		background-color: #fff;
		margin-bottom: 10px;
		box-shadow: 0 3px 3px 3px #f5f5f5;
		float:left;
		>div{
			float:left;
			display:inline-block;
		}
		.search__info--left{
			width:80%;
		}
		.search__info--right{
			width:20%;
			text-align:center;
			height:90px;
			background-color:#fff;
			>img{
				width:14px;
				height:14px;
				margin-top:35px;
			}
		}
	}
	.search__info--line{
		padding-left:20px;
		height:45px;
		line-height: 45px;
		justify-content:flex-start;
		background-color:#fff;
		width:100%;
		position:relative;
		>div{
			float:left;
			width:10%;
		}
		input{
			display:inline-block;
			// text-align:center;
			border:none;
			outline:none;
			height:45px;
			font-size:14px;
			// line-height:40px;
			width:90%;
			float:left;
		}
		div.line__left--dot{
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
				left:0;
			}
		}
		div.dot-red{
			&:after{
				background-color:$my_red;
			}
		}
	}
	// 搜索结果页
	.search-list{
		position:fixed;
		top:200px;
		left:0;
		width:100%;
		height:300px;
		padding:0 10px;
		overflow: scroll;
		>div.no-data{
			height:30px;
			line-height:30px;
			text-align:center;
			>p{
				font-size:12px;
			}
		}
	}
}
.animated{
	animation-duration: 0.4s;
}
.hr{
	background-color:#fff;
	height:0;
	z-index: 10;
	border:none;
	border-top:1px solid #c8c8c8;
	margin-left: 20px;
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

			searchPassengerList:[],//开始搜索结果
			searchPassengerIndex:1,//页数
			searchPassengerNoData:false,//没有数据

			searchCarList:[],//搜索结果
			searchCarIndex:1,//页数
			searchCarNoData:false,//没有数据

			searchStartFunction:null,//搜索处理函数
			searchEndFunction:null,//搜索处理函数

			searchResultHeight:0,//搜索结果页高度
		}
	},
	created(){
		/** 定义按键函数使用 */
		this.searchFunction = _.debounce(()=>{
			if(this.Role===1){
				this.$store.dispatch("searchPassengerAddress",{
					SpointFuzzy:this.searchStartText,
					EpointFuzzy:this.searchEndText,
					Index:1,
					Size:10
				}).then(result=>{
					if(!result.Data||result.Data.length<10){
						this.searchPassengerNoData=true;
					}
					this.searchPassengerIndex = 2;
					this.searchPassengerList = result.Data;
				});
			}
			else{
				this.$store.dispatch("searchCarAddress",{
					SpointFuzzy:this.searchStartText,
					EpointFuzzy:this.searchEndText,
					Index:1,
					Size:10
				}).then(result=>{
					if(!result.Data||result.Data.length<10){
						this.searchCarNoData=true;
					}
					this.searchCarIndex = 2;
					this.searchCarList = result.Data;
				});
			}
		},500);
	},
	mounted(){
		/** 计算结果页高度 */
		this.searchResultHeight = window.screen.height-document.getElementById("search-list").offsetTop;

		// 监听开始地址滚动
		// document.getElementById("startSearchList").addEventListener('scroll', _.throttle(()=> {
		// 	if(this.searchStartNoData)return;//列表不显示或者没有更多数据时候不执行

		// 	let last = document.getElementById("startSearchList_last").offsetTop - document.getElementById("startSearchList").scrollTop;

		// 	if (last < 400) {
		// 		this.$store.dispatch("getStartSearch",{
		// 			text:this.searchStartText,
		// 			page:this.searchStartIndex
		// 		}).then(result=>{
		// 			this.searchStartIndex++;
		// 			if(result.pois.lenght<10){
		// 				this.searchStartNoData = true;//没有更多数据
		// 			}
		// 			this.searchStartList = this.searchStartList.concat(result.pois);
		// 		})
		// 	}
		// }, 400, { leading: false }));
	},
	computed:{
		// 返回显示的数据
		searchResult(){
			if(this.Role===1){
				return this.searchPassengerList;
			}
			else{
				return this.searchCarList;
			}
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
		searchStartKeyup(){
			if(this.searchStartText==="")return;
			this.searchFunction();
		},
		searchEndKeyup(){
			if(this.searchEndText==="")return;
			this.searchFunction();
		},
	},
	filters:{
		
	},
	components:{
		"my-header":Header,
		"my-list":List
	}
}
</script>