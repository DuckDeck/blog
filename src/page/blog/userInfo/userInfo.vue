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
                                <span>发表的文章:{{userInfo.article_count}}</span> 
                                <span>收获的喜欢:{{userInfo.articles_be_liked_count}}</span>
                            </span>
                        </div>
                            
                        
                        </div>
                       <button v-show="isMine" @click="writeArticle" class="writeArticle">写文章</button>
                       <button v-show="!isMine" @click="attentionUser" v-bind:class="[userInfo.is_attention?'attentionUser':'attentionedUser']">
                           {{userInfo.is_attention?"已关注":"关注"}}</button>
                     
                    </div>
                     <el-tabs v-model="activeName" class="userInfoTab" type="border-card" @tab-click="handleClick">
                        <el-tab-pane   name="articles">
                            <span slot="label"><i class="fa fa-file-text"></i> 文章 </span>
                            <articleCell v-for="art in articles" v-bind:key="art.article_id" :articleInfo = "art"></articleCell>
                            <emptyHint v-show="articlesCount == 0"></emptyHint>
                            <loadMore :isLoading="isLoading" v-show="articles.length < articlesCount"  @loadmore="loadMoreArticle"></loadMore>
                         </el-tab-pane>
                        <el-tab-pane  name="dynamic">
                            <span slot="label"><i class="el-icon-date"></i> 动态 </span>
                            <dynamicCell @articleTitleClick="articleTitleClick" v-for="dynamic in dynamics" v-bind:key="dynamic.dynamic_id" :dynamicInfo = "dynamic"></dynamicCell>
                             <emptyHint v-show="dynamicsCount == 0"></emptyHint>
                            <loadMore :isLoading="isLoading" v-show="dynamics.length < dynamicsCount"  @loadmore="loadMoreDynamic"></loadMore>
                        </el-tab-pane>
                        <el-tab-pane  name="comment">
                            <span slot="label"><i class="fa fa-comment-o"></i> 评论 </span>
                            <userCommentCell v-for="comment in comments" :commentInfo = "comment" v-bind:key="comment.comment_id"></userCommentCell>
                             <emptyHint v-show="commentsCount == 0"></emptyHint>
                            <loadMore :isLoading="isLoading" v-show="comments.length < commentsCount"  @loadmore="loadMoreComment"></loadMore>

                        </el-tab-pane>
                        <el-tab-pane  name="like">
                            <span slot="label"><i class="fa fa-heart-o"></i> 喜欢的文章 </span>
                            <articleCell @notLike="notLike" v-for="art in likeArticles" v-bind:key="art.article_id" :articleInfo = "art"></articleCell>
                            <emptyHint v-show="likeArticlesCount == 0"></emptyHint>
                            <loadMore :isLoading="isLoading" v-show="likeArticles.length < likeArticlesCount"  @loadmore="loadMoreLikeArticles"></loadMore>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div class="articleUserInfoRight">
                    <div>
                        <div class="littleProjectTitle">
                            作者个人介绍
                        </div>
                        <div style="margin-left:5px">
                            {{userInfo.user_description}}
                        </div>
                    </div>
                    <div class="userLinks">
                         <div class="littleProjectTitle">
                            {{isMine == true ? '我' : '他'}}的网站
                        </div>
                        <div style="margin-left:5px">
                            <a class="mylink" :href="link.link_url" v-for="link in userInfo.links" >{{link.link_name}}</a> 
                        </div>
                        
                    </div>
                    <div class="mySorts">
                        <div class="littleProjectTitle">
                            {{isMine == true ? '我' : '他'}}的分类
                        </div>
                        <div class="mySortsList">
                            <el-tag :key="sort.sort_id" v-for="sort in userInfo.sorts" type='primary'  style="text-align:center"
                             :close-transition="false" >
                            <span  class="clickSpan" > {{sort.sort_article_name}}</span>
                        </el-tag>
                        </div>
                    </div>
                </div>
            </div>
           <upToTop></upToTop>
           <blogFoot></blogFoot>
        </div> 
</template>

<script>
import {getUserInfo,getDynamics,getUserComments,articlesByUser,likedArticlesByUser,userLikeArticle,userSetAttentioned} from '../../../store/service'
import upToTop from './../com/upToTop.vue'
import blogFoot from './../com/blogFoot.vue'
import articleCell from './com/articleCell.vue'
import dynamicCell from './com/dynamicCell.vue'
import userCommentCell from './com/userCommentCell.vue'
import emptyHint from './../com/emptyHint.vue'
import loadMore from './../com/loadMore.vue'
//todo comment sort feature
  export default {
    data() {
      return {
          userInfo:{},
          articles:[],
          articlesCount:-1,
          dynamics:[],
          dynamicsCount:-1,
          comments:[],
          commentsCount:-1,
          likeArticles:[],
          likeArticlesCount:-1,
          activeName:'articles',
          isLoading:false,
          userId:0,
      }
    },
    mounted(){
        let id = this.$route.params.userId
        this.userId = id
        this.activeName = this.$route.params.tab
        console.log(this.activeName)
        this.getTargetUserInfo(id)
        switch (this.activeName) {
            case 'articles':
                this.getUserArticles(id)
                break;
             case 'dynamic':
                this.getUserDynamics(id)
                break;
             case 'comment':
                this.getComments(id)
                break;
             case 'like':
                this.getLikedArticles(id)
                break;
        }
    },
    methods:{
       async notLike(article){
            let res = await userLikeArticle(article.article_id,false)
            if(res.code != 0){
                toast(this,res.cMsg)
            }
            article.isUserLiked = false
       },
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
            this.isLoading = true
            let res = await articlesByUser(id,this.articles.length / 10,10)
            this.isLoading = false
            if(res.code == 0){
                this.articlesCount = res.count
                this.articles = this.articles.concat(res.data)
            }
       },
       async getUserDynamics(id){
            let self = this
            this.isLoading = true
            let res = await getDynamics(id,this.dynamics.length / 10,10)
            this.isLoading = false
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
           this.isLoading = true
           let res = await getUserComments(id,this.comments.length / 10,10)
           this.isLoading = false
           if(res.code == 0){
               this.commentsCount = res.count
               this.comments = this.comments.concat(res.data.map(s=>{
                  s.user_info = self.userInfo
                  return s
              }))
           }
       },
       async getLikedArticles(id){
           this.isLoading = true
           let res = await likedArticlesByUser(id,this.likeArticles.length / 10,10)
           this.isLoading = false
           if(res.code == 0){
               this.likeArticlesCount = res.count
               this.likeArticles = this.likeArticles.concat(res.data.map(s=>{
                  s.user_info = this.userInfo
                  s.isUserLiked = userId() == id
                  return s
              }))
              console.log(this.likeArticles)
           }
       },
       writeArticle(){
            this.$router.push('/writeArticle/0')
       },
       handleClick(tab,event){
          switch(tab.index){
            case "0":
               if(isEmpty(this.articles)){
                    this.getUserArticles(this.userId)
               }
            break;
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
            case "3":
                if(isEmpty(this.likeArticles)){
                    this.getLikedArticles(this.userId)
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
       loadMoreLikeArticles(){
          this.getLikedArticles(this.userId)
       },
       gotoSort(sort){
           localStorage.sortId = sort.sort_article_id
           this.$router.push('/sortArticleList/' + sort.user_id)
       },
       async attentionUser(){
            if(!isLogin()){
                toast(this,"请先登录再关注该作者")
                return
            }
            let res = await userSetAttentioned(this.userInfo.user_id,!this.userInfo.is_attention)
            if(res.code != 0){
                toast(this,res.cMsg)
            }
            this.userInfo.is_attention = !this.userInfo.is_attention
       }
    },
    components:{
        upToTop,blogFoot,articleCell,dynamicCell,userCommentCell,emptyHint,loadMore
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
    object-fit: cover
}
.articleUserDetail{
    font-size: 16px;
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
    align-self: center;
}
.writeArticle:hover{
    cursor: pointer;
}
.attentionUser{
    background: orangered;
    color: white;
    border: 0px;
    padding: 8px;
    font-size: 16px;
    width: 90px;
    height: 40px;
    align-self: center;
    margin-left: 1rem;
}
.attentionedUser{
    background: orangered;
    color: white;
    border: 0px;
    padding: 8px;
    font-size: 16px;
    width: 90px;
    height: 40px;
    align-self: center;
    margin-left: 1rem;
}
.attentionedUser:hover{
    cursor: pointer;
}
.attentionUser:hover{
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
    margin-left: 5px;
    display: flex;
    flex-direction: column;
    width: 100px;
}
.mySortsList span{
    margin-bottom: 8px;
}
.mySortsList span:hover{
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