<template>
     <div class="container">   
            <div class="main-page">          
                    <div class=" article-content">
                       <header>
                            <div  class="articleHeader" >
                                {{article.article_name}}
                            </div>
                            <userArtileInfo class="userArtileInfo" :userInfo="articleUserInfo"></userArtileInfo>
                            <div class="articleInfoClass">
                                 <span>  {{article.sort_name}}</span> <span>  {{article.article_click}}</span>浏览量
                            </div>
                            <div  class="articleTagClass">
                                    <el-tag  v-for="t in article.tags"   type="primary"  >{{t.tag_name}}</el-tag>
                            </div>
                       </header>
                    <div class="articleSeperateLine"></div>
                    <article class="articleContentClass" v-html = "article.article_content"></article>
                        <writeComment  @submitComment="submitComment" @refreshComment = "refreshComment"></writeComment>
                        
                    <div class="articleComments">
                        <div class="articleCommentsCount">
                            {{commentCount}}条评论  
                        </div>
                        <userComment v-for="com in article.comments" :comment="com" ></userComment>
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
import blogSide from './com/blogSide.vue'
import writeComment from './com/writeComment.vue'
import userComment from './com/userComment.vue'
import upToTop from './com/upToTop.vue'
import blogFoot from './com/blogFoot.vue'
import userArtileInfo from './com/userArticleInfo.vue'
//todo comment sort feature
  export default {
    data() {
      return {
          article:{},
          articleUserInfo:{}
      }
    },
    async mounted(){
        let self= this
        let id = this.$route.params.articleId
        let res = await articleById(id)
        if(res.code == 0){
            this.article = res.data
            this.articleUserInfo = res.data.userInfo
            this.articleUserInfo.article_release_time = res.data.article_release_time
        }
        else{
            toast(this,res.cMsg)
        }
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
        async submitComment(com){
           if(com == ''){
               toast(this,'评论内容不能为空')
           }
           if(com.trim() == ''){
               toast(this,'评论内容不能为空字符')
           }
           let comment = {
               commentContent:com,
               commentTargetId:this.article.article_id
           }
           let res = await submitComment(comment)
           toast(this,res.cMsg)
           if(res.code == 0){
                let id = res.data.id  
               res = await getComment(id)
               if(res.code == 0){
                 this.article.comments.push(res.data)
               }
              
           }
        },
        async refreshComment(comment_id){
             res = await getComment(comment_id)
             if(res.code == 0){
                let index = this.article.comments.findIndex(s=>{
                    s.comment_id == comment_id
                })
                if(index >=0){
                    this.article.comments.splice(index,1,res.data)
                }
            }   
        }
    },
    components:{
        blogHeader,blogSide,writeComment,userComment,upToTop,blogFoot,userArtileInfo
    },
    computed:{
        releaseDate(){
            return  formatTime(new Date(this.article.article_create_time))
        },
        commentCount(){
            if(this.article.comments != undefined){
                return this.article.comments.length
            }
            return 0

        }
    }

  }
</script>
<style >

  .container{
     padding-left: 15px;
     padding-right: 15px;
     margin-left: auto;
     margin-right: auto;
  }
  .row{
    margin-left: -15px;
    margin-right: -15px;
  }

.main-page{
   margin-top: 60px;
}
.content-main{
    padding-left: 340px;
	width: 100%;
	box-sizing: border-box;
	float: none;
}
.userArtileInfo{
    margin-left: 50px;
    margin-top: 20px;
    margin-bottom: 20px;
}
.article-content{
    background: white;
    border-top: 7px solid #10a5cd;
}
.articleHeader{
    font-size: 35px;
    text-align: center;
    margin-top: 30px;
    font-weight: bold;
}
.articleInfoClass{
    font-size: 20px;
    margin-top: 10px;
    margin-left: 50px;
}
.articleTagClass{

    font-size: 20px;
    margin-left: 50px;
    margin-top: 10px;
}
.articleTagClass span{
    margin-right: 10px;
}
.articleContentClass{
    margin:20px;
    font-size: 20px;
    padding-bottom: 50px;
    margin-top: 50px;
}

.articleComments{
    padding:25px;
}
.articleCommentsCount{
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
    padding-bottom: 5px;
    border-bottom: 1px solid #777;
}
@media (max-width:991px) {
.content-main{
    padding-left: 0px;    
}
}
</style>