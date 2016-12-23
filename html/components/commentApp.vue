<template>
	<post-comment v-bind:floor="floor"></post-comment>
</template>

<style lang="sass">

</style>

<script type="text/babel">
const _ = require("underscore");
import Utils  from "../Utils/utils";
import PostComment from "./PostComment.vue";

export default {
	data () {
		return {
			id:"",//url上的文章id
			index:1,
			size:10,
			noComment:false,//没有更多的评论
			floor:null,//
		}
	},
	created(){
		this.id = Utils.getQueryString("id");
		
		this.getComment();
	},
	filters:{
		
	},
	watch:{
		
	},
	computed:{

	},
	methods:{
		getComment(){
			console.log("yes")
			if(this.noComment){
				// 没有更多的数据
				return;
			}
			this.$http.post("http://192.168.31.86/api/Wechat/GetCmts",{
				Id:this.id,
				Index:this.index,
				Size:this.size
			}).then((res)=>{
				if(res.data.Code!==200){
					return;
				}
				if(res.data.Data.length<9){
					// 说明没有数据了
					this.noComment = true;
				}
				else{
					this.index++;//页数自增
				}
				
				let acceptData = res.data.Data;
				console.log(acceptData);

				//Floor
				this.floor = acceptData;
			},(error)=>{
				console.log(error)
			})
		}
	},
	components:{
		"post-comment":PostComment,
	}
}
</script>