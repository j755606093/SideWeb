<template type="x/template">
	<div class="list" @click="goToTipDetail">
		<div class="list__header">
			<div class="header--avatar">
				<img :src="list.UserInfo.Headimgurl">
			</div>
			<div class="header--info">
				<span class="header--name">{{list.UserInfo.Nickname}}</span>
				<template v-if="list.UserInfo.Sex===1">
					<img src="../icon/man_icon.png">
				</template>
				<template v-else>
					<img src="../icon/women_icon.png">
				</template>
			</div>
			<div class="header--active">
				<template v-if="types===0">
					<span>请{{list.UserInfo.Sex===1?'他':'她'}}接我</span>
				</template>
				<template v-else>
					<span>去接{{list.UserInfo.Sex===1?'他':'她'}}</span>
				</template>
				<img src="../icon/into_icon.png">
			</div>
		</div>
		<div class="list__body">
			<div class="list__body--line">
				<div class="line__left">
					<img src="../icon/clock_icon.png">
				</div>
				<span class="line-time">{{list.BoardTime|formatTime}}</span>
				<template v-if="types===0">
					<span class="line-surplus">剩{{list.RemainingSeat}}空座</span>
				</template>
				<template v-else>
					<span class="line-surplus">需要{{list.Num}}个人座位</span>
				</template>
			</div>
			<div class="list__body--line">
				<div class="line__left--dot"></div>
				<span class="line__start--address">{{list.Spoint}}</span>
			</div>
			<div class="list__body--line">
				<div class="line__left--dot dot-red"></div>
				<span class="line__end--address">{{list.Epoint}}</span>
			</div>
		</div>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";

.list{
	background-color: #fff;
	width:100%;
	margin-top:10px;
	border-radius:5px;
}
.list__header{
	height:65px;
	@include display_flex('row');
	justify-content:flex-start;
	border-bottom: 1px solid #fafafa;
	width:100%;
	position:relative;
	.header--avatar{
		width:65px;
		height: 65px;
		@include display_flex('row');
		>img{
			width:35px;
			height:35px;
			border-radius:50px;
		}
	}
	div.header--info{
		@include display_flex('row');
		span.header--name{
			font-size:12px;
			color:rgb(50,50,50);
		}
		>img{
			width:10px;
			height:10px;
			margin-left:5px;
		}
	}
	div.header--active{
		position:absolute;
		top:0;
		right:10px;
		display: inline-block;
		height:65px;
		line-height: 65px;
		width:70px;
		text-align:right;
		>img{
			width:10px;
			height:10px;
			margin-left:5px;
		}
		>span{
			font-size:12px;
			color:rgb(200,200,200);
		}
	}
}
.list__body{
	height: 110px;
	@include display_flex('column');
	.list__body--line{
		flex:1;
		@include display_flex('row');
		justify-content:flex-start;
		width:100%;
		height:36.6666px;
		div.line__left{
			width:65px;
			height:36px;
			@include display_flex('row');
			>img{
				width:10px;
				height:10px;
			}
		}
		span.line-surplus{
			margin-left:17px;
			color:rgb(200,200,200);
		}
		div.line__left--dot{
			width:65px;
			height:36.6666px;
			position: relative;
			&:after{
				content:"";
				position:absolute;
				width:10px;
				height:10px;
				border-radius: 50%;
				background-color:$my_green;
				top:13px;
				left:28px;
			}
		}
		div.dot-red{
			&:after{
				background-color:$my_red;
			}
		}
	}
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";

export default {
	props:{
		list:{
			type:Object,
			default:function(){
				return {}
			}
		},
		types:{
			type:Number,
			default:0
		}
	},
	data () {
		return {
			
		}
	},
	created(){
		
	},
	computed:{
		
	},
	methods:{
		goToTipDetail(){
			this.$router.replace({path:`/detail/${this.types}/${this.list.Id}`});
		}
	},
	filters:{
		formatTime(time){
			const formatDate = new Date(time);//转换为DATE对象
			const Today = new Date();

			let text = ""

			if(Today.getDate()===formatDate.getDate()&&formatDate.getMonth()===Today.getMonth()){
				// 说明是今天
				text = "今天";
			}
			else{
				text = `${formatDate.getMonth()+1}月${formatDate.getDate()}号`;
			}

			text = `${text} (${Utils.formatWeek(formatDate)})`;
			text = `${text} ${formatDate.getHours()}:${formatDate.getMinutes()>9?formatDate.getMinutes():"0"+formatDate.getMinutes()}`;
			return text;
		}
	},
}
</script>