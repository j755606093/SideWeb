<template>
	<div class="ticketbody">
		<div class="go block">
			<span><i class="fa fa-location-arrow"></i>出发城市</span>
			<span>上海</span>
		</div>
		<div class="to block">
			<span><i class="fa fa-location-arrow"></i>到达城市</span>
			<span>北京</span>
		</div>
		<div class="data">
			<span><i class="fa fa-calendar"></i>出发日期</span>
			<span>12月24日</span>
			<span>周六</span>
		</div>
		<div class="query">
			<button class="btn">查询</button>
		</div>
	</div>
</template>

<style lang="css">
	@import "../css/ticketbody.css";
</style>

<script type="text/babel">
import Utils from "../Utils/utils";

export default {
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