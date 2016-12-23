<template>
	<section>
		<div class="list" v-for="item in floor">
			<div class="header">
				<div class="header-left">
					<img class="avatar" v-bind:src="item.Avatar" alt="头像">
					<div class="other-info">
						<p class="author-name" v-text="item.Nick"></p>
						<p class="publish-time" v-text="formatTime(item.CTime)"></p>
					</div>
				</div>
				<div class="header-right">
					<div class="block">
						<i class="fa fa-thumbs-o-up" v-if="item.LikeStatus===0"></i>
						<i class="fa fa-thumbs-up" v-else></i>
						<span v-text="item.LikeCount"></span>
					</div>
				</div>
			</div>
			<div class="content">
				<div class="replay" v-if="item.SupReplies">
					<p>
						<span>回复</span>
						<span class="font-blue" v-text="item.SupReplies.Nick"></span>
						<span>的评论:</span>
					</p>
					<p v-text="item.SupReplies.Content"></p>
				</div>
				<p class="comment" v-text="item.Content"></p>
			</div>
			<div class="operate">
				<p><button @click="report(item.Id)">举报</button></p>
				<p><button @click="replay(item.Id)">回复</button></p>
			</div>
		</div>
	</section>
</template>

<style lang="css">
	@import "../css/comment.css";
</style>

<script type="text/babel">
import Utils from "../Utils/utils";

export default {
	props:["floor"],
  data () {
    return {
      msg: 'Hello from vue-loader!'
    }
  },
  methods:{
  	formatTime(date){
			return Utils.formatTime(date);
  	},
  	report(id){
  		alert(id);
  	},
  	replay(id){
  		alert(id)
  	}
  }
}
</script>