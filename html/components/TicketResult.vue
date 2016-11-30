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
			<span class="set"><i class="fa fa-glass"></i>时段</span>
			<span class="set"><i class="fa fa-car"></i>车站</span>
			<span class="set active"><i class="fa fa-caret-down"></i>出发时间</span>
		</div>
		<div class="result-list">
			<!-- 列表数据 -->
			<div class="lists">
				<!-- 循环显示列表 -->
				<div class="list" v-for="item in getResultList">
					<span class="data" v-text="item.fromTime"></span>
					<div class="car-position">
						<p>
							<span class="brand">始</span>{{item.fromStationName}}
						</p>
						<p>
							<span class="brand">终</span>{{item.fromStationName}}
						</p>
					</div>
					<div class="ticket-type">
						<p class="money" v-text="item.fullPrice+'元'"></p>
						<p class="number" v-text="item.showTicketInfo"></p>
						<p class="type" v-text="item.busType"></p>
					</div>
				</div>
			</div>
			<!-- 刷选列表数据 -->
			<div class="change-set">
				<p>你好</p>
			</div>
		</div>
	</div>
</template>

<style lang="sass">
@import "../css/ticketresult.css";
</style>

<script type="text/babel">
import { mapGetters } from 'vuex'
import Utils from "../Utils/utils";

export default {
	data () {
		return {
			startCity:"",
			endCity:"",
			startDate:this.$store.getters.getInfo.startDate
		}
	},
	created(){
		this.startCity = this.$store.state.tickets.startCity;
		this.endCity = this.$store.state.tickets.endCity;
		// console.log(this.getResultList)
		//设置头部标题
		this.$store.commit("CHANGE_HEADER",{isHome:false,Title:this.startCity.Name+" 到 "+this.endCity.Name});
	},
	computed:{
		getStartCity(){
			return this.$store.getters.getInfo.startCity.Name;
		},
		getEndCity(){
			return this.$store.getters.getInfo.endCity.Name;
		},
		getResultList(){
			return this.$store.getters.getResultList;
		}
	},
	methods:{
		setTime(){
			this.isShowList = !this.isShowList;
		}
	}
}
</script>