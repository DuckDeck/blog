<template>
      <div  class="container" >
          <div class="main-page">
            <div class="message_item" > 
               <div> 
                   <i class="fa fa-commenting"></i> 评论
               </div>
                <div> 
                   <i class="fa fa-heart"></i> 喜欢和赞
               </div>
               <div> 
                   <i class="fa fa-user-plus"></i> 关注
               </div>
               <div> 
                   <i class="fa fa-wechat"></i> 私信
               </div>
            </div>
            <div class="message_content" v-loading="loading">
            
            </div>
          </div>
          <upToTop></upToTop>
          <blogFoot></blogFoot>
      </div>
</template>

<script>
import {userGetUndreaMessage} from '../../../store/service'
import emptyHint from './../com/emptyHint.vue'
import upToTop from './../com/upToTop.vue'
import blogFoot from './../com/blogFoot.vue'
import loadMore from './../com/loadMore.vue'
    export default {
        data(){
            return {
                userId:0,
                isLoadinMore:false,
                type:2,
                loading:false,
                itemCount:0
            }
        },
        async mounted(){
            let id = this.$route.params.userId
            this.userId = id
            this.getMessagesWithType()
           
        },
        methods:{
           async getMessagesWithType(){
               this.loading = true
              let res =  await userGetUndreaMessage(this.type)
                this.loading = false
                console.log(res)
           }
        },
        components:{
               emptyHint,upToTop,blogFoot,loadMore
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
.message_item{
    min-width: 200px;
    border-right: 2px solid peru
}
.message_content{
    display: flex;
    padding: 10px 20px 10px 20px;
    margin-bottom: 2px;
}
.message_item div{

    padding: 10px 10px 10px 20px;
    cursor: pointer;
}
.message_item div:hover{
    background: #dddddddd
}

.message_item div i{
    color: orangered;
    margin-right: 5px;
    font-size: 23px;
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
