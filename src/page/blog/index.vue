<template>
  <div class="container">      
       <blogHeader  :userInfo = "userInfo"  @headAction="headAction"></blogHeader>
       <blogLogo ></blogLogo>
       <blogSwiper class="blogSwiper" :articles = "top"></blogSwiper>
       <div class="blogContent">
           <div class="articlesList">
               <div style="position: relative;margin-top: 20px;margin-bottom: 10px;" v-for="art in articles">
                   <div class="releaseDate">
                       <div style="font-size: 15px;margin-top: 2px;">
                          {{getMonth(art.article_release_time)}}
                       </div>
                       <div style="font-size: 32px;">
                           {{getDay(art.article_release_time)}}
                       </div>
              
                   </div>
                   <div class="articleTitleInfo">
                       <div class="articleTitle">
                           {{art.article_name}}
                       </div>
                       <div class="articleAuthor">
                            {{art.userInfo.user_real_name}} {{art.article_sort_name}} {{art.comment_count}} 条评论
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
           </div>
           <div class="articlesNews">
               
           </div>
       </div>
  </div>
</template>

<script>
import {getUserInfo} from '../../store/service'
import {index} from '../../store/index'
import blogHeader from './com/blogHead.vue'
import blogLogo from './com/blogLogo.vue'
import blogSwiper from './com/blogSwiper.vue'
  export default {
    data() {
      return {
            top:[],
            articles:[],
            userInfo:{},
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
            console.log('logined')
            this.isLogin = true
            this.userInfo = getStore('userInfo')
        }
        else{
            if(getStore('token')){ //this mean login is-success
                this.getUserInfo()
            }
        }
        index().then(res=>{
            if(res.code == 0){
                self.top = res.data.top
                self.articles = res.data.articles
            }
            else{
                toast(self,res.cMsg)
            }
        }).catch(err=>{
            toast(self,err.cMsg)
        })
        
    },
    components:{
        blogHeader,blogLogo,blogSwiper
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
        
        checkMore(){
            this.$router.push('/articleList')
        },
        async getUserInfo(){
           let res = await getUserInfo()
           if(res.code == 0){
               this.isLogin = true
               setStore('userInfo',res.data)
               this.userInfo = res.data
               console.log(res.data)
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
 
   }

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
   
}
.articlesNews{
    background: #fff;
    width: 30%;
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
    margin-left: 90px;
}
.articleTitle{
    color: deepskyblue;

}
.articleTitle:hover{
    cursor: pointer;
}
.articleAuthor{
    font-size: 15px;
    margin-top: 5px;
}
.articleContent{
    margin:20px 70px;
}
.articelImage{
    width: 80%;
   
}
.detailButton{
    position: absolute;
    right:0px;
    bottom: 10px;
}
.articleTags{
    margin:20px 70px;
}
.articleTags span{
    margin-right: 10px;
}
</style>