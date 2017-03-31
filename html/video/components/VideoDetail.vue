<template>
	<div v-if="isReady" id="video_detail" class="video__detail">
		<div class="video__detail--video">
			<video webkit-playsinline playsinline controls width="100%" height="100%" preload="none" :poster="VideoDetail.Avatar" :src="VideoDetail.Url" ></video>
		</div>
	</div>
</template>

<style lang="sass">
	@import "../../sass/videodetail.scss";
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import { MessageBox, Toast, Indicator, Popup } from 'mint-ui';

export default {
	data () {
		return {
			VideoDetail:{},
			isReady:false
		}
	},
	created(){
		this.loading();
		this.Id = this.$route.params.Id;
		
		if(!this.Id){
			// 没有参数就返回主页
			this.$router.replace({path:"/"});
			Indicator.close();
			return;
		}
		this.$store.dispatch("getVideoDetail",{
			Id:this.Id
		})
		.then(result=>{
			Indicator.close();
			if(result.Data){
				this.VideoDetail = result.Data;
				this.isReady = true;//可以编译模板
			}
			else{
				this.toast(result.Message);
				this.$router.replace({path:"/"});
			}
		})
		.catch(error=>{
			this.toast("服务器错误~");
			Indicator.close();
		})
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
	filters:{
		formatDate(value){
			return Utils.formatDateTypeOne(value);
		}
	},
	components:{
	}
}
</script>