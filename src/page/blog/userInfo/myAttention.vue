<template>
      <div  class="container" >
          <div class="main-page">
            <div class="collectTitle"> 
                <i class="fa fa-bookmark" aria-hidden="true"></i>
                收藏的文章
            </div>
            <div class="collectedArticles" >
             <articleCell  v-for="art in collectedArticles" :key="art.article_id" :articleInfo = "art" @notCollect="notCollect"></articleCell>
                
                <div v-show="attentionedUserArticles.length < attentionedUserArticlesCount" class="loadMoreDiv">
                    <el-button :loading="isLoadinMore" @click="getCollctedArticles" class="loadmoreButton">加载更多文章</el-button>
                </div>
             </div>
          </div>
          <upToTop></upToTop>
          <blogFoot></blogFoot>
      </div>
</template>

<script>
import {userSetAttentioned,userAttentioned} from '../../../store/service'
import articleCell from './com/articleCell.vue'
import emptyHint from './../com/emptyHint.vue'
import upToTop from './../com/upToTop.vue'
import blogFoot from './../com/blogFoot.vue'

    export default {
        data(){
            return {
                userId:0,
                attentioned:[],
                attentionedUserArticles:[],
                isLoadinMore:false,
                attentionedUserArticlesCount:0,
            }
        },
        async mounted(){
            let id = this.$route.params.userId
            this.userId = id
            console.log(id)
            this.getCollctedArticles(id)
        },
        methods:{
            async getAttention(id){
                let res = await userSetAttentioned(id)
                if(res.code == 0){
                    console.log(res.data)
                    this.attentioned = this.collectedArticles
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
                articleCell,emptyHint,upToTop,blogFoot,
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
    width: 8rem;
    margin: 0 auto;
    color: azure;
    font-size: 0.5rem;
    padding-bottom: 0.3rem;
    padding-top: 0.3rem;
    margin-top: 10px;
    text-align: center
}
.collectedArticles{
    padding-left: 1.6rem;
    padding-right: 1.6rem;
    padding-top: 30px;
    padding-bottom: 30px;
}
</style>
