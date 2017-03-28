<template type="x/template">
	<div ref="commend" id="commend" class="commend">
		<my-header :showBack="true" headerTitle="匹配行程推荐"></my-header>
		<div ref="commend_list" id="commend_list" class="commend--lists">
			<template v-for="(item,index) in ListData">
				<my-list :types="item.Num?1:0" :list="item"></my-list>
			</template>
			<div id="last_bottom" ref="last_bottom"></div>
			<div v-show="NoData" class="no-data">
				<p>没有更多数据~</p>
			</div>
		</div>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
.commend--lists{
	margin-top: 60px;
	padding:0 10px;
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import List from "./list.vue";
import { Toast, Indicator, Popup } from 'mint-ui';
import Header from "./Header.vue";
const _ = require("underscore");

export default {
	data () {
		return {
			Page:1,// 页数
			NoData:false,//没有数据
			ListData:[],
			tripId:"",
			types:-1,
		}
	},
	created(){
		this.tripId = this.$route.params.tripId;
		this.types = this.$route.params.types;//driver,passenger

		this.loading();
		this.$store.dispatch("getSimilar",{
			Id:this.tripId,
			Types:this.types,
			Page:this.Page,
			Size:10
		}).then(result=>{
			this.Page++;
			Indicator.close();
			if(result.Data){
				if(result.Data.length<10){
					this.NoData = true;
				}
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
	mounted(){
		window.addEventListener("scroll",_.throttle(()=>{
			let last = this.$refs.last_bottom.offsetTop - document.body.scrollTop;
			if(last<800){
				this.getMoreData();
			}
		},400,{leading:false}))
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
		getMoreData(){
			if(this.NoData){
				return;
			}
			this.loading();
			this.$store.dispatch("getSimilar",{
				Id:this.tripId,
				Types:this.types,
				Page:this.Page,
				Size:10
			}).then(result=>{
				this.Page++;
				Indicator.close();
				if(result.Data){
					if(result.Data.length<10){
						this.NoData = true;
					}
					this.ListData = this.ListData.concat(result.Data);
				}
				else{
					this.toast(result.Message);
				}
			}).catch(error=>{
				this.$router.push({path:"/"});
				Indicator.close();
			})
		}
	},
	filters:{
		
	},
	components:{
		"my-list":List,
		"my-header":Header,
	}
}
</script>