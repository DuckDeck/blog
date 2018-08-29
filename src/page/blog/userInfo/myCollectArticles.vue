<template>
      <div style="text-align: center" class="container" >
          <div class="main-page">
            <div class="collectTitle"> 
                <i class="fa fa-bookmark" aria-hidden="true"></i>
                收藏的文章
            </div>
            <div >
             <articleCell  v-for="art in collectedArticles" :articleInfo = "art"></articleCell>
                <emptyHint v-show="collectedArticlesCount == 0"></emptyHint>
                <div v-show="collectedArticles.length < collectedArticlesCount" class="loadMoreDiv">
                    <el-button :loading="isLoadinMore" @click="getCollctedArticles" class="loadmoreButton">加载更多收藏文章...</el-button>
                </div>
             </div>
          </div>
          <upToTop></upToTop>
          <blogFoot></blogFoot>
      </div>
</template>

<script>
import {collectedArticlesByUser} from '../../../store/service'
import articleCell from './com/articleCell.vue'
import emptyHint from './../com/emptyHint.vue'
import upToTop from './../com/upToTop.vue'
import blogFoot from './../com/blogFoot.vue'

    export default {
        data(){
            return {
                userId:0,
                collectedArticles:[],
                isLoadinMore:false,
                collectedArticlesCount:0,
            }
        },
         mounted(){
            let id = this.$route.params.userId
            this.userId = id
            this.getCollctedArticles(id)
                
        },
        methods:{
            async getCollctedArticles(id){
                this.isLoadinMore = true
                let res = await collectedArticlesByUser(id,this.collectedArticles.length / 10,10)
                this.isLoadinMore = false
                if(res.code == 0){
                    this.collectedArticlesCount = res.count
                    this.collectedArticles = this.collectedArticles.concat(res.data.map(s=>{
                        s.user_info = this.userInfo
                        s.isUserCollected = true
                        return s
                    }))
                    console.log(this.collectedArticles)
                }
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
    width: 10rem;
    margin: 0 auto;
    color: azure;
    font-size: 0.5rem;
    padding-bottom: 0.3rem;
    padding-top: 0.3rem;
    margin-top: 10px;
}

</style>
