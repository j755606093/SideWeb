<template>
	<article>
		<p class="title" v-text="content.Title"></p>
		<div class="content">
			<p v-text="content.Content"></p>
		</div>
		<div class="other">
			<div class="eye other-info">
				<i class="fa fa-eye"></i>
				<span v-text="content.ReadCount"></span>
			</div>
			<div class="time other-info">
				<i class="fa fa-calendar"></i>
				<span v-text="formatDate(content.CTime)"></span>
			</div>
			<div class="comment other-info">
				<i class="fa fa-commenting-o"></i>
				<span v-text="content.CmtCount"></span>
			</div>
		</div>
	</article>
</template>

<style lang="css">
	@import "../css/content.css";
</style>

<script type="text/babel">
import Utils from "../Utils/utils";

export default {
	props:["content"],
  data () {
    return {
      
    }
  },
  filters:{
  	
  },
  computed:{
  	
  },
  methods:{
  	formatDate(data){
  		return Utils.formatDate(data);
  	}
  }
}
</script>