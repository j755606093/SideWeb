<template type="x/template">
	<div id="commend" class="commend">
		<my-header :showBack="true" headerTitle="匹配行程推荐"></my-header>
		<div class="commend--lists">
			<template v-for="(item,index) in ListData">
				<my-list :types="item.Num?1:0" :list="item"></my-list>
			</template>
		</div>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";

</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import List from "./list.vue";
import { Toast, Indicator, Popup } from 'mint-ui';
import Header from "./Header.vue";

export default {
	data () {
		return {
			Index:1,// 页数
			NoData:false,//没有数据
			ListData:[],
			tripId:"",
			types:-1,
		}
	},
	created(){
		this.tripId = this.$route.params.tripId;
		this.types = parseInt(this.$route.params.types);

		this.loading();
		this.$store.dispatch("getSimilar",{
			PassId:this.tripId,
			Types:this.types
		}).then(result=>{
			Indicator.close();
			if(result.Data){
				this.ListData = result.Data;
			}
			else{
				this.toast(result.Message);
				this.$router.push({path:"/"});
			}
		}).catch(error=>{
			this.$router.push({path:"/"});
			Indicator.close();
		})
	},
	activated(){
		
	},
	computed:{
		UserInfo(){
			return this.$store.getters.getUserInfo;
		}
	},
	methods:{
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
	},
	filters:{
		
	},
	components:{
		"my-list":List,
		"my-header":Header,
	}
}
</script>