<template type="x/template" id="TicketEndCity">
	<div id="endcity">
		<mt-index-list class="fixed">
		  <mt-index-section v-for="list in setEndCityList" :index="list.ShortKey">
		  	<!-- <template v-for="station in list.Content"> -->
		   	 <mt-cell v-for="item in list.Content" @click.native="getEndCity(item.Id,item.Name)" :title="item.Name"></mt-cell>
		   	 <!-- </template> -->
		  </mt-index-section>
		</mt-index-list>
		<!-- 到底地址 -->
		<!-- <mt-popup
		  v-model="endpopupVisible"
		  position="bottom"
		  class="popup-visible">
		  <div class="query-start">
		  	<button @click="noData">取消</button>
		  	<button @click="yesData">确定</button>
		  </div>
		  <mt-picker :slots="endCitySlots" @change="onEndValuesChange"></mt-picker>
		</mt-popup> -->
	</div>
</template>

<style lang="sass">
@import "../sass/utils.scss";
.fixed{
	position:fixed;
	z-index:1000;
}
.popup-visible{
	width:100%;
	z-index:1001;
	position:fixed;
}
.query-start{
	display:flex;
	flex-dirction:row;
	height:40px;
	border-bottom:1px solid lighten($gray, 25%);
	background-color:lighten($gray, 15%);
	button{
		flex:1;
		font-size:1.6rem;
		border:0;
		outline:none;
		color:$blue;
		background-color:$white;
	}
}
.mint-indexlist-navitem{
	padding-top:5px;
}
.mint-indexsection{
	>p.top-active+ul{
		margin-top:30px;
	}
}
.mint-indexlist-nav{
	z-index:1002;
}
.top-active{
	position: fixed;
  top: 50px;
  left: 0;
  margin-right: 36px;
  z-index: 1001;
  width: 100%;
}
</style>

<script type="text/babel">
import { mapGetters } from 'vuex'
import Utils from "../Utils/utils";
import { Indicator,Toast } from 'mint-ui';
const _ = require("underscore");

export default {
	data () {
		return {
			endcity:"",
			setEndCityList:null,
			endpopupVisible:false,//显示到达选择
			endCitySlots: [{
				flex: 1,
				values: [],
				className: 'endcity'
			}],
			nowElement:null,//目前固定的元素
			content:null,
			elementHeight:[],//各个元素距离顶部的高度
			throttleFunction:null,//引用的函数
		}
	},
	created(){
		this.$store.dispatch("ChangeHeader",{isHome:false,Title:"选择到达地"});

		if(!this.$store.state.tickets.endCityList){
			// 提示加载中
  		Indicator.open({
			  text: '加载中...',
			  spinnerType: 'double-bounce'
			});
			this.$store.dispatch("setEndCityList").then((data)=>{
  			Indicator.close();
  		});
		}
	},
	mounted(){
		//实现iphone通讯录中类似顶部显示当前块功能
		let element = document.getElementsByClassName("mint-indexsection-index");
		this.nowElement = element[0];
		this.content = document.getElementsByClassName("mint-indexlist-content")[0];//body

		this.nowElement.classList.add("top-active");//给第一个头加上固定
		for(let i=0;i<element.length;i++){
			this.elementHeight.push(element[i].offsetTop);
		}
		
		//记录函数引用,方便移除事件
		this.throttleFunction = _.throttle(()=>{
			let contentHeight = this.content.scrollTop;
			let whoBig = 0;
			
			for(let i=0;i<this.elementHeight.length;i++){
				let height = this.elementHeight[i];
				if(contentHeight>=height){
					whoBig = i;//记录大于contentHeight中最大的一个
				}
			}

			this.nowElement.classList.remove("top-active");//去掉之前的
			this.nowElement = document.getElementsByClassName("mint-indexsection-index")[whoBig];
			this.nowElement.classList.add("top-active");//给头加上固定
		},100,{leading: false})

		//监听滚动
		this.content.addEventListener("scroll",this.throttleFunction,false);
	},
	beforeDestroy(){
		document.getElementsByClassName("mint-indexlist-content")[0].removeEventListener("scroll",this.throttleFunction);
	},
	computed:{
		setEndCityList(){
			return this.$store.state.tickets.endCityList
		}
	},
	watch:{
		// endpopupVisible(status){
		// 	if(status===false){
		// 		// 说明已经选择完了
		// 		this.$router.go(-1);
		// 	}
		// }
	},
	methods:{
		getEndCity(code,name,station){
			this.endcity = name;
			// if(station.length===0){
			// 	this.$store.dispatch("setEndCity",{
			// 		Code:code,
			// 		Name:name,
			// 		Station:"",//空的站台
			// 	});
			// 	this.$router.go(-1);
			// }
			// else{
			// 	this.endCitySlots[0].values = _.map(station,(item)=>{
			// 		return item.Name;
			// 	});
				
			// 	this.endpopupVisible = true;
			// }
			this.$store.dispatch("setEndCity",{
				Code:code,
				Name:name,
			});
			this.$router.go(-1);
		},
		onEndValuesChange(picker, values){
			this.$store.dispatch("setEndCity",{Code:"00000",Name:this.endcity,Station:values[0]});
		},
		noData(){
			this.endpopupVisible = false;
		},
		yesData(){
			this.$router.go(-1);
		}
	}
}
</script>