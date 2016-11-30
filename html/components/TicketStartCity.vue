<template>
	<mt-index-list class="absolute">
	  <mt-index-section v-for="list in setStartCityList" :index="list.ShortKey">
	    <mt-cell v-for="item in list.Content" @click.native="getStartCity(item.Code,item.Name)" :title="item.Name"></mt-cell>
	  </mt-index-section>
	</mt-index-list>
</template>

<style lang="sass">
@import "../sass/utils.scss";
.absolute{
	position:absolute;
}
</style>

<script type="text/babel">
import { mapGetters } from 'vuex'
import Utils from "../Utils/utils";
import { Indicator,Toast } from 'mint-ui';

export default {
	data () {
		return {
			setStartCityList:null
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
		}
	},
	methods:{
		getStartCity(code,name){
			this.$store.dispatch("setStartCity",{
				Code:code,
				Name:name
			});
			this.$router.go(-1);
		}
	}
}
</script>