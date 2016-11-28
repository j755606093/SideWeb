<template>
	<div id="detail">
		<post-header v-bind:header="header"></post-header>
		<post-content v-bind:content="content"></post-content>
		<post-comment v-bind:floor="floor"></post-comment>
		<downloadapp></downloadapp>
	</div>
</template>

<style lang="sass">
	#detail{
		padding-bottom:40px;
	}
</style>

<script type="text/babel">
import Utils from "./Utils/utils.js";
import PostHeader from "./components/PostHeader.vue";
import PostContent from "./components/PostContent.vue";
import PostComment from "./components/PostComment.vue";
import DownloadApp from "./components/DownloadApp.vue";

export default {
	props: ['Data'],
	data () {
		return {
			Id:"",
			header:{
				Avatar:"",
				CTime:"",
				UsrId:"",
				Nick:""
			},
			content:{
				Title:"",
				Content:"",
				ReadCount:0,
				CmtCount:0,
				CTime:""
			},
			floor:null
		}
	},
	created(){
		let postid = Utils.getQueryString("postid")||this.$route.params.postid;//也许是router进入的
		
		this.$http.get("http://192.168.31.86/api/Post/GetDetail/"+postid).then((res)=>{
			if(res.data.Code!==200){
				return;
			}
			let acceptData = res.data.Data;
			console.log(acceptData)
			this.Id = acceptData.Id;

			//header
			this.header.Avatar = acceptData.Avatar;
			this.header.CTime = acceptData.CTime;
			this.header.UsrId = acceptData.UsrId;
			this.header.Nick = acceptData.Nick;

			//content
			this.content.Title = acceptData.Title;
			this.content.Content = acceptData.Content;
			this.content.ReadCount = acceptData.ReadCount;
			this.content.CmtCount = acceptData.CmtCount;
			this.content.CTime = acceptData.CTime;

			//Floor
			this.floor = acceptData.Floor;
		}).catch((error)=>{
			console.log("error:",error)
		})
	},
	components:{
		"post-header":PostHeader,
		"post-content":PostContent,
		"post-comment":PostComment,
		"downloadapp":DownloadApp
	}
}
</script>