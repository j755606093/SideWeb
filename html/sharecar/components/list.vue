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
			<div class="header--active" v-if="nogo!=='true'">
				<!-- 是否显示右上角 -->
				<template v-if="isShowRight">
					<!-- 乘客 -->
					<template v-if="types===0">
						<template v-if="list.SDetail">
							<span>{{list.SDetail}}</span>
						</template>
						<template v-else>
							<span>请{{list.UserInfo.Sex===1?'他':'她'}}接我</span>
						</template>
					</template>
					<!-- 司机 -->
					<template v-else>
						<template v-if="list.SDetail">
							<span>{{list.SDetail}}</span>
						</template>
						<template v-else>
							<span>去接{{list.UserInfo.Sex===1?'他':'她'}}</span>
						</template>
					</template>
				</template>
				<img src="../icon/into_icon.png">
			</div>
		</div>
		<div class="list__body">
			<div class="list__body--line">
				<div class="line__left">
					<img src="../icon/clock_icon.png">
				</div>
				<div class="line__right">
					<span class="line-time">{{list.BoardTime|formatTime}}</span>
					<template v-if="types===0">
						<span class="line-surplus">剩{{list.RemainingSeat}}空座</span>
					</template>
					<template v-else>
						<span class="line-surplus">需要{{list.Num}}个座位</span>
					</template>
				</div>
			</div>
			<div class="list__body--line">
				<div class="line__left--dot"></div>
				<span class="line__start--address">{{list.Spoint.split("省")[1]?list.Spoint.split("省")[1]:list.Spoint}}</span>
			</div>
			<div class="list__body--line">
				<div class="line__left--dot dot-red"></div>
				<span class="line__end--address">{{list.Epoint.split("省")[1]?list.Epoint.split("省")[1]:list.Epoint}}</span>
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
	box-shadow: 0 3px 3px 3px #f5f5f5;
}
.list__header{
	height:65px;
	// @include display_flex('row');
	justify-content:flex-start;
	border-bottom: 1px solid #fafafa;
	width:100%;
	position:relative;
	>div{
		float:left;
		display:inline-block;
	}
	.header--avatar{
		width:65px;
		height: 65px;
		text-align:center;
		// @include display_flex('row');
		>img{
			width:35px;
			height:35px;
			border-radius:50px;
			margin-top:15px;
		}
	}
	div.header--info{
		height:65px;
		// @include display_flex('row');
		span.header--name{
			font-size:15px;
			color:rgb(50,50,50);
			margin-top:30px;
		}
		>img{
			width:10px;
			height:10px;
			margin-top:30px;
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
		width:80px;
		text-align:right;
		>img{
			width:10px;
			height:10px;
			margin-left:5px;
		}
		>span{
			font-size:15px;
			color:rgb(200,200,200);
		}
	}
}
.list__body{
	height: 110px;
	// @include display_flex('column');
	.list__body--line{
		flex:1;
		// @include display_flex('row');
		justify-content:flex-start;
		width:100%;
		height:36.6666px;
		position: relative;
		>div{
			display:inline-block;
			float:left;
		}
		div.line__left{
			width:65px;
			height:36.6666px;
			text-align:center;
			position: absolute;
			top:0;
			left:0;
			// @include display_flex('row');
			>img{
				width:10px;
				height:10px;
				position:absolute;
				width:10px;
				height:10px;
				top:13px;
				left:28px;
			}
		}
		.line__right{
			padding-left:65px;
			width:100%;
			// .line-time{
			// 	width:80%;
			// }
			.line-surplus{
				margin-top:10px;
			}
		}
		span{
			font-size: 14px;
			margin-top:8px;
			display:inline-block;
			@include text_nowrap;
			float:left;
		}
		span.line__start--address,span.line__end--address{
			padding-left:65px;
			width: 100%;
		}
		span.line-surplus{
			margin-left:10px;
			margin-top:0;
			color:#9e9e9e;
			font-size:12px;
			float:left;
			width: 20%;
			// position:absolute;
			// top:10px;
			// right:0;
			// text-align:left;
		}
		div.line__left--dot{
			width:65px;
			height:36.6666px;
			position: absolute;
			top:0;
			left:0;
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
		},//需要的数据
		nogo:{
			type:String,
			default:"false"
		},//是否可以点击和显示部分元素,默认可以点击
		types:{
			type:Number,
			default:0
		},//类型,有乘客类型和车主类型
		isShowRight:{
			type:Boolean,
			default:true
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
			if(this.nogo==="true"){
				return;
			}
			this.$router.push({ name: 'tripdetail', params: { types: this.types,tripId:this.list.Id }});
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