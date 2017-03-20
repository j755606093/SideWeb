<template type="x/template" id="index">
	<div class="home">
		<div class="home__swpier">
			<div class="swiper-container">
		    <!-- Additional required wrapper -->
		    <div class="swiper-wrapper">
	        <div class="swiper-slide">
						<img src="../icon/swiper1.png">
	        </div>
	        <div class="swiper-slide">
	        	<img src="../icon/swiper1.png">
	        </div>
	        <div class="swiper-slide">
	        	<img src="../icon/swiper1.png">
	        </div>
		    </div>
		    <!-- If we need pagination -->
		    <div class="swiper-pagination"></div>
			</div>
		</div>
		<div class="home__header">
			<div class="header_title">
				<span class="active">人找车</span>
				<span>车找人</span>
				<div class="action--btn">
					<img src="../icon/seach_icon.png">
				</div>
				<div class="action--btn">
					<img src="../icon/Refresh_ICON.png">
				</div>
			</div>
			<div class="header_message">
				<span class="message--new">有43条新消息</span>
				<div class="header_message--taxis">
					<span class="active">发布时间排序</span>
					<span>发车时间排序</span>
				</div>
			</div>
		</div>
		<div class="home__lists">
			<my-list></my-list>
		</div>
	</div>
</template>

<style lang="css">
@import "../../css/sharecar_index.css";
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import Swiper from "swiper";
import List from "./list.vue";

export default {
	data () {
		return {
			
		}
	},
	created(){
		
	},
	mounted(){
		const mySwiper = new Swiper('.swiper-container', {
	    autoplay: 2000,
	    loop: true,
	    pagination: '.swiper-pagination',
	    autoplayDisableOnInteraction : false,
	  });
	},
	computed:{
		
	},
	methods:{
		
	},
	components:{
		"my-list":List
	}
}
</script>