<template>
	<div>
		<transition name="router-fade" mode="out-in">
    		<router-view></router-view>
    	</transition>
		<div class="uptoTop" @click="uptoTop">
			 <el-tooltip class="item" effect="dark" content="回到顶部" placement="top-start">
				<i class="el-icon-arrow-up"></i>
			</el-tooltip>			
		</div>
    </div>
</template>

<script>

  	export default {
    	methods:{
			uptoTop(){
				console.log('to top')
			}
		}
  	}

</script>

<style lang="scss">
  	@import './style/common';
	.router-fade-enter-active, .router-fade-leave-active {
	  	transition: opacity .3s;
	}
	.router-fade-enter, .router-fade-leave-active {
	  	opacity: 0;
	}
	.weui-toast.vux-toast-bottom{
		bottom:50px !important;
	}
	.pagination{
    margin: 20px 0;
    text-align: right;
	float: right;
}
 .featureTitle{
     font-size: 30px;
     margin-bottom: 10px;
 }
 .uptoTop{
	 position: fixed;
	 width: 50px;
	 height: 50px;
	 font-size: 40px;
	 left: 20px;
	 bottom: 20px;
	 color: deepskyblue;
	 
 }
 .uptoTop:hover{
	 cursor: pointer
 }
</style>
