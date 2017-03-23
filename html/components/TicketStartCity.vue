<template type="x/template" id="ticketstartcity">
	<div id="citylist">
		<div @click="openTip" class="startcity--tip">
			<p>关于回程班次购票的情况说明</p>
		</div>
		<div class="left" style="top:85px">
			<div v-for="(list,index) in setStartCityList">
				<p @click="getStartCity(item.CityId,item.Name)" v-show="indexItem===index" v-for="item in list.Content">{{item.Name}}</p>
			</div>
		</div>
		<div class="right" style="top:85px">
			<div v-for="(list,index) in setStartCityList">
				<span :class="{active:indexItem===index}" @click="selectCity(index)">{{list.ShortKey}}</span>
			</div>
		</div>
		<div v-if="modalTip" class="modal">
			<div class="modal-body">
				<strong>关于回程班次购票的情况说明</strong>
				<p>尊敬的揭西城市圈用户：</p>
				<p>因揭西大巴客运回程运营较复杂，为确保用户购票乘车体验流畅，目前只上线了较少的外地回揭西班次，后续流程确定优化完成后，我们将在近期上线更多回程班次，感谢广大揭西同乡的支持，谢谢！</p>
				<button @click="closeTip">明白</button>
			</div>
		</div>
	</div>
</template>

<style lang="css">
@import "../css/ticketcity.css";
.startcity--tip{
	height:35px;
	width:100%;
	position:fixed;
	top:50px;
	left:0;
	z-index: 100;
	background-color: #fff;
	border-bottom:0.5px solid #c8c8c8;
}
.startcity--tip>p{
	text-align: center;
	font-size:16px;
	color:#0074D9;
	height:35px;
	line-height: 35px;
}
</style>

<script type="text/babel">
// import { mapGetters } from 'vuex'
// import Utils from "../Utils/utils";
import { Indicator,Toast } from 'mint-ui';
// const _ = require("underscore");

export default {
	data () {
		return {
			startcity:"",
			startpopupVisible:false,//显示出发选择
			startCitySlots: [{
				flex: 1,
				values: [1,2,3,4,5],
				className: 'startcity'
			}],
			nowElement:null,//目前固定的元素
			content:null,
			elementHeight:[],//各个元素距离顶部的高度
			throttleFunction:null,//引用的函数

			indexItem:0,//默认显示的地址

			modalTip:false,//显示modal
		}
	},
	activated(){
		this.$store.dispatch("ChangeHeader",{isHome:false,Title:"选择出发地"});
		this.$store.commit("SET_SHOWHEADER",true);
		this.$store.commit("SET_SHOWBACK",true);
	},
	created(){
		this.$store.dispatch("ChangeHeader",{isHome:false,Title:"选择出发地"});
		this.$store.commit("SET_SHOWHEADER",true);
		this.$store.commit("SET_SHOWBACK",true);

		if(!this.$store.state.tickets.startCityList){
			// 提示加载中
  		Indicator.open({
			  text: '加载中...',
			  spinnerType: 'double-bounce'
			});
			this.$store.dispatch("setStartCityList").then((data)=>{
  			Indicator.close();
  		});
		}
		console.log(this.setStartCityList)
	},
	mounted(){
		//实现iphone通讯录中类似顶部显示当前块功能
		// let element = document.getElementsByClassName("mint-indexsection-index");
		// this.nowElement = element[0];
		// this.content = document.getElementsByClassName("mint-indexlist-content")[0];//body

		// this.nowElement.classList.add("top-active");//给第一个头加上固定
		// for(let i=0;i<element.length;i++){
		// 	this.elementHeight.push(element[i].offsetTop);
		// }
		
		// //记录函数引用,方便移除事件
		// this.throttleFunction = _.throttle(()=>{
		// 	let contentHeight = this.content.scrollTop;
		// 	let whoBig = 0;
			
		// 	for(let i=0;i<this.elementHeight.length;i++){
		// 		let height = this.elementHeight[i];
		// 		if(contentHeight>=height){
		// 			whoBig = i;//记录大于contentHeight中最大的一个
		// 		}
		// 	}

		// 	this.nowElement.classList.remove("top-active");//去掉之前的
		// 	this.nowElement = document.getElementsByClassName("mint-indexsection-index")[whoBig];
		// 	this.nowElement.classList.add("top-active");//给头加上固定
		// },100,{leading: false})

		// //监听滚动
		// this.content.addEventListener("scroll",this.throttleFunction,false);
	},
	beforeDestroy(){
		// document.getElementsByClassName("mint-indexlist-content")[0].removeEventListener("scroll",this.throttleFunction);
	},
	computed:{
		setStartCityList(){
			return this.$store.state.tickets.startCityList
		},
	},
	watch:{
		// startpopupVisible(status){
		// 	if(status===false){
		// 		// 说明已经选择完了
		// 		this.$router.go(-1);
		// 	}
		// }
	},
	methods:{
		getStartCity(code,name){
			this.startcity = name;
			this.$store.dispatch("setStartCity",{
				Code:code,
				Name:name,
			});
			this.$router.go(-1);
		},
		selectCity(index){
			this.indexItem = index;
		},
		onStartValuesChange(picker, values){
			this.$store.dispatch("setStartCity",{Code:"00000",Name:this.startcity,Station:values[0]});
		},
		noData(){
			this.startpopupVisible = false;
		},
		yesData(){
			this.$router.go(-1);
		},
		openTip(){
			this.modalTip = true;
		},
		closeTip(){
			this.modalTip = false;
		}
	}
}
</script>