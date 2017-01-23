<template type="x/template" id="ticketfooter">
	<footer v-show="getfooter">
		<a :href="refresh" class="footer active">
			<!-- <i class="fa fa-home"></i> -->
			<img src="../picture/ticket_blue.png">
			<p>票务</p>
		</a>
		<a :href="'./TicketOrder.html?datetime='+Date.now()" :class="['footer',getNoPay>0?'nopay':'']">
			<!-- <i class="fa fa-sticky-note"></i> -->
			<img src="../picture/cart_order.png">
			<p>订单</p>
		</a>
		<a :href="'./TicketUser.html?datetime='+Date.now()" class="footer">
			<!-- <i class="fa fa-user"></i> -->
			<img src="../picture/user.png">
			<p>我的</p>
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
	line-height: 50px;
	width:100%;
	overflow-x: hidden;
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
		width:33.3333%;
		color:$gray;
		height: 50px;
		line-height:50px;
		i{
			font-size:1.8rem;
		}
		img{
			width:22px;
			height:22px;
		}
		p{
			font-size:1.2rem;
			color:$gray;
			height:20px;
			line-height:20px;
		}
	}
	.footer.nopay{
		position:relative;
		p::after{
			content:"";
			position:absolute;
			top:2px;
			right:35%;
			height:10px;
			width:10px;
			background-color:$red;
			border-radius: 5px;
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
			refresh:""
		}
	},
	created(){
		this.refresh = "./ticket.html?datatime="+Date.now();
	},
	computed:{
		getfooter(){
			return this.$store.getters.getHeaderState;
			// return this.$store.getters.getHeaderState;
		},
		getNoPay(){
			return this.$store.getters.getNoPay;
		}
	},
	methods:{
		
	}
}
</script>