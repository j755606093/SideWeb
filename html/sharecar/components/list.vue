<template type="x/template">
	<div class="list" @click="goToTipDetail">
		<!-- 头部 -->
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
			<div @click.stop="closeTrip" class="header--active" v-if="nogo!=='true'">
				<!-- 是否显示右上角 -->
				<template v-if="isShowRight">
					<!-- 乘客 -->
					<template v-if="types===0">
						<!-- <template v-if="list.Distance">
							<span>{{list.Distance|formatDistance}}</span>
						</template> -->
						<!-- <template v-else> -->
							<span>请{{list.UserInfo.Sex===1?'他':'她'}}接我</span>
						<!-- </template> -->
					</template>
					<!-- 司机 -->
					<template v-else>
						<!-- <template v-if="list.Distance">
							<span>{{list.Distance|formatDistance}}</span>
						</template>
						<template v-else> -->
							<span>去接{{list.UserInfo.Sex===1?'他':'她'}}</span>
						<!-- </template> -->
					</template>
				</template>
				<template v-if="isMe">
					<span>关闭行程</span>
				</template>
				<img src="../icon/into_icon.png">
			</div>
		</div>
		<!-- 主体 -->
		<div class="list__body">
			<!-- 时间行 -->
			<div class="list__body--line">
				<div class="line__left">
					<img src="../icon/clock_icon.png">
				</div>
				<div class="line__right">
					<span class="line-time">{{list.BoardTime|formatTime}}</span>
					<div class="other--info">
						<img src="../icon/me_grey_icon.png">
						<template v-if="types===0">
							<span class="line-surplus">{{list.RemainingSeat}}空座</span>
						</template>
						<template v-else>
							<span class="line-surplus">{{list.Num}}个人</span>
						</template>
					</div>
				</div>
			</div>
			
			<!-- 如果是详细信息 -->
			<template v-if="isDetail">
				<!-- 一行 -->
				<div class="list__body--line height">
					<div class="line__left--dot">
						<span>起点</span>
					</div>
					<div class="line__right--address">
						<span class="line__start--address">{{list.StartDetail.Name}}</span>
						<span class="line__start--address">{{list.StartDetail.Province+list.StartDetail.City+list.StartDetail.District+list.StartDetail.Name+(list.StartDetail.Address?list.StartDetail.Address:'')}}</span>
					</div>
				</div>
				<!-- 一行 -->
				<div class="list__body--line height">
					<div class="line__left--dot dot-red">
						<span>终点</span>
					</div>
					<div class="line__right--address">
						<span class="line__start--address">{{list.EndDetail.Name}}</span>
						<span class="line__start--address">{{list.EndDetail.Province+list.EndDetail.City+list.EndDetail.District+list.EndDetail.Name+(list.EndDetail.Address?list.EndDetail.Address:'')}}</span>
					</div>
				</div>
				<div style="clear:both;"></div>
			</template>
			<template v-else>
				<!-- 一行 -->
				<div class="list__line">
					<div class="line__left--dot">
						<span class="green">起点</span>
					</div>
					<div class="line__right--address">
						<span>{{list.StartDetail.Province+list.StartDetail.City+list.StartDetail.District}}</span>
					</div>
				</div>
				<!-- 一行 -->
				<div class="list__line">
					<div class="line__left--dot dot-red">
						<span class="red">终点</span>
					</div>
					<div class="line__right--address">
						<span>{{list.EndDetail.Province+list.EndDetail.City+list.EndDetail.District}}</span>
					</div>
				</div>
				<div style="clear:both;"></div>
			</template>
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
	padding-bottom: 10px;
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
		width:110px;
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
	min-height: 110px;
	// 双行
	.list__body--line{
		width:100%;
		height:36.6666px;
		position: relative;
		>div{
			display:inline-block;
			float:left;
		}
		div.line__left{
			width:50px;
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
				left:20px;
			}
		}
		.line__right{
			padding-left:50px;
			width:100%;
			position:relative;
			height:36.6666px;
			span.line-time{
				float:left;
				font-size: 14px;
				margin-top:8px;
				display:inline-block;
			}
			div.other--info{
				position:absolute;
				top:0;
				right:10px;
				width:60px;
				height:36.6666px;
				line-height:40px;
				>img{
					width:10px;
					height:10px;
					position:absolute;
					top:13px;
					left:10px;
				}
				span.line-surplus{
					position:absolute;
					top:0;
					right:0;
					font-size:14px;
					margin-top:0;
					height:36.6666px;
					line-height:36.6666px;
				}
			}
		}
		div.line__left--dot{
			width:50px;
			position: absolute;
			top:20%;
			left:0;
			text-align:center;
			@include display_flex('row');
			// min-height:60px;
			>span{
				flex:1;
				color:$my_green;
				font-size:12px;
				float:none;
				// line-height:60px;
				display:inline-block;
			}
		}
		div.dot-red{
			>span{
				color:$my_red;
				font-size:12px;
			}
		}
		div.line__right--address{
			width: 100%;
			// min-height:60px;
			padding:5px 0;
			padding-left:50px;
			@include display_flex('column');
			>span{
				flex:1;
				display:block;
				word-break:break-all;
				// @include text_nowrap;
				// height:25px;
				width: 100%;
				font-size: 14px;
				// line-height:25px;
				&:last-child{
					font-size:12px;
					color:#c8c8c8;
				}
			}
		}
	}
	// 单行
	.list__line{
		width:100%;
		height:36.6666px;
		position: relative;
		>div{
			display:inline-block;
			float:left;
		}
		div.line__left--dot{
			width:50px;
			// height:36.6666px;
			text-align:center;
			position: absolute;
			top:0;
			left:0;
			height:100%;
			@include display_flex('row');
			>span.green{
				color:$my_green;
				font-size:12px;
				height:36.6666px;
				line-height:36.6666px;
				font-weight: 900;
			}
			>span.red{
				color:$my_red;
				font-size:12px;
				height:36.6666px;
				line-height:36.6666px;
				font-weight: 900;
			}
		}
		.line__right--address{
			padding-left:50px;
			width:100%;
			height:36.6666px;
			line-height:36.6666px;
			>span{
				font-size:14px;
			}
		}
	}
	.list__body--line.height{
		min-height: 60px;
		// float: left;
	}
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import { MessageBox,Toast,Indicator } from 'mint-ui';

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
		},
		isDetail:{
			type:Boolean,
			default:false
		},//是否显示详细信息
		isMe:{
			type:Boolean,
			default:false
		},//是否本人自己的数据
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
		toast(title) {
			Toast({
				message: title,
				position: 'bottom',
				duration: 3000
			});
		},
		/** 加载动画(需要手动关闭) */
		loading() {
			Indicator.open({
				spinnerType: 'fading-circle'
			});
		},
		goToTipDetail(){
			if(this.nogo==="true"){
				return;
			}
			this.$router.push({ name: 'tripdetail', params: { types: this.types,tripId:this.list.Id }});
		},
		closeTrip(){
			if(this.isMe){
				// 可以相应关闭
				MessageBox.confirm('确定执行此操作?').then(action => {
					this.loading();
					if(this.types===0){
						this.$store.dispatch("deletePassengerTrip",{
							Id:this.list.Id,
							Status:0
						}).then(result=>{
							this.$store.dispatch("clearMyPublish",this.list.Id);
							Indicator.close();
							this.toast(result.Message);
						})
					}
					else{
						this.$store.dispatch("deleteCarTrip",{
							Id:this.list.Id,
							Status:0
						}).then(result=>{
							this.$store.dispatch("clearMyPublish",this.list.Id);
							Indicator.close();
							this.toast(result.Message);
						})
					}
				}).catch(error=>{
					Indicator.close();
					console.log(error)
				});
			}
			else{
				this.goToTipDetail();
			}
		},
		formatWeek(date){
			let week = ["日","一","二","三","四","五","六"];
			return "周"+week[date.getUTCDay()];
		}
	},
	filters:{
		formatTime(time){
			const formatDate = new Date(time);//转换为DATE对象
			const Today = new Date();
			const week = ["日","一","二","三","四","五","六"];

			let text = ""

			if(Today.getUTCDate()===formatDate.getUTCDate()&&formatDate.getUTCMonth()===Today.getUTCMonth()){
				// 说明是今天
				text = "今天";
			}
			else{
				text = `${formatDate.getUTCMonth()+1}月${formatDate.getUTCDate()}号`;
			}

			text = `${text} (周${week[formatDate.getUTCDay()]})`;
			text = `${text} ${formatDate.getUTCHours()}:${formatDate.getUTCMinutes()>9?formatDate.getUTCMinutes():"0"+formatDate.getUTCMinutes()}`;
			return text;
		},
		formatDistance(item){
			let distance = parseFloat(item);
			if(isNaN(distance)){
				return "未知距离"
			}
			else{
				return distance.toFixed(2)+"公里";
			}
		}
	},
}
</script>