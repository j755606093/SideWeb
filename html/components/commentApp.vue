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
		}
	},
	created(){
		this.id = Utils.getQueryString("id");
		
		this.$http.get("http://192.168.31.86/api/Post/GetDetail/"+this.id).then((res)=>{
			if(res.data.Code!==200){
				return;
			}
			let acceptData = res.data.Data;
			console.log(acceptData);

			//Floor
			this.floor = acceptData.Floor;
		}).catch((error)=>{
			console.log("error:",error)
		})
	},
	filters:{
		
	},
	watch:{
		
	},
	computed:{

	},
	methods:{
		
	},
	components:{
		"post-comment":PostComment,
	}
}
</script>