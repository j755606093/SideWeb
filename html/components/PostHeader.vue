<template>
	<header>
		<div class="header">
			<div class="header-left">
				<img class="avatar" v-bind:src="header.Avatar" alt="头像">
				<div class="other-info">
					<p class="author-name" v-text="header.Nick"></p>
					<p class="publish-time" v-text="formatTime(header.CTime)"></p>
				</div>
			</div>
			<div class="header-right">
				<button class="concern" v-on:click="concern(header.UsrId)">关注</button>
			</div>
		</div>
	</header>
</template>

<style lang="css">
	@import "../css/header.css";
</style>

<script type="text/babel">
import Utils from "../Utils/utils";

export default {
	props:["header"],
	data () {
		return {
			
		}
	},
	created(){
		
	},
	methods:{
		concern(UsrId){
			console.log(UsrId);
		},
		formatTime(date){
			return Utils.formatTime(date);
		}
	}
}
</script>