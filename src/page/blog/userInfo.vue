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
                     <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                        <el-tab-pane label="文章详情" name="articleDetail">
                            <header>
            
                            <div class="articleInfoClass">
                                发布于<span>{{releaseDate}}</span>  <span>  {{articleDetail.sort_name}}</span> <span>  {{articleDetail.article_click}}</span>浏览
                            </div>
                            <div  class="articleTagClass">
                                    <el-tag  v-for="t in articleDetail.tags"   type="primary"  >{{t.tag_name}}</el-tag>
                            </div>
                        </header>
                        <div class="articleSeperateLine"></div>
                        <article class="articleContentClass" v-html = "articleDetail.article_content"></article>
                    </el-tab-pane>
                        <el-tab-pane label="作者信息" name="authorInfo">
                            <userInfoShow :userInfo ="userInfo" ></userInfoShow>
                        </el-tab-pane>
                        <el-tab-pane label="文章评论" name="third">
                        <comment v-for="comment in comments" :comment = "comment"></comment>
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

    display: flex;
    
}
.userArticleHead{
    width: 100px;
    height: 100px;
    border-radius: 50px;
}
.articleUserDetail{
    font-size: 20px;
    margin-left: 20px;
    margin-top: 20px;
}
.userGender{
    font-size: 17px;
    color: lightskyblue;
    margin-left: 5px;
}
.articleUserInfoRight{
    font-size: 15px;
    width: 30%;
    background: white;
}
</style>