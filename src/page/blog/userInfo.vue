<template>
     <div class="container">
          <blogHeader  :userInfo = "articleUserInfo"  @headAction="headAction"></blogHeader>      
            <div class="main-page">          
                   
            </div>
           <upToTop></upToTop>
           <blogFoot></blogFoot>
        </div> 
</template>

<script>
import {articleById,submitComment,getComment} from '../../store/service'
import blogHeader from './com/blogHead.vue'
import upToTop from './com/upToTop.vue'
import blogFoot from './com/blogFoot.vue'

//todo comment sort feature
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
        
        let id = this.$route.params.userId
        
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
        blogHeader,upToTop,blogFoot
    },
    computed:{
        releaseDate(){
            //return  formatTime(new Date(this.article.article_create_time))
        },
    }

  }
</script>
<style >

</style>