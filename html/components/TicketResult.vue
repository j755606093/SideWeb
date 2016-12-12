<template>
	<div class="result">
		<!-- 时间显示 -->
		<div class="date-control">
			<span class="font-blue">前一天</span>
			<span v-text="startDate.date+' '+startDate.week"></span>
			<span class="font-blue">后一天</span>
		</div>
		<!-- 列表头部 -->
		<div class="data-set">
			<span :class="{'set':true,active:isShowTime}" @click="setShowTime"><i class="fa fa-glass"></i>时段</span>
			<span :class="{'set':true,active:isShowPosition}" @click="setShowPosition"><i class="fa fa-car"></i>车站</span>
			<span :class="{'set':true,active:isShowList}" @click="sortTime"><i class="fa fa-caret-down"></i>出发时间</span>
		</div>
		<div class="result-list">
			<!-- 列表数据 -->
			<transition-group name="list-complete" tag="div" class="lists" v-show="isShowList">
				<!-- 循环显示列表 -->
				<div class="list list-complete-item" @click="GoToPay(index)" v-for="(item,index) in getResultList" v-bind:key="index">
					<span class="data" v-text="item.StartTime.slice(0,item.StartTime.length-3)"></span>
					<div class="car-position">
						<p>
							<span class="brand">始</span>{{item.StartPoint}}
						</p>
						<p>
							<span class="brand">终</span>{{item.EndPoint}}
						</p>
					</div>
					<div class="ticket-type">
						<p class="money" v-text="item.Price+'元'"></p>
						<p class="number" v-text="item.Route"></p>
						<p class="type" v-text="item.CoName"></p>
					</div>
				</div>
			</transition-group>
			<!-- 刷选列表数据 -->
			<div class="change-set" v-show="!isShowList">
				<div class="set-time" v-show="isShowTime">
					<mt-checklist
					  v-model="getTimeOptionsValue"
					  :options="TimeOptions">
					</mt-checklist>
					<button class="btn" @click="queryTime">确定</button>
				</div>
				<div class="set-position" v-show="isShowPosition">
					<mt-checklist
					  v-model="getPositionOptionsValue"
					  :options="PositionOptions">
					</mt-checklist>
					<button class="btn" @click="queryPosition">确定</button>
				</div>
			</div>
			<!-- 没有更多数据 -->
			<div class="no-data" v-if="showNoData">
				<p>没有更多数据...</p>
			</div>
		</div>
	</div>
</template>

<style lang="css">
@import "../css/ticketresult.css";
.list-complete-item {
  transition: all 1s;
  display: inline-block;
}
.list-complete-enter, .list-complete-leave-active {
  opacity: 0;
  transform: translateY(30px);
}
.list-complete-leave-active {
  position: absolute;
}
</style>

<script type="text/babel">
import { mapGetters } from 'vuex'
import Utils from "../Utils/utils";
const _ = require("underscore");

export default {
	data () {
		return {
			startCity:"",
			endCity:"",
			startDate:this.$store.getters.getInfo.startDate,
			getResultList:this.$store.getters.getResultList,
			isShowList:true,
			isShowTime:false,
			isShowPosition:false,
			showNoData:false,
			TimeOptions:[
				{
			    label: '不限时间段',
			    value: '不限',
			    disabled: false
			  },
			  {
			    label: '早上(00:00-06:00)',
			    value: '早上',
			    disabled: false
			  },
			  {
			    label: '上午(06:00-12:00)',
			    value: '上午',
			    disabled: false
			  },
			  {
			    label: '下午(12:00-18:00)',
			    value: '下午',
			    disabled: false
			  },
			  {
			    label: '晚上(18:00-24:00)',
			    value: '晚上',
			    disabled: false
			  },
			],
			PositionOptions:[
				{
					label: '不限',
			    value: '不限',
			    disabled: false
				},
				{
					label:"镇江汽车站",
					value:"镇江汽车站",
					disabled:false
				},
				{
					label:"其它汽车站",
					value:"其它汽车站",
					disabled:false
				}
			],
			TimeOptionsValue:["不限"],//结果
			PositionOptionsValue:["不限"],//结果
		}
	},
	created(){
		if(this.$store.getters.getResultList===null){
			//数据为空,一般是直接进入这个页面才会这样
			this.$router.replace({path:"/home/ticketbody"})
		}
		this.startCity = this.$store.state.tickets.startCity;
		this.endCity = this.$store.state.tickets.endCity;
		// console.log(this.getResultList)
		//设置头部标题
		this.$store.commit("CHANGE_HEADER",{isHome:false,Title:this.startCity.Name+" 到 "+this.endCity.Name});
		
		if(this.$store.getters.getResultList.length===0){
			// 没有数据
			this.showNoData = true;
		}
		else{
			this.showNoData = false;
		}
	},
	computed:{
		getStartCity(){
			return this.$store.getters.getInfo.startCity.Name;
		},
		getEndCity(){
			return this.$store.getters.getInfo.endCity.Name;
		},
		// getResultList(){
		// 	return this.$store.getters.getResultList;
		// },
		getTimeOptionsValue:{
			set(value){
				if(value.length===0){
					this.TimeOptionsValue = ["不限"];
				}
				else{
					if(value.indexOf("不限")>-1&&value.length!==1){
						// 有不止不限的选项
						this.TimeOptionsValue = value;
						this.TimeOptions[0].disabled = true;
					}
					else{
						this.TimeOptionsValue = value;
						this.TimeOptions[0].disabled = false;
					}
					if(value.length===this.TimeOptions.length){
						this.TimeOptions[0].disabled = false;
					}
				}
			},
			get(){
				return this.TimeOptionsValue;
			}
		},
		getPositionOptionsValue:{
			set(value){
				if(value.length===0){
					this.PositionOptionsValue = ["不限"];
				}
				else{
					if(value.indexOf("不限")>-1&&value.length!==1){
						// 有不止不限的选项
						this.PositionOptionsValue = value;
						this.PositionOptions[0].disabled = true;
					}
					else{
						this.PositionOptionsValue = value;
						this.PositionOptions[0].disabled = false;
					}
					if(value.length===this.PositionOptions.length){
						this.PositionOptions[0].disabled = false;
					}
				}
			},
			get(){
				return this.PositionOptionsValue;
			}
		}
	},
	methods:{
		setList(){
			//隐藏显示列表
			this.isShowList = !this.isShowList;
		},
		HideAll(){
			this.isShowList = false;//隐藏列表
			//隐藏其他的tab
			this.isShowTime = false;
			this.isShowPosition = false;
		},
		setShowTime(){
			this.HideAll();
			this.isShowTime = true;
		},
		setShowPosition(){
			this.HideAll();
			this.isShowPosition = true;
		},
		queryTime(){
			//查找特定时间的车
			// console.log(this.TimeOptionsValue);
			// 如果this.TimeOptionsValue长度超过1位,那就需要去掉'不限'
			this.HideAll();
			this.isShowList = true;//显示列表
		},
		queryPosition(){
			// 查找查找
			// 如果this.PositionOptionsValue长度超过1位,那就需要去掉'不限'
			this.HideAll();
			this.isShowList = true;//显示列表
		},
		GoToPay(index){
			// 存储用户点击的列表
			this.$store.dispatch("setBusInfo",this.getResultList[index]);
			// 去支付页面
			this.$router.push({name:"ticketpay"});
		},
		sortTime(){
			this.getResultList = _.shuffle(this.getResultList);
		}
	}
}
</script>