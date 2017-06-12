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
                            <div v-show="articles.length < articlesCount" class="loadMoreDiv">
                                <el-button :loading="isLoadingArticle" @click="loadMoreArticle" class="loadmoreButton">加载更多文章...</el-button>
                            </div>
                         </el-tab-pane>
                        <el-tab-pane  name="dynamic">
                            <span slot="label"><i class="el-icon-date"></i> 动态 </span>
                            <dynamicCell @articleTitleClick="articleTitleClick" v-for="dynamic in dynamics" :dynamicInfo = "dynamic"></dynamicCell>
                            <div v-show="dynamics.length < dynamicsCount" class="loadMoreDiv">
                                <el-button :loading="isLoadingDynamic" @click="loadMoreDynamic" class="loadmoreButton">加载更多动态...</el-button>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane  name="comment">
                            <span slot="label"><i class="fa fa-comment-o"></i> 评论 </span>
                            <userCommentCell v-for="comment in comments" :commentInfo = "comment"></userCommentCell>
                            <div v-show="comments.length < commentsCount" class="loadMoreDiv">
                                <el-button :loading="isLoadingComment" @click="loadMoreComment" class="loadmoreButton">加载更多评论...</el-button>
                            </div>
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
                         <div style="color: #888">
                            {{isMine == true ? '我' : '他'}}的网站
                        </div>
                        <div>
                            <a class="mylink" :href="link.link_url" v-for="link in userInfo.links" >{{link.link_name}}</a> 
                        </div>
                        
                    </div>
                    <div class="mySorts">
                        <div style="color: #888">
                            {{isMine == true ? '我' : '他'}}的分类
                        </div>
                        <div class="mySortsList">
                            <div v-for="sort in userInfo.sorts" @click="gotoSort(sort)">
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
import {getUserInfo,getDynamics,getUserComments,articlesByUser} from '../../../store/service'
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
          articlesCount:0,
          dynamics:[],
          dynamicsCount:0,
          comments:[],
          commentsCount:0,
          activeName:'articles',
          isLoadingArticle:false,
          isLoadingDynamic:false,
          isLoadingComment:false,
          userId:0,
      }
    },
    mounted(){
        let id = this.$route.params.userId
        this.getTargetUserInfo(id)
        this.getUserArticles(id)
        this.userId = id
    },
    methods:{
       async getTargetUserInfo(id){
           let res = await getUserInfo(id)
           if(res.code == 0){
               this.userInfo = res.data
           }
           else{
               toast(this,res.cMsg)
           }
       },
       async getUserArticles(id){
            this.isLoadingArticle = true
            let res = await articlesByUser(id,this.articles.length / 10,10)
            this.isLoadingArticle = false
            if(res.code == 0){
                this.articlesCount = res.count
                this.articles = this.articles.concat(res.data)
            }
       },
       async getUserDynamics(id){
            let self = this
            this.isLoadingDynamic = true
            let res = await getDynamics(this.userInfo.user_id,this.dynamics.length / 10,10)
            this.isLoadingDynamic = false
            if(res.code == 0){
                this.dynamicsCount = res.count
                this.dynamics = this.dynamics.concat(res.data.map(s=>{
                  s.user_info = self.userInfo
                  return s
                }))
            }
       },
       async getComments(id){
           let self = this
           this.isLoadingComment = true
           let res = await getUserComments(this.userInfo.user_id,this.comments.length / 10,10)
           this.isLoadingComment = false
           if(res.code == 0){
               this.commentsCount = res.count
               this.comments = this.comments.concat(res.data.map(s=>{
                  s.user_info = self.userInfo
                  return s
              }))
             
           }
       },
       writeArticle(){
            this.$router.push('/writeArticle/0')
       },
       handleClick(tab,event){
          switch(tab.index){
            case "1":
               if(isEmpty(this.dynamics)){
                    this.getUserDynamics(this.userId)
               }
            break;
            case "2":
                if(isEmpty(this.comments)){
                    this.getComments(this.userId)
               }
            break;
          }       
       },
       articleTitleClick(id){
             this.$router.push('/article/'+ id)
       },
       loadMoreArticle(){
         this.getUserArticles(this.userId)
       },
        loadMoreDynamic(){
         this.getUserDynamics(this.userId)
       },
        loadMoreComment(){
         this.getComments(this.userId)
       },
       gotoSort(sort){
           localStorage.sortId = sort.sort_article_id
           this.$router.push('/sortArticleList/' + sort.user_id)
       }
    },
    components:{
        upToTop,blogFoot,articleCell,dynamicCell,userCommentCell
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
    border-top: 5px solid #990066
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
    min-height: 500px;
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
.mylink{
    margin-right: 7px;
    color: #20a0ff !important;
}
.mylink:hover{
    cursor: pointer;
    text-decoration: underline !important;
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