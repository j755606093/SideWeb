<template>
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