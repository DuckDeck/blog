<template>
  <div class="container">      
       <blogLogo ></blogLogo>
       <blogSwiper class="blogSwiper" :articles = "top"></blogSwiper>
       <div class="blogContent" v-loading="loading">
           <div class="articlesList">
               <div style="position: relative;margin-top: 20px;margin-bottom: 10px;padding-bottom: 20px;" 
               v-for="art in articles" v-bind:key="art.article_id">
                   <div class="releaseDate">
                       <div style="font-size: 15px;margin-top: 2px;">
                          {{getMonth(art.article_release_time)}}
                       </div>
                       <div style="font-size: 32px;">
                           {{getDay(art.article_release_time)}}
                       </div>
              
                   </div>
                   <div class="articleTitleInfo">
                       <div class="articleTitle" @click="checkArticle(art)">
                           {{art.article_name}}
                       </div>
                       <div class="articleAuthor">
                            <span class="articleAuthorName" v-if="art.userInfo != null" @click="clickUser(art.userInfo)">{{art.userInfo.user_real_name}}</span> 
                            <span style="color: mediumblue;margin-left:5px">{{art.article_sort_name}}</span>  <span>{{art.comment_count}} 条评论</span> 
                            <span style="color: gray;margin-left:5px"><i  class="fa-heart fa"></i></span>  <span>{{art.like_count}}人喜欢</span>
                       </div>
                   </div>
                   <div style="text-align: center;margin-top: 17px;">
                        <img class="articelImage" :src="art.article_main_img" v-if="art.article_main_img.length > 0" alt="">
                   </div>
                  <div class="articleContent">
                      {{art.article_brief.slice(0,100)}}...
                  </div>
                  <div class="articleTags">
                        <el-tag  :key="tag" v-for="tag in art.tags" type='primary' >
                            {{tag.tag_name}}
                        </el-tag>
                  </div>
                  
               </div>
               <!--这里面以添加加载细节-->
               <loadMore :isLoading="isLoading" v-show="articles.length < articlesCount"  @loadmore="loadMore"></loadMore>
           </div>
           <div class="articlesNews">
               <!-- <div class="articleSort"> 这个目前没什么用，因为每个人分类都不一样
                   <div class="articleRightTitle">
                       <span>文章分类</span>
                       
                   </div>
                   <div class="articleRightContent">
                       <div v-for = "sort in sorts" @click="gotoSort(sort)" v-bind:key="sort.sort_id"  >{{sort.sort_name}}</div>
                   </div>
               </div> -->

               <div style="margin-top: 25px;">
                   <div class="articleRightTitle">
                       <span>最新评论</span>
                   </div>
                    <div class="articleRightContent">
                        <div style="display: flex;margin-bottom: 5px;cursor:pointer" v-for="com in newComment" v-bind:key="com.comment_id" @click="gotoUserInfo(com)">
                            <img class="userHead" :src="com.user_image_url" alt="">
                            <div>
                                <div class="userRealName"  >
                                    {{com.user_real_name}}
                                </div>
                                <div class="userComment">
                                    {{com.comment_content.slice(0,12)}}
                                </div>
                            </div>
                        </div>
                   </div>
               </div>
               <div style="margin-top: 25px;">
                   <div class="articleRightTitle">
                       <span>推荐作者</span>
                   </div>
                    <div class="articleRightContent">
                      <div  style="display: flex;" v-for="author in authors" v-bind:key="author.user_id" @click="gotoUserInfo(author)">
                            <img class="userHead" :src="author.user_image_url" alt="">
                            <div>
                                <div class="userRealName">
                                    {{author.user_real_name}}
                                </div>
                                <div class="userReleaseArticle">
                                    发布了{{author.article_count}}文章
                                </div>
                            </div>
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
import {getUserInfo,index,indexMore} from '../../store/service'
import blogLogo from './com/blogLogo.vue'
import blogSwiper from './com/blogSwiper.vue'
import upToTop from './com/upToTop.vue'
import blogFoot from './com/blogFoot.vue'
import loadMore from './com/loadMore.vue'
  export default {
    data() {
      return {
            top:[],
            articles:[],
            userInfo:{},
            sorts:[],
            newComment:[],
            authors:[],
            pageIndex:0,
            articlesCount:0,
            loading:false,
            isLoading:false,
            swiperOption: {
                pagination: '.swiper-pagination',
                slidesPerView: 1,
                paginationClickable: true,
                spaceBetween: 30,
                mousewheelControl: true
            },
      }
    },
    mounted(){
        let self= this
        if(getStore('userInfo')){
            this.isLogin = true
            this.userInfo = getStore('userInfo')
        }
        else{
            if(getStore('token')){ //this mean login is-success
                let user_id = getStore('token').user_id
                this.getUserInfo(user_id)
            }
        }
        this.loading = true
        index().then(res=>{
            this.loading = false
            if(res.code == 0){
                self.top = res.data.top
                self.articles = res.data.articles
                self.sorts = res.data.sorts
                self.newComment = res.data.newComment
                self.authors = res.data.authors
                self.pageIndex = 1
                self.articlesCount = res.count
            }
            else{
                toast(self,res.cMsg)
            }
        }).catch(err=>{
              this.loading = false
            toast(self,err.cMsg)
        })
        
    },
    components:{
        blogLogo,blogSwiper,upToTop,blogFoot,loadMore
    },
    methods:{
       
        checkMore(){
            this.$router.push('/articleList')
        },
        async getUserInfo(user_id){
           let res = await getUserInfo(user_id)
           if(res.code == 0){
               this.isLogin = true
               setStore('userInfo',res.data)
               this.userInfo = res.data
           }
           else{
               toast(this,res.cMsg)
           }
        },
        checkArticle(article){
            this.$router.push('/article/'+article.article_id)
        },
        getMonth(time){
            return formatTime(new Date(time),'yyyy-MM')
        },
        getDay(time){
   
            return formatTime(new Date(time),'dd')

        },
        clickUser(user){

            if(isLogin()){
                this.$router.push('/userInfo/' + getStore('userInfo').user_id + '/' + user.user_id + "/articles")                
            }
            else{
                this.$router.push('/userInfo/0/' + user.user_id + "/articles")
            }
        },
        gotoSort(sort){
            localStorage.sortId = sort.sort_id
            this.$router.push('sortArticleList/' + sort.user_id)
        },
        gotoUserInfo(com){
             if(isLogin()){
                this.$router.push('/userInfo/' + getStore('userInfo').user_id + '/' + com.user_id + "/articles")                
            }
            else{
                this.$router.push('/userInfo/0/' + com.user_id + "/articles")
            }
        },
     
        async loadMore(){
            this.isLoading = true
            let res = await indexMore(this.pageIndex)
            this.isLoading = false
            if(res.code == 0){
                if(res.data.length == 0){
                    toast(this,'已经全部加载完') 
                }
                else{
                    this.articles =  this.articles.concat(Array.from(res.data))
                    this.pageIndex ++
                }
            }
            else{
                toast(this,'加载更多失败')
            }
        }
    },
  }

</script>
<style >
.blogSwiper{
    margin-top: 20px;
}
.articlesList{
    width: 70%;
    background: #eee;
}
.blogContent{
    margin-top: 20px;
   display: flex;
   font-size: 20px;
   border-top: 5px solid mediumvioletred;
}
.articlesNews{
    background: #fff;
    width: 30%;
    padding: 20px;
}
.releaseDate{
    display: inline-block;
    width: 70px;
    height: 70px;
    background: deepskyblue;
    position: absolute;
    top: 0;
    left:-15px;
    color: white;
    text-align: center;
}
.articleTitleInfo{
    display: inline-block;
    margin-left: 70px;
}
.articleTitle{
    color: deepskyblue;

}
.articleTitle:hover{
    cursor: pointer;
    text-decoration: underline
}
.articleAuthor{
    font-size: 15px;
    margin-top: 5px;
}
.articleAuthor span{
    margin-right: 3px;
    
}
.articleAuthorName{
    color: mediumvioletred;
    border: 1px solid mediumvioletred;
    padding: 2px;
    border-radius: 2px;
    font-size: 14px;
}
.articleAuthorName:hover{
    cursor: pointer;
}
.articleContent{
    margin:20px 70px;
    font-size: 17px;
}
.articelImage{
    width: 80%;
   
}

.loadMore:hover{
    cursor: pointer;
}
.articleTags{
    margin:20px 70px;
}
.articleTags span{
    margin-right: 10px;
}
.articleRightTitle{
    border-left: 5px solid deepskyblue;
    padding-left: 10px;
}
.articleRightContent{
    margin-left: 18px;
    margin-top: 5px;
    margin-bottom: 10px;
    font-size: 15px;
}
.articleRightContent div{
     color: #333;
     margin-bottom: 3px;
}
.articleRightContent div:hover{
    cursor: pointer;
}

.userRealName{
    font-size: 15px;
}
.userComment{
    font-size: 12px;

}
.userReleaseArticle{
    font-size: 13px;
    color: #aaa
}
 @media (max-width:1000px){
     .articlesList{
        width: 100%;
    }
    .articlesNews{
        width: 0%;
        display: none;
    }
    .articleContent{

    }
 } 
 @media (max-width:700px){

    .articleContent{
        margin: 20px 40px;
    }
} 
@media (max-width:500px){

    .articleContent{
        margin: 20px 20px;
    }
} 
</style>