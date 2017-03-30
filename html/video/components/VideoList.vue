<template>
	<div class="video__list">
		<div class="video__body">
			<video data-setup='{}' controls width="100%" height="100%" preload="none" poster="http://bpic.588ku.com/back_pic/00/04/76/955624f209d2f22.jpg" :src="videoUrl" ></video>
		</div>
		<div class="video__footer">
			<div class="video__footer--title">
				<p>揭西人春节打麻将通知</p>
			</div>
			<div class="video__footer--info">
				<span>时长 02:00</span>
				<span> <i class="fa fa-eye"></i>450</span>
				<span class="info--right">2017-06-30</span>
			</div>
		</div>
	</div>
</template>

<style lang="sass">
	@import "../../sass/videolist.scss";
</style>

<script type="text/babel">
// import Utils from "../Utils/utils";

export default {
	props:{
		videoUrl:{
			type:String,
			default:""
		}
	},
	data () {
		return {
			
		}
	},
	created(){
		
	},
	methods:{
		
	},
	computed:{
		
	},
	components:{
	}
}
</script>