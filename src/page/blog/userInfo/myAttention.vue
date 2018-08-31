<template>
      <div  class="container" >
          <div class="main-page">
            <div class="myAttentions"> 
                <div v-for="att in attentioned" v-bind:key="att.user_id">
                   <img class="userHead" :src="att.user_image_url" alt="">
                    <div>
                        <div class="userRealName">
                            {{att.user_real_name}}
                        </div>
                    </div>
                </div>
                
            </div>
            <div  >
             <articleCell  v-for="art in pushedArticles" :key="art.article_id" :articleInfo = "art" @notCollect="notCollect"></articleCell>
                
                <div v-show="attentionedUserArticles.length < attentionedUserArticlesCount" class="loadMoreDiv">
                    <el-button :loading="isLoadinMore" @click="getPushedArticles" class="loadmoreButton">加载更多文章</el-button>
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
                pushedArticles:[]
            }
        },
        async mounted(){
            let id = this.$route.params.userId
            this.userId = id
            console.log(id)
            this.getAttention(id)
        },
        methods:{
            async getAttention(id){
                let res = await userAttentioned(id)
                if(res.code == 0){
                    console.log(res.data)
                    this.attentioned = this.collectedArticles
                }
            },
            getPushedArticles(){

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
    display: flex;
}
.myAttentions{
    width: 200px;
}
</style>
