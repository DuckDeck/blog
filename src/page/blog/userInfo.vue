<template>
     <div class="container">    
            <div class="main-page">          
                   <div class="articleUserInfo">
                        <img :src="userInfo.user_image_url" class="userArticleHead" alt="">
                        <div class="articleUserDetail">
                            <div>
                                <span class="articleAuthorTag">作者</span> <span>{{userInfo.user_real_name}}</span>
                            </div>
                            <div class="articleReleaseTime">
                                <span>发布于:{{articleReleaseTime}}  </span> <span>  文章数{{userInfo.article_count}}</span>
                            </div>
                        </div>
                </div>
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
.main-page{
   margin-top: 60px;
   background: white;
}
</style>