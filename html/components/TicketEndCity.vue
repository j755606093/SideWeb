<template>
	<mt-index-list class="absolute">
	  <mt-index-section v-for="list in setEndCityList" :index="list.ShortKey">
	    <mt-cell v-for="item in list.Content" @click.native="getEndCity(item.Code,item.Name)" :title="item.Name"></mt-cell>
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
			setEndCityList:null
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
	methods:{
		getEndCity(code,name){
			this.$store.dispatch("setEndCity",{
				Code:code,
				Name:name
			});
			this.$router.go(-1);
		}
	}
}
</script>