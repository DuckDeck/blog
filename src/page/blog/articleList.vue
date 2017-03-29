<template>

     <div class="container">
        <div class="row">         
            <blogHeader  :userInfo = "userInfo"  @headAction="headAction"></blogHeader>      
            <div class="main-page">          
                <blogSide ></blogSide>
                    <div class="content-main"> 
                         <div class=" article-content">
                             
                         </div>
                  </div>
                </div>
             </div>
        </div> 
</template>

<script>
import {articleById,submitComment,getComment} from '../../store/service'
import blogHeader from './com/blogHead.vue'
import blogSide from './com/blogSide.vue'
import writeComment from './com/writeComment.vue'
import userComment from './com/userComment.vue'
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
        
        
        
    },
    methods:{
       
       
    },
    components:{
        blogHeader,blogSide,writeComment,userComment
    },
    computed:{
        
    }

  }
</script>
<style >

  
</style>