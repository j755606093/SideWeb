<template>
<div id="video">
	<!-- 标头 -->
	<header>
		<div @click="SwitchPage(0)" class="header__type">
			<span :class="{'header__type--block':true, active:currentPage===0}">热门</span>
		</div>
		<div @click="SwitchPage(1)" class="header__type">
			<span :class="{'header__type--block':true, active:currentPage===1}">身边</span>
		</div>
		<div @click="SwitchPage(2)" class="header__type">
			<span :class="{'header__type--block':true, active:currentPage===2}">搞笑</span>
		</div>
		<div @click="SwitchPage(3)" class="header__type">
			<span :class="{'header__type--block':true, active:currentPage===3}">教育</span>
		</div>
		<div class="header__search">
			<img src="../icon/seach_icon.png" alt="搜索">
		</div>
	</header>
	<!-- 热门列表 -->
	<div v-show="currentPage===0" class="video__lists">
		<template v-for="(item,index) in HotVideo">
			<video-list :video="item"></video-list>
		</template>
		<p class="no-more-data" v-show="HotVideoNoMoreData">没有更多数据~</p>
	</div>
	<!-- 身边 -->
	<div v-show="currentPage===1" class="video__lists">
		<template v-for="(item,index) in SideVideo">
			<video-list :video="item"></video-list>
		</template>
		<p class="no-more-data" v-show="SideVideoNoMoreData">没有更多数据~</p>
	</div>
	<!-- 搞笑 -->
	<div v-show="currentPage===2" class="video__lists">
		<template v-for="(item,index) in FunnyVideo">
			<video-list :video="item"></video-list>
		</template>
		<p class="no-more-data" v-show="FunnyVideoNoMoreData">没有更多数据~</p>
	</div>
	<!-- 教育 -->
	<div v-show="currentPage===3" class="video__lists">
		<template v-for="(item,index) in EducateVideo">
			<video-list :video="item"></video-list>
		</template>
		<p class="no-more-data" v-show="EducateVideoNoMoreData">没有更多数据~</p>
	</div>
</div>
</template>

<script type="text/babel">
import Utils from "../../Utils/utils.js";
import { MessageBox, Toast, Indicator, Popup } from 'mint-ui';
import VideoList from "./VideoList.vue";

export default {
	data () {
		return {
			currentPage:0,//默认第一页

			HotVideoNoMoreData:false,
			HotIndex:1,

			SideVideoNoMoreData:false,
			SideIndex:1,

			FunnyVideoNoMoreData:false,
			FunnyIndex:1,

			EducateVideoNoMoreData:false,
			EducateIndex:1,
		}
	},
	created(){
		this.getHotVideo();
	},
	mounted(){
		
	},
	methods:{
		loading() {
			Indicator.open({
				spinnerType: 'fading-circle'
			});
		},
		toast(title) {
			Toast({
				message: title,
				position: 'bottom',
				duration: 3000
			});
		},
		/** 切换页面 */
		SwitchPage(index){
			if(index===this.currentPage)return;

			this.currentPage = index;
			switch(index){
				case 0:
					this.getHotVideo();
					break;
				case 1:
					this.getSideVideo();
					break;
				case 2:
					this.getFunnyVideo();
					break;
				case 3:
					this.getEducateVideo();
					break;
				default:
					break;
			}
		},
		/** 获取更多数据 */
		getHotVideo(){
			if(this.HotVideoNoMoreData)return;//没有更多数据

			this.$store.dispatch("getHotVideoList",{
				Index:this.HotIndex
			}).then(result=>{
				this.HotIndex++;
				if(!result.Data||result.Data.length<10){
					this.HotVideoNoMoreData = true;
				}
				else{
					this.toast(result.Message);
				}
			})
		},
		/** 获取更多数据 */
		getSideVideo(){
			if(this.SideVideoNoMoreData)return;//没有更多数据

			this.$store.dispatch("getSideVideoList",{
				Index:this.SideIndex
			}).then(result=>{
				this.SideIndex++;
				if(!result.Data||result.Data.length<10){
					this.SideVideoNoMoreData = true;
				}
				else{
					this.toast(result.Message);
				}
			})
		},
		/** 获取更多数据 */
		getFunnyVideo(){
			if(this.FunnyVideoNoMoreData)return;//没有更多数据

			this.$store.dispatch("getFunnyVideoList",{
				Index:this.FunnyIndex
			}).then(result=>{
				this.FunnyIndex++;
				if(!result.Data||result.Data.length<10){
					this.FunnyVideoNoMoreData = true;
				}
				else{
					this.toast(result.Message);
				}
			})
		},
		/** 获取更多数据 */
		getEducateVideo(){
			if(this.EducateVideoNoMoreData)return;//没有更多数据

			this.$store.dispatch("geSideVideoList",{
				Index:this.EducateIndex
			}).then(result=>{
				this.EducateIndex++;
				if(!result.Data||result.Data.length<10){
					this.EducateVideoNoMoreData = true;
				}
				else{
					this.toast(result.Message);
				}
			})
		},
	},
	computed:{
		HotVideo(){
			return this.$store.getters.getHotVideo;
		},
		SideVideo(){
			return this.$store.getters.getSideVideo;
		},
		FunnyVideo(){
			return this.$store.getters.getFunnyVideo;
		},
		EducateVideo(){
			return this.$store.getters.getEducateVideo;
		}
	},
	components:{
		"video-list":VideoList
	}
}
</script>

<style lang="sass">
@import "../../sass/video.scss";
</style>