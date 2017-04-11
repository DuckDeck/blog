<template>
	
		<transition name="router-fade" mode="out-in">
			<div style="overflow: hidden">
				<blogHeader :userInfo = "userInfo"></blogHeader>
				<router-view></router-view>
			</div>
    		
    	</transition>
  
</template>
<script>
import blogHeader from './page/blog/com/blogHead.vue'
  export default {
    data() {
      return {
          userInfo:{},
         
      }
    },
    async mounted(){
        let self= this
        if(getStore('userInfo')){
            this.isLogin = true
            this.userInfo = getStore('userInfo')
        }
    },
    methods:{
        headAction(action){
            if(action == 'login'){
                this.$router.push('/login')
            }
            else if(action == 'logout'){
                this.userInfo =  {}
            }
        },
    },
    components:{
        blogHeader
    },
 

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

</style>
