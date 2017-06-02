<template>
		<transition name="router-fade" mode="out-in">
			<div style="overflow: hidden">
				<blogHeader v-show="needShow" ></blogHeader>
				<router-view></router-view>
			</div>
    	</transition>
</template>
<script>
import blogHeader from './page/blog/com/blogHead.vue'
  export default {
    data() {
      return {
          needShow:true
      }
    },
    async mounted(){
        this.$router.beforeEach((to, from, next) => {
           if( to.path == '/login' 
           || to.path.indexOf('manage') >= 0 
           || to.path == '/register' 
           || to.path.indexOf('active') >= 0 
           || to.path.indexOf('password') >= 0
           || to.name == 'notfound'){
               this.needShow = false
           }
           else{
               this.needShow = true
           }
           next()
        })
        let index1 = location.href.toString().indexOf('login')
        let index2 = location.href.toString().indexOf('manage')
        let index3 = location.href.toString().indexOf('register')
        let index4 = location.href.toString().indexOf('active')
        let index5 = location.href.toString().indexOf('password')
        if(index1 >=0 || index2 >= 0 || index3 >= 0 || index4 >= 0 || index5 >= 0){
             this.needShow = false
        }
       if(manageId == null){
            toast("你的登录已经失效，请重新登录")
            this.$router.replace("/managelogin")
       }
       if(userId == null){
            toast("你的登录已经失效，请重新登录")
            this.$router.replace("/")
       }
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
