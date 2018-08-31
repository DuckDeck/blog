<template>
      <div  class="container" >
          <div class="main-page">
            <div class="myAttentions"> 
                <div v-for="att in attentioned" @click="getUserArticles" v-bind:key="att.user_id" class="attentionedUsers">
                   <img class="userHead"  :src="att.user_image_url" alt="">
                 
                        <div style="align-self:center;font-size:16px;color:gray">
                            {{att.user_real_name}}
                        </div>
          
                </div>
                
            </div>
            <div class="myAttentionsArticles" >
             <articleCell  v-for="art in pushedArticles" :key="art.article_id" :articleInfo = "art" @notCollect="notCollect"></articleCell>
                
                <div v-show="attentionedUserArticles.length < attentionedUserArticlesCount" class="loadMoreDiv">
                    <el-button :loading="isLoadinMore" @click="getUserArticles" class="loadmoreButton">加载更多文章</el-button>
                </div>
             </div>
          </div>
          <upToTop></upToTop>
          <blogFoot></blogFoot>
      </div>
</template>

<script>
import {userSetAttentioned,userAttentioned,articlesByUser} from '../../../store/service'
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
                pushedArticles:[],
                selectedUserId:0
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
                    this.attentioned = res.data
                    this.selectedUserId = this.attentioned[0].user_id
                    this.getUserArticles()
                }
            },
            async getUserArticles(){
                let res = await articlesByUser(this.selectedUserId,this.pushedArticles.length / 10,10)
                if(res.code != 0){
                    toast(this,res.cMsg)
                    return
                }
                // this.attentionedUserArticlesCount = res.count
                this.pushedArticles = res.data
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
    width: 300px;
}
.attentionedUsers{
    display: flex;
    padding: 10px 20px 10px 20px;
    
}
.attentionedUsers:hover{
    cursor: pointer;
    background: #dddddddd;
}
.myAttentionsArticles{
    padding: 0px 20px 0px 20px;
}
</style>
