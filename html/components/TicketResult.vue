<template>
	<div class="result">
		<!-- 时间显示 -->
		<div class="date-control">
			<span class="font-blue" @click="gobackdate">前一天</span>
			<span v-text="startDate.date+' '+startDate.week"></span>
			<span class="font-blue"@click="gofrontdate">后一天</span>
		</div>
		<!-- 列表头部 -->
		<div class="data-set">
			<span :class="{'set':true,active:isShowTime}" @click="setShowTime"><i class="fa fa-glass"></i>时段</span>
			<span :class="{'set':true,active:isShowPosition}" @click="setShowPosition"><i class="fa fa-bus"></i>路线信息</span>
			<span :class="{'set':true,active:isShowList}" @click="sortTime"><i :class="['fa',arrow]"></i>票价</span>
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
						<!-- 点击查看路线 -->
						<p class="type" v-on:click.stop="showCompanyDeatil(index,$event)">
							<i class="fa fa-location-arrow"></i>{{item.Route}}
							<i class="fa fa-caret-down"></i>
						</p>
						<div class="show-router" v-show="routerDetailShow===index">
							<ul class="router">
								<span>始点:</span>
								<li :class="{active:list.NodeType===1}" v-for="list in item.SPoint" v-bind:key="index">{{list.Point}}</li>
								<span>终点:</span>
								<li :class="{active:list.NodeType===2}" v-for="list in item.EPoint" v-bind:key="index">{{list.Point}}</li>
							</ul>
						</div>
						<p>
							<span class="brand">终</span>{{item.EndPoint}}
						</p>
					</div>
					<div class="ticket-type">
						<p class="money" v-text="item.Price+'元'"></p>
						<p class="number" v-text="item.CoName"></p>
						<p class="type" v-text="item.TicketNum+'张余票'"></p>
					</div>
				</div>
			</transition-group>
			<!-- 提示公司详情 -->
			<!-- <mt-popup
			  v-model="companyDetailShow"
			  class="popup-visible"
			  popup-transition="popup-fade">
			  <p class="popup-header">{{showCompanyInfo.CoName}}</p>

			</mt-popup> -->
			<!-- 刷选列表数据 -->
			<div class="change-set" v-show="!isShowList">
				<!-- 时间段 -->
				<div class="set-time" v-show="isShowTime">
					<mt-checklist
					  v-model="getTimeOptionsValue"
					  :options="TimeOptions">
					</mt-checklist>
					<button class="btn" @click="queryTime">确定</button>
				</div>
				<!-- 运输公司 -->
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
import { Indicator,Toast } from 'mint-ui';
const _ = require("underscore");

export default {
	data () {
		return {
			startCity:"",
			endCity:"",
			getResultList:this.$store.getters.getResultList,//列表备份
			isShowList:true,
			isShowTime:false,
			isShowPosition:false,
			showNoData:false,
			routerDetailShow:false,//显示公司信息
			showCompanyInfo:{},//显示的公司信息
			arrow:"fa-caret-down",//默认票价排序图标
			TimeOptions:[
				{
			    label: '不限时间段',
			    value: '不限',
			    disabled: false
			  },
			  {
			    label: '早上(00:00-06:00)',
			    value: 6,
			    disabled: false
			  },
			  {
			    label: '上午(06:00-12:00)',
			    value: 12,
			    disabled: false
			  },
			  {
			    label: '下午(12:00-18:00)',
			    value: 18,
			    disabled: false
			  },
			  {
			    label: '晚上(18:00-24:00)',
			    value: 24,
			    disabled: false
			  },
			],
			PositionOptions:[
				{
					label: '不限',
			    value: '不限',
			    disabled: false
				},
				// {
				// 	label:"镇江汽车站",
				// 	value:"镇江汽车站",
				// 	disabled:false
				// },
				// {
				// 	label:"其它汽车站",
				// 	value:"其它汽车站",
				// 	disabled:false
				// }
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
		
		this.refresh();
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
						if(value.length<this.TimeOptionsValue.length){
							// 设置的值小于原来的值
							this.TimeOptionsValue = ["不限"];
						}
						else{
							this.TimeOptionsValue = value;
							this.TimeOptions[0].disabled = false;
						}
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
						if(value.length<this.PositionOptionsValue.length){
							// 设置的值小于原来的值
							this.PositionOptionsValue = ["不限"];
						}
						else{
							this.PositionOptionsValue = value;
							this.PositionOptions[0].disabled = false;
						}
					}
					if(value.length===this.PositionOptions.length){
						this.PositionOptions[0].disabled = false;
					}
				}
			},
			get(){
				return this.PositionOptionsValue;
			}
		},
		startDate(){
			return this.$store.getters.getInfo.startDate;
		},
		ResultBackUp(){
			return this.$store.getters.getResultList;
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
		refresh(){
			if(this.$store.getters.getResultList.length===0){
				// 没有数据
				this.showNoData = true;
				this.getResultList = [];
			}
			else{
				this.showNoData = false;
				this.PositionOptions = [{
					label: '不限',
			    value: '不限',
			    disabled: false
				}];//清空先
				// 准备运输公司信息
				this.getResultList.map((item)=>{
					this.PositionOptions.push({
						label:item.CoName,
						value:item.CoName,
						disabled:false
					})
				})
			}
		},
		queryTime(){
			//查找特定时间的车
			// console.log(this.TimeOptionsValue);
			// 如果this.TimeOptionsValue长度超过1位,那就需要去掉'不限'
			this.HideAll();
			this.isShowList = true;//显示列表
			
			let filter = this.TimeOptionsValue.slice(1);
			this.getResultList = _.filter(this.ResultBackUp,(item)=>{
				let hour =parseInt(item.StartTime.split(":")[0]);
				
				let n = false;
				for(let i=0;i<filter.length;i++){
					switch(filter[i]){
						case 6:
							if(hour<=6&&hour>=0){
								n = true;
							}
							break;
						case 12:
							if(hour<=12&&hour>6){
								n = true;
							}
							break;
						case 18:
							if(hour<=18&&hour>12){
								n = true;
							}
							break;
						case 24:
							if(hour<=24&&hour>18){
								n = true;
							}
							break;
					}
				}
				return n;
			});
			
			// 最后判断是否值选择了一个不限
			if(this.TimeOptionsValue.length===1&&this.getResultList.length===0){
				// 长度为一
				this.getResultList = this.ResultBackUp;
			}
		},
		queryPosition(){
			// 查找查找
			// 如果this.PositionOptionsValue长度超过1位,那就需要去掉'不限'
			this.HideAll();
			this.isShowList = true;//显示列表
			// console.log(this.getResultList)
			let filter = this.PositionOptionsValue.slice(1);
			this.getResultList = _.filter(this.ResultBackUp,(item)=>{
				let n =false;
				for(let i=0;i<filter.length;i++){
					if(item.CoName===filter[i]){
						n=true;
					}
				}
				return n;
			});

			if(this.PositionOptionsValue.length===1&&this.getResultList.length===0){
				// 长度为一
				this.getResultList = this.ResultBackUp;
			}
		},
		GoToPay(index){
			// 存储用户点击的列表
			this.$store.dispatch("setBusInfo",this.getResultList[index]);
			// 去支付页面
			this.$router.push({name:"ticketpay"});
		},
		sortTime(){
			let data = Utils.formatJsonData(this.getResultList);
			if(this.arrow==="fa-caret-down"){
				data.sort((a,b)=>{
					return b.Price-a.Price;
				});
				this.arrow = "fa-caret-up";
			}
			else{
				data.sort((a,b)=>{
					return a.Price-b.Price;
				});
				this.arrow = "fa-caret-down";
			}

			this.getResultList = data;
		},
		showCompanyDeatil(index,event){
			//显示路线详情
			if(index===this.routerDetailShow){
				this.routerDetailShow = -1;
			}
			else{
				this.routerDetailShow = index;
			}
			
			// this.showCompanyInfo = this.getResultList[index];
			// console.log(index)
		},
		gobackdate(){
			//前一天的车票信息
			let now =new Date(this.$store.getters.getInfo.startDate.server).getTime();
			let back = new Date(now - 1000*60*60*24);//昨天
			// 检查日期
			if(Date.now()>now){
				// 当前日期大于昨天的日期(不允许查过期的车票)
				Toast({
				  message: "无法查询过期的信息...",
				  position: 'bottom',
				  duration: 3000
				});
				return;
			}
			//开始加载数据
			Indicator.open({
				text: '加载中...',
				spinnerType: 'double-bounce'
			});

			this.$store.dispatch("setStartDate",{
				date:Utils.formatDateTypeOne(back),
				week:Utils.formatWeek(back),
				server:back,//设置时间为昨天
			});

			this.$store.dispatch("setResultList").then((data)=>{
				Indicator.close();
				this.getResultList = data;
				this.refresh();
			}).catch(error=>{
				Indicator.close();
				Toast({
				  message: "服务器错误,请稍后重试...",
				  position: 'bottom',
				  duration: 3000
				});
			});
		},
		gofrontdate(){
			//后一天的车票信息
			Indicator.open({
				text: '加载中...',
				spinnerType: 'double-bounce'
			});

			let now =new Date(this.$store.getters.getInfo.startDate.server).getTime();
			let back = new Date(now + 1000*60*60*24);//昨天
			this.$store.dispatch("setStartDate",{
				date:Utils.formatDateTypeOne(back),
				week:Utils.formatWeek(back),
				server:back,//设置时间为昨天
			});

			this.$store.dispatch("setResultList").then((data)=>{
				Indicator.close();
				this.getResultList = data;
				this.refresh();
			}).catch(error=>{
				Indicator.close();
				Toast({
				  message: "服务器错误,请稍后重试...",
				  position: 'bottom',
				  duration: 3000
				});
			});
		}
	}
}
</script>