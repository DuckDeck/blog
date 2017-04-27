<template>
     <div class="container">    
            <div class="userInfoContent">
                 <div class="userMainPage">          
                    <div class="articleUserInfo">
                        <img :src="userInfo.user_image_url" class="userArticleHead" alt="">
                        <div class="articleUserDetail">
                            <div >
                                <span style="font-weight: bold">{{userInfo.user_real_name}}</span> 
                                <i class="fa fa-venus userGender" v-show="userInfo.user_gender == '男'" aria-hidden="true"></i>
                                <i  class="fa fa-mars userGender" v-show="userInfo.user_gender != '男'" aria-hidden="true"></i>
                            </div>
                        <div>
                            <span>
                                <span>文章:{{userInfo.article_count}}</span>
                            </span>
                        </div>
                            
                        </div>
                       <button v-show="isMine" @click="writeArticle" class="writeArticle">写文章</button>
                    </div>
                     <el-tabs v-model="activeName" class="userInfoTab" type="border-card" @tab-click="handleClick">
                        <el-tab-pane   name="articles">
                            <span slot="label"><i class="fa fa-file-text"></i> 文章 </span>
                            <articleCell v-for="art in articles" :articleInfo = "art"></articleCell>
                         </el-tab-pane>
                        <el-tab-pane  name="dynamic">
                            <span slot="label"><i class="el-icon-date"></i> 动态 </span>
                            <dynamicCell v-for="dynamic in dynamics" :dynamicInfo = "dynamic"></dynamicCell>
                        </el-tab-pane>
                        <el-tab-pane  name="comment">
                            <span slot="label"><i class="fa fa-comment-o"></i> 评论 </span>
                            <userCommentCell v-for="comment in comments" :commentInfo = "comment"></userCommentCell>
                        </el-tab-pane>
                        
                    </el-tabs>
                </div>
                <div class="articleUserInfoRight">
                    <div>
                        <div style="color: #888">
                            作者个人介绍
                        </div>
                        <div>
                            {{userInfo.user_description}}
                        </div>
                    </div>
                    <div class="userLinks">
                        <i  class="fa fa-link userLink" v-for="link in userInfo.links" aria-hidden="true"></i>
                    </div>
                    <div class="mySorts">
                        <div style="color: #888">
                            {{isMine == true ? '我' : '他'}}的分类
                        </div>
                        <div class="mySortsList">
                            <div v-for="sort in userInfo.sorts">
                                {{sort.sort_article_name}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           <upToTop></upToTop>
           <blogFoot></blogFoot>
        </div> 
</template>

<script>
import {getUserInfo,getDynamics,getUserComments} from '../../../store/service'
import upToTop from './../com/upToTop.vue'
import blogFoot from './../com/blogFoot.vue'
import articleCell from './com/articleCell.vue'
import dynamicCell from './com/dynamicCell.vue'
import userCommentCell from './com/userCommentCell.vue'
//todo comment sort feature
  export default {
    data() {
      return {
          userInfo:{},
          articles:[],
          dynamics:[],
          comments:[],
          activeName:'articles',
      }
    },
    mounted(){
        let id = this.$route.params.userId
        this.getTargetUserInfo(id)
    },
    methods:{
       async getTargetUserInfo(id){
           let res = await getUserInfo(id)
           if(res.code == 0){
               this.userInfo = res.data
               this.articles = this.userInfo.articles.map(s=>{
                    s.user_head = this.userInfo.user_image_url
                    s.user_name = this.userInfo.user_real_name
                    return s
               })
           }
           else{
               toast(this,res.cMsg)
           }
           res = await getDynamics(id)
           if(res.code == 0){
               this.dynamics = res.data.map(s=>{
                    s.user_head = this.userInfo.user_image_url
                    s.user_name = this.userInfo.user_real_name
                    return s
               })
           }
           res = await getUserComments(id)
           if(res.code == 0){
               this.comments = res.data.map(s=>{
                    s.user_head = this.userInfo.user_image_url
                    s.user_name = this.userInfo.user_real_name
                    return s
               })
           }
           
       },
       writeArticle(){
            this.$router.push('/writeArticle')
       },
       handleClick(tab,event){
                
       }
        
        
    },
    components:{
        blogHeader,upToTop,blogFoot,articleCell,dynamicCell,userCommentCell
    },
    computed:{
        releaseDate(){
            // return  formatTime(new Date(this.userInfo.article_create_time))
        },
        isMine(){
            if(getStore('userInfo')){
                if(getStore('userInfo').user_id == this.userInfo.user_id){
                    return true
                }
            }
            return false
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
    width: 70%;
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
.writeArticle{
    background: orangered;
    color: white;
    border: 0px;
    padding: 8px;
    font-size: 16px;
    width: 90px;
    height: 40px;
    margin-top: 20px;
}
.writeArticle:hover{
    cursor: pointer;
}
.articleUserInfoRight{
    font-size: 15px;
    width: 30%;
    background: white;
    padding: 10px;
}
.userLinks{
    margin-top: 20px;
    margin-bottom: 10px;
}
.userLink{
    margin: 0px 3px;
}
.userLink:hover{
    cursor: pointer;
}
.mySorts{
    border-top: 1px sol
}
.mySortsList{
margin-top: 10px;
}
.mySortsList div:hover{
cursor: pointer;
}
 @media (max-width:900px){
     .userMainPage{
        width: 100%;
    }
    .articleUserInfoRight{
        width: 0%;
        display: none;
    }
 } 
</style>