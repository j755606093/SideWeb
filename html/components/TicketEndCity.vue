<template>
	<mt-index-list class="absolute">
	  <mt-index-section index="A">
	    <mt-cell title="Aaron"></mt-cell>
	    <mt-cell title="Alden"></mt-cell>
	    <mt-cell title="Austin"></mt-cell>
	  </mt-index-section>
	  <mt-index-section index="B">
	    <mt-cell title="Baldwin"></mt-cell>
	    <mt-cell title="Braden"></mt-cell>
	  </mt-index-section>
	  <mt-index-section index="Z">
	    <mt-cell title="Zack"></mt-cell>
	    <mt-cell title="Zane"></mt-cell>
	  </mt-index-section>
	</mt-index-list>
</template>

<style lang="sass">
@import "../sass/utils.scss";
.absolute{
	position:absolute;
}
</style>

<script type="text/babel">
import { mapGetters } from 'vuex'
import Utils from "../Utils/utils";

export default {
	data () {
		return {
			
		}
	},
	created(){
		this.$store.dispatch("ChangeHeader",{isHome:false,Title:"选择到达地"});
	},
	computed:{
		
	},
	methods:{
		
	}
}
</script>