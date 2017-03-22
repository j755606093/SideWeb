<template type="x/template">
	<div id="publishtrip" class="publishtrip">
		<my-header :showBack="true" headerTitle="发布旅程"></my-header>
		<div class="swtich-role">
			<span @click="switchRole(0)" :class="{active:Role===0}">我是乘客</span>
			<span @click="switchRole(1)" :class="{active:Role===1}">我是司机</span>
		</div>
		<div class="publish animated slideInUp">
			<div class="publish__info">
				<div @click="startAddressPageShow" class="publish__info--line">
					<div class="line__left--dot"></div>
					<template v-if="Role===0">
						<span class="line__span--gray">上车地点</span>
					</template>
					<template v-else>
						<span class="line__span--gray">出发地点</span>
					</template>
				</div>
				<div @click="endAdress" class="publish__info--line">
					<div class="line__left--dot dot-red"></div>
					<span class="line__span--gray">你要去哪</span>
				</div>
				<div class="publish__info--line">
					<div class="line__left">
						<img src="../icon/clock_icon.png">
					</div>
					<span class="line__span--gray">今天周一</span>
				</div>
				<div class="publish__info--line">
					<div class="line__left">
						<img src="../icon/me_grey_icon.png">
					</div>
					<template v-if="Role===0">
						<span class="line__span--gray">默认1人</span>
					</template>
					<template v-else>
						<span class="line__span--gray">默认1座位</span>
					</template>
				</div>
			</div>
			<div class="publish__info--line box_shadow">
				<div class="line__left">
					<img src="../icon/phone_icon.png">
				</div>
				<input maxlength="11" class="phone" placeholder="联系电话必填" type="tel" name="phone">
			</div>
			<div style="margin-top:10px;" class="publish__info--line box_shadow">
				<div class="line__span">
					<span>备注:</span>
				</div>
				<input class="remark" placeholder="" type="text" name="remark">
			</div>
		</div>
		<mt-popup
		  v-model="PickerPageShow"
		  position="bottom"
		  class="mt_page">
		  <slot>
		  	<div class="popup-header">
			  	<span @click="cancelPicker">取消</span>
			  	<span>目的地</span>
			  	<span>下一步</span>
			  </div>
			  <mt-picker :visibleItemCount="5" valueKey="Name" :slots="startAddressSlot" @change="startValuesChange"></mt-picker>
		  </slot>
		</mt-popup>
	</div>
</template>

<style lang="sass">
@import "../../sass/utils.scss";
@import "./some.scss";
.publishtrip{
	margin-top:50px;
	.swtich-role{
		width:100%;
		@include display_flex('row');
		height:45px;
		line-height:45px;
		background-color:#fff;
		text-align: center;
		box-shadow: 0 3px 3px 3px #f5f5f5;
		>span{
			flex:1;
			width:50%;
			height:45px;
			line-height:45px;
			color:rgb(200,200,200);
			position:relative;
			font-size:14px;
			font-weight: 900;
		}
		>span.active{
			color:rgb(50,50,50);
			&:after{
				content:"";
				position:absolute;
				bottom:5px;
				left:44%;
				width:20px;
				background-color:$blue;
				height:4px;
			}
		}
	}
}
.publish{
	width:100%;
	padding:10px;
	.publish__info{
		width:100%;
		height:190px;
		background-color: #fff;
		padding:10px 0;
		border-radius:5px;
		margin-bottom: 10px;
		box-shadow: 0 3px 3px 3px #f5f5f5;
	}
	.publish__info--line{
		height:45px;
		line-height: 45px;
		border-radius:5px;
		@include display_flex('row');
		justify-content:flex-start;
		background-color:#fff;
		width:100%;
		div.line__left{
			width:65px;
			height:45px;
			@include display_flex('row');
			>img{
				width:10px;
				height:10px;
			}
		}
		div.line__span{
			width:65px;
			height:45px;
			text-align:right;
			// @include display_flex('row');
			span{
				height:45px;
				line-height:45px;
				font-size:14px;
				color:rgb(50,50,50);
				margin-right:5px;
			}
		}
		span{
			font-size: 14px;
		}
		span.line__span--gray{
			color:#c8c8c8;
		}
		input{
			display:block;
			// text-align:center;
			border:none;
			outline:none;
			height:45px;
			font-size:14px;
			// line-height:40px;
			width:60%;
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
.mt_page{
	width: 100%;
  height: 43%;
  background-color: #fff;
  overflow-y: scroll;
  .popup-header {
    height: 50px;
    width: 100%;
    line-height: 50px;
    background-color: #fff;
    color: $white;
    text-align: center;
    position: relative;
    span {
      display: inline-block;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      width: 60px;
      color:#000;
    }
    span:last-child {
      position: absolute;
      top: 0;
      right: 0;
      color:#c8c8c8;
      font-size: 12px;
    }
    span:first-child {
      position: absolute;
      top: 0;
      left: 0;
      color:#c8c8c8;
      font-size: 12px;
    }
  }
}
.animated{
	animation-duration: 0.4s;
}
</style>

<script type="text/babel">
import Utils from "../../Utils/utils";
import List from "./list.vue";
import Header from "./Header.vue";
import { Toast, Indicator, Popup,Picker } from 'mint-ui';

export default {
	data () {
		return {
			Role:0,//0是乘客,1是司机
			
			startAddress:"",//选择的上车地点
			PickerPageShow:false,//显示选择上车点
			startAddressSlot:[
				{
          flex: 1,
          values: ['广东省', '大石区', '广东省', '广州市', '广东省','礼村'],
          className: 'slot1',
          textAlign: 'left'
        }, {
          flex: 1,
          values: ['广州市', '大石区', '广州市', '大石区', '广州市','礼村'],
          className: 'slot2',
          textAlign: 'left'
        }, {
          flex: 1,
          values: ['大石区', '大石区', '大石区', '大石区', '大石区','礼村'],
          className: 'slot3',
          textAlign: 'left'
        }, {
          flex: 1,
          values: ['礼村', '礼村', '礼村', '礼村', '礼村','礼村' ],
          className: 'slot4',
          textAlign: 'left',
        }, 
			]

		}
	},
	created(){
		if(this.Province.length===0){
			// 如果没有数据就去获取
			this.$store.dispatch("getProvince",{
				Id:0,
				Type:0
			}).then(result=>{
				let data = [];
				this.Province.forEach((item,index)=>{
					
				})
				this.startAddressSlot[0].values = this.Province;
			})
		}
	},
	computed:{
		Province(){
			return this.$store.getters.getProvince;
		},
		City(){
			return this.$store.getters.getCity;
		},
		District(){
			return this.$store.getters.getDistrict;
		},
		Village(){
			return this.$store.getters.getVillage;
		},
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
		/** 切换页面选择角色 */
		switchRole(index){
			this.Role = index;
		},
		/** 选择上车地点 */
		startAddressPageShow(){
			this.PickerPageShow = true;
		},
		/** 取消显示 */
		cancelPicker(){
			this.PickerPageShow = false;
		},
		/** 值改变后的回调函数 */
		startValuesChange(picker, values){
			console.log(values);
		},
		/** 选择到达地点 */
		endAdress(){

		},
		
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
	components:{
		"my-header":Header,
		"mt-picker":Picker,
		"mt-popup":Popup
	}
}
</script>