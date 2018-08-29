<template>
    <div  @click="reload" style="text-align:center" >
			<img src="/static/img/tear.gif" alt="">	
            <div style="font-size:30px" >没有数据</div>
	</div>
</template>
<script>
    export default {
        data() {
            return{
              
            }
        },

        methods:{
           reload(){
				this.$emit("reload")
			}
        },
    }
</script>
<style scoped>
 
</style>
