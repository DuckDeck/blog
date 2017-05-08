<template>
    <div class="uptoTop" @click="uptoTop">
			 <el-tooltip class="item" effect="dark" content="回到顶部" placement="top-start">
				<i class="el-icon-arrow-up"></i>
			</el-tooltip>			
		</div>
</template>


<script>
    export default {
        data() {
            return{
              
            }
        },

        methods:{
           uptoTop(){
				var top = document.body.scrollTop || document.documentElement.scrollTop
				scrollBy(0,-top);
			}
        },
    }
</script>
<style scoped>
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
