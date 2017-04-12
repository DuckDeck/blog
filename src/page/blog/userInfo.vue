<template>
     <div class="container">    
            <div class="userInfoContent">
                 <div class="userMainPage">          
                    <div class="articleUserInfo">
                        <img :src="userInfo.user_image_url" class="userArticleHead" alt="">
                        <div class="articleUserDetail">
                            <div >
                                <span>{{userInfo.user_real_name}}</span> 
                                <i class="fa fa-venus userGender" v-show="userInfo.user_gender == '男'" aria-hidden="true"></i>
                                <i  class="fa fa-mars userGender" v-show="userInfo.user_gender != '男'" aria-hidden="true"></i>
                            </div>
                        <div>
                            <span>
                                <span>文章:{{userInfo.article_count}}</span>
                            </span>
                        </div>
                        </div>
                    
                    </div>
                     <el-tabs v-model="activeName" class="userInfoTab" type="border-card" @tab-click="handleClick">
                        <el-tab-pane   name="articles">
                            <span slot="label"><i class="fa fa-file-text"></i> 文章 </span>
                            

                       
                         </el-tab-pane>
                        <el-tab-pane  name="dynamic">
                            <span slot="label"><i class="el-icon-date"></i> 动态 </span>
                        </el-tab-pane>
                        <el-tab-pane  name="comment">
                            <span slot="label"><i class="fa fa-comment-o"></i> 评论 </span>
                        </el-tab-pane>
                        
                    </el-tabs>
                </div>
                <div class="articleUserInfoRight">
                    <div>
                        <div>
                            作者个人介绍
                        </div>
                        <div>
                            {{userInfo.user_description}}
                        </div>
                    </div>
                </div>
            </div>
           <upToTop></upToTop>
           <blogFoot></blogFoot>
        </div> 
</template>

<script>
import {getTargetUserInfo} from '../../store/service'
import blogHeader from './com/blogHead.vue'
import upToTop from './com/upToTop.vue'
import blogFoot from './com/blogFoot.vue'

//todo comment sort feature
  export default {
    data() {
      return {
          userInfo:{},
          activeName:'articles',
      }
    },
    mounted(){
        let id = this.$route.params.userId
        this.getTargetUserInfo(id)
    },
    methods:{
       async getTargetUserInfo(id){
           let res = await getTargetUserInfo(id)
           if(res.code == 0){
               this.userInfo = res.data
           }
           else{
               toast(this,res.cMsg)
           }
       },
       handleClick(tab,event){
                
       }
        
        
    },
    components:{
        blogHeader,upToTop,blogFoot
    },
    computed:{
        releaseDate(){
            // return  formatTime(new Date(this.userInfo.article_create_time))
        },
    }

  }
</script>
<style >
.userInfoContent{
    display: flex;
    margin-top: 60px;
}
.userMainPage{
   
   background: white;
   width: 70%;

}
.articleUserInfo{
    padding: 20px;
    display: flex;
    
}
.userArticleHead{
    width: 80px;
    height: 80px;
    border-radius: 40px;
}
.articleUserDetail{
    font-size: 20px;
    margin-left: 20px;
    margin-top: 15px;
}
.userGender{
    font-size: 17px;
    color: lightskyblue;
    margin-left: 5px;
}
.userInfoTab{
    font-size: 20px;
    background: white;
    margin-top: 20px;
}
.articleUserInfoRight{
    font-size: 15px;
    width: 30%;
    background: white;
    
}
</style>