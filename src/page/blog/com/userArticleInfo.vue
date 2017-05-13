<template>
    <div class="comArticleUserInfo">
        <img :src="userInfo.user_image_url"  @click="userheadClick" class="comUserArticleHead" alt="">
        <div class="comArticleUserDetail">
            <div>
                <span @click="userheadClick" class="comArticleAuthorTag">作者</span> <span @click="userheadClick">{{userInfo.user_real_name}}</span>
            </div>
            <div class="comArticleReleaseTime">
                <span>发布于: {{articleReleaseTime}}  </span> <span>  文章 {{userInfo.article_count}}</span>
                <span v-show="userInfo.browse" >  浏览 {{userInfo.browse}}</span> <span v-show="userInfo.commentCount">  评论 {{userInfo.comment_count}}</span> 
            </div>
        </div>
        <button class="comEditArticleButton" @click="editArticle" v-show="canEdit">编辑文章</button>
    </div>
</template>
<script>
    export default {
        data() {
            return{
              
            }
        },
        props:{  
          userInfo:{
            type:Object
          }
        },
        methods:{
            editArticle(){
              
                if(this.userInfo.article_id){
                    this.$router.push('/writeArticle/' + this.userInfo.article_id)
                }
            },
            userheadClick(){
                 this.$emit("userHeadClick",this.userInfo)
            }
        },
        computed:{
           articleReleaseTime(){
               return moment(this.userInfo.article_release_time)
           },
           canEdit(){
               if(getStore('userInfo')){
                  if(getStore('userInfo').user_id == this.userInfo.user_id){
                      return true
                  }
               }
              return false
           }
        },
    }
</script>
<style scoped>
.comArticleUserInfo{
    font-size: 16px;
    display: flex;
}
.comUserArticleHead{
 width: 46px;
 height: 46px;
 border-radius: 23px;
 border: 1px solid #bbb;
}
.comArticleUserDetail{
    margin-left: 15px;
    width: 70%;
    padding-top: 1px;
    font-size: 13px;
    margin-top: 2px;
}
.comArticleAuthorTag{
    color: mediumvioletred;
    border: 1px solid mediumvioletred;
    padding: 2px;
    border-radius: 2px;
    margin-right: 2px;
}
.comArticleReleaseTime{
    font-size: 14px;
    color: #aaa;
    margin-top: 3px;
}
.comArticleReleaseTime span{
    margin-right: 4px;
}
.comEditArticleButton{
    background: orangered;
    color: white;
    border: 0px;
    padding: 5px;
    font-size: 16px;
    width: 85px;
    height: 35px;
    margin-top: 5px;
    border-radius: 4px;
}
.comEditArticleButton:hover{
    cursor: pointer;
}
 @media (max-width:500px){
    .comEditArticleButton{
        display: none;
    }
 } 
 @media (max-width:900px){
     .comArticleUserDetail{
        width: 60%;
    }
 } 


</style>
