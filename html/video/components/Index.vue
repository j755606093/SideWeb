<template>
<div id="video">
	<header>
		<div class="header__type">
			<span class="header__type--block active">热门</span>
		</div>
		<div class="header__type">
			<span class="header__type--block">身边</span>
		</div>
		<div class="header__type">
			<span class="header__type--block">搞笑</span>
		</div>
		<div class="header__type">
			<span class="header__type--block">教育</span>
		</div>
		<div class="header__search">
			<img src="../icon/seach_icon.png" alt="搜索">
		</div>
	</header>
	<div class="video__lists">
		<video-list videoUrl="http://192.168.31.116:3000/test_video.mp4"></video-list>
		<video-list videoUrl="http://192.168.31.116:3000/test_video.mp4"></video-list>
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
			
		}
	},
	created(){
		
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
	},
	computed:{
		
	},
	components:{
		"video-list":VideoList
	}
}
</script>

<style lang="sass">
@import "../../sass/video.scss";
</style>