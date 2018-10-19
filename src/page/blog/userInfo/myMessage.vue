<template>
      <div  class="container" >
          <div class="main-page">
            <div class="myAttentions"> 
               
                
            </div>
            <div class="myAttentionsArticles" v-loading="loading">
            
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
                attentionedUserArticlesCount:0,
                selectedUserId:0,
                loading:false,
            }
        },
        async mounted(){
            let id = this.$route.params.userId
            this.userId = id
            console.log(id)
            this.getAttention(id)
        },
        methods:{
           
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
