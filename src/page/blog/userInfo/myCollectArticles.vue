<template>
      <div  class="container" >
          <div class="main-page">
            <div class="collectTitle"> 
                <i class="fa fa-bookmark" aria-hidden="true"></i>
                收藏的文章
            </div>
            <div v-loading="loading" class="collectedArticles" >
             <articleCell  v-for="art in collectedArticles" v-bind:key="art.article_id" :articleInfo = "art" @notCollect="notCollect"></articleCell>
                <emptyHint v-show="collectedArticlesCount == 0"></emptyHint>
                <loadMore :isLoading="isLoadinMore" v-show="collectedArticles.length < collectedArticlesCount"
                    @loadmore="getCollctedArticles"></loadMore>
             </div>
          </div>
          <upToTop></upToTop>
          <blogFoot></blogFoot>
      </div>
</template>

<script>
import {collectedArticlesByUser,userCollectArticle} from '../../../store/service'
import articleCell from './com/articleCell.vue'
import emptyHint from './../com/emptyHint.vue'
import upToTop from './../com/upToTop.vue'
import blogFoot from './../com/blogFoot.vue'
import loadMore from './../com/loadMore.vue'
    export default {
        data(){
            return {
                loading:false,
                userId:0,
                collectedArticles:[],
                isLoadinMore:false,
                collectedArticlesCount:-1,
            }
        },
        async mounted(){
            let id = this.$route.params.userId
            this.userId = id
            console.log(id)
            this.getCollctedArticles(id)
        },
        methods:{
            async getCollctedArticles(id){
                if(id == 0){
                    this.loading = true
                }
                else{
                    this.isLoadinMore = true
                }
                let res = await collectedArticlesByUser(id,this.collectedArticles.length / 10,10)
                this.isLoadinMore = false
                this.loading = false
                if(res.code == 0){
                    console.log(res.data)
                    this.collectedArticlesCount = res.count
                    this.collectedArticles = this.collectedArticles.concat(res.data.map(s=>{
                        s.isUserCollected = true
                        s.user_info = {user_image_url:s.user_image_url,user_real_name:s.user_real_name}
                        return s
                    }))
                }
            },
            async notCollect(article){
                let res = await userCollectArticle(article.article_id,false)
                if(res.code != 0){
                    toast(this,res.cMsg)
                }
                article.isUserCollected = false
            }
        },
        components:{
                articleCell,emptyHint,upToTop,blogFoot,loadMore
        },
    }
</script>

<style scoped>
.main-page{
     background: white;
    margin-top: 70px;
    border-top: 5px solid deepskyblue;
    min-height: 800px;
}
.collectTitle{
    background-color: orangered;
    width: 22rem;
    margin: 0 auto;
    color: azure;
    font-size: 2rem;
    padding-bottom: 1rem;
    padding-top: 1rem;
    margin-top: 20px;
    text-align: center;
    border-radius: 0.6rem;
}
.collectedArticles{
    padding-left: 1.6rem;
    padding-right: 1.6rem;
    padding-top: 30px;
    padding-bottom: 30px;
}
</style>
