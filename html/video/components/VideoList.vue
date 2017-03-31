<template>
	<div @click="goToPage" class="video__list">
		<div class="video__body">
			<img class="video-bg" :src="video.Avatar">
			<div class="play">
				<img src="../icon/play_icon.png">
			</div>
		</div>
		<div class="video__footer">
			<div class="video__footer--title">
				<p v-text="video.Title"></p>
			</div>
			<div class="video__footer--info">
				<span>时长 {{video.Duration}}</span>
				<span> <i class="fa fa-eye"></i>{{video.ReadCount}}</span>
				<span class="info--right">{{video.CTime|formatDate}}</span>
			</div>
		</div>
	</div>
</template>

<style lang="sass">
	@import "../../sass/videolist.scss";
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";

export default {
	props:{
		video:{
			type:Object,
			default:function(){
				return {}
			}
		}
	},
	data () {
		return {
			
		}
	},
	created(){
		
	},
	methods:{
		goToPage(){
			// this.$store.dispatch("setVideoDetail",this.video);
			this.$router.push({name:"detail",params:{
				Id:this.video.Id
			}});
		}
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