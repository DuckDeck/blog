<template>
      <div  class="container" >
          <div class="main-page">
            <div class="myAttentions" v-loading="loadingUser"> 
                <div v-for="att in attentioned" @click="getUserArticles(att)" v-bind:key="att.user_id" 
                v-bind:class="[selectedUserId == att.user_id?'attentionedUsersSelected':'attentionedUsers']">
                   <img class="userHead"  :src="att.user_image_url" alt="">
                 
                        <div style="align-self:center;font-size:16px;color:gray">
                            {{att.user_real_name}}
                        </div>
          
                </div>
                
            </div>
            <div class="myAttentionsArticles" v-loading="loading">
             <articleCell  v-for="art in attentionedUserArticles" :key="art.article_id" :articleInfo = "art"  :showUserHead = "false"></articleCell>
                 <emptyHint v-show="attentionedUserArticlesCount == 0 && !loading"></emptyHint>
                 <loadMore :isLoading="isLoadinMore" v-show="attentionedUserArticles.length < attentionedUserArticlesCount && attentionedUserArticlesCount != 0"
                    @loadmore="getUserArticles"></loadMore>
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
import loadMore from './../com/loadMore.vue'
    export default {
        data(){
            return {
                userId:0,
                attentioned:[],
                attentionedUserArticles:[],
                isLoadinMore:false,
                attentionedUserArticlesCount:-1,
                selectedUserId:0,
                loading:false,
                loadingUser:false
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
                this.loadingUser = true
                let res = await userAttentioned(id)
                this.loadingUser = false
                if(res.code == 0){
                    console.log(res.data)
                    this.attentioned = res.data
                    this.selectedUserId = this.attentioned[0].user_id
                    this.getUserArticles(this.attentioned[0])
                }
            },
            async getUserArticles(user){
                this.loading = true
                if(user&&user.user_id){
                    this.attentionedUserArticles = []
                    this.attentionedUserArticlesCount = 0
                    this.selectedUserId = user.user_id
                }
                
                let res = await articlesByUser(this.selectedUserId,this.attentionedUserArticles.length / 10,10)
                this.loading = false
                if(res.code != 0){
                    toast(this,res.cMsg)
                    return
                }
                this.attentionedUserArticlesCount = res.count
                this.attentionedUserArticles = this.attentionedUserArticles.concat(res.data)  
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
    display: flex;
}
.myAttentions{
    min-width: 200px;
    border-right: 2px solid peru
}
.attentionedUsers{
    display: flex;
    padding: 10px 20px 10px 20px;
    margin-bottom: 2px;
}
.attentionedUsersSelected{
    display: flex;
    padding: 10px 20px 10px 20px;
    background-color: #dddddddd;
    margin-bottom: 2px;
}
.attentionedUsers:hover{
    cursor: pointer;
    background: #dddddddd;
}
.myAttentionsArticles{
    border-left: 2px solid peru;
    padding: 0px 40px 0px 40px;
    width: 100%
}
</style>
