<template>
	<div id="startcity">
		<mt-index-list class="fixed">
		  <mt-index-section v-for="list in setStartCityList" :index="list.ShortKey">
		  	<!-- <template v-for="station in list.Content"> -->
		   	 <mt-cell v-for="item in list.Content" @click.native="getStartCity(item.Id,item.Name)" :title="item.Name"></mt-cell>
		    <!-- </template> -->
		  </mt-index-section>
		</mt-index-list>
		<!-- 出发地址 -->
		<!-- <mt-popup
		  v-model="startpopupVisible"
		  position="bottom"
		  class="popup-visible">
		  <div class="query-start">
		  	<button @click="noData">取消</button>
		  	<button @click="yesData">确定</button>
		  </div>
		  <mt-picker :slots="startCitySlots" @change="onStartValuesChange"></mt-picker>
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
</style>

<script type="text/babel">
import { mapGetters } from 'vuex'
import Utils from "../Utils/utils";
import { Indicator,Toast } from 'mint-ui';
const _ = require("underscore");

export default {
	data () {
		return {
			startcity:"",
			setStartCityList:null,
			startpopupVisible:false,//显示出发选择
			startCitySlots: [{
				flex: 1,
				values: [1,2,3,4,5],
				className: 'startcity'
			}],
		}
	},
	created(){
		this.$store.dispatch("ChangeHeader",{isHome:false,Title:"选择出发地"});

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
			// if(station.length===0){
			// 	this.$store.dispatch("setStartCity",{
			// 		Code:code,
			// 		Name:name,
			// 		Station:"",//空的站台
			// 	});
			// 	this.$router.go(-1);
			// }
			// else{
			// 	this.startCitySlots[0].values = _.map(station,(item)=>{
			// 		return item.Name;
			// 	});
				
			// 	this.startpopupVisible = true;
			// }
			this.$store.dispatch("setStartCity",{
				Code:code,
				Name:name,
			});
			this.$router.go(-1);
		},
		onStartValuesChange(picker, values){
			this.$store.dispatch("setStartCity",{Code:"00000",Name:this.startcity,Station:values[0]});
		},
		noData(){
			this.startpopupVisible = false;
		},
		yesData(){
			this.$router.go(-1);
		}
	}
}
</script>