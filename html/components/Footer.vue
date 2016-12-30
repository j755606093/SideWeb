<template>
	<footer v-show="getfooter">
		<a href="./ticket.html#/home/ticketbody" class="footer active">
			<!-- <i class="fa fa-home"></i> -->
			<img src="../picture/ticket_blue.png">
			<p>票务</p>
		</a>
		<a href="./TicketOrder.html" class="footer">
			<!-- <i class="fa fa-sticky-note"></i> -->
			<img src="../picture/cart_order.png">
			<p>订单</p>
		</a>
		<a class="footer">
			<!-- <i class="fa fa-user"></i> -->
			<img src="../picture/user.png">
			<p>个人中心</p>
		</a>
	</footer>
</template>

<style lang="sass">
@import "../sass/utils.scss";
footer{
	display:flex;
	flex-direction:row;
	position:fixed;
	bottom:0;
	left:0;
	height:50px;
	width:100%;
	justify-content:center;
	align-items:center;
	// border-top:1px solid $gray;
	background-color: $white;
	box-shadow:3px 0 3px 3px #efeeee;
	z-index: 100;
	.footer{
		flex:1;
		display:flex;
		flex-direction:column;
		justify-content:center;
		align-items:center;
		color:$gray;
		i{
			flex:1;
			font-size:1.8rem;
		}
		img{
			flex:1;
			width:22px;
			height:22px;
		}
		p{
			flex:1;
			font-size:1.2rem;
			color:$gray;
		}
	}
	.footer.active{
		color:$blue;
		p{
			color:$blue;
		}
	}
}
</style>

<script type="text/babel">
import Utils from "../Utils/utils";

export default {
	data () {
		return {
			
		}
	},
	created(){
		
	},
	computed:{
		getfooter(){
			return this.$store.getters.getHeaderState;
			// return this.$store.getters.getHeaderState;
		}
	},
	methods:{
		
	}
}
</script>