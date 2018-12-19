<template>
      <div  class="container" >
          <div class="main-page">
            <div class="message_item" > 
               <div v-bind:class="[type == 1?'message_item_div_selected':'message_item_div']" @click="selectType(1)"> 
                   <i class="fa fa-commenting"></i> 评论 <span v-show="comment_unread_count > 0">{{comment_unread_count}}</span>
               </div> 
                <div v-bind:class="[type == 2?'message_item_div_selected':'message_item_div']" @click="selectType(2)"> 
                   <i class="fa fa-heart"></i> 喜欢和赞  <span v-show="like_unread_count > 0">{{like_unread_count}}</span>
               </div>
               <div v-bind:class="[type == 3?'message_item_div_selected':'message_item_div']" @click="selectType(3)"> 
                   <i class="fa fa-user-plus"></i> 关注  <span v-show="attention_unread_count > 0">{{attention_unread_count}}</span>
               </div>
               <div v-bind:class="[type == 4?'message_item_div_selected':'message_item_div']" @click="selectType(4)"> 
                   <i class="fa fa-wechat"></i> 私信  <span v-show="chats_unread_count > 0">{{chats_unread_count}}</span>
               </div>
            </div>
            <div class="message_content" v-loading="loading">
                <div v-if="type==1" style="width:100%" >
                     收到的评论
                    <div  v-for="item in comments" v-bind:key="item.id">
                        <hr>
                        <div style="display:flex">
                                 <img style="height:40px;width:40px;object-fit:cover;border-radius:20px" :src="item.user_info.user_image_url" alt="">
                                 <div style="align-self:center;margin-left:10px;width:100%">
                                 <div style="font-size:14px;color:#333333"> 你的文章  <a :href="gotoArticle(item)" >
                                     《{{item.comment_project_title}}》</a> 下有一条来自<span>{{item.user_info.user_real_name}}</span>的新评论
                                </div>
                                 <div class="message_time" >
                                     <div>{{formatDate(item.message_time)}}</div><div @click="gotoArticleToComment(item)" style="cursor:pointer" >查看对话</div>
                                 </div>
                            </div>
                        </div>
                        <div style="font-size:16px;margin-top:10px;color:#333333">
                            {{item.content}}
                        </div>
                    </div>
                    <emptyHint v-show="comments.length == 0 && !loading"></emptyHint>
                </div>
                 <div v-if="type==2" style="width:100%" >
                     收到的喜欢和赞
                    <div  v-for="item in likes" v-bind:key="item.id">
                        <hr>
                        <div style="display:flex">
                                 <img style="height:40px;width:40px;object-fit:cover;border-radius:20px" :src="item.user_info.user_image_url" alt="">
                                 <div style="align-self:center;margin-left:10px;width:100%">
                                 <div style="font-size:14px;color:#333333"> <span>{{item.user_info.user_real_name}}</span>喜欢了你的文章 
                                 <a :href="gotoArticle(item)">《{{item.comment_project_title}}》</a></div>
                                 <div class="message_time" >
                                     <div>{{formatDate(item.message_time)}}</div>
                                 </div>
                            </div>
                        </div>
                       
                    </div>
                    <emptyHint v-show="likes.length == 0 && !loading"></emptyHint>
                </div>
                 <div v-if="type==3" style="width:100%" >
                     全部关注
                    <div  v-for="item in attentions" v-bind:key="item.id">
                        <hr>
                        <div style="display:flex">
                                 <img style="height:40px;width:40px;object-fit:cover;border-radius:20px;cursor:pointer"
                                 @click="gotoUserInfo(item)"  :src="item.user_info.user_image_url" alt="">
                                 <div style="align-self:center;margin-left:10px;width:100%">
                                 <div style="font-size:14px;color:#333333"> <span>{{item.user_info.user_real_name}}</span>关注了你
                                 </div>
                                 <div class="message_time" >
                                     <div>{{formatDate(item.message_time)}}</div>
                                 </div>
                            </div>
                        </div>
                    </div>
                     <emptyHint v-show="attentions.length == 0 && !loading"></emptyHint>
                </div>
                <div v-if="type==4" style="width:100%" >
                     收到的信息
                    <div  v-for="item in chats" v-bind:key="item.id">
                        <hr>
                        <div style="display:flex;cursor:pointer" @click="gotoChat(item)">
                                 <img style="height:40px;width:40px;object-fit:cover;border-radius:20px" :src="item.user_info.user_image_url" alt="">
                                 <div style="align-self:center;margin-left:10px;width:100%">
                                 <div style="font-size:14px;color:#333333;display:flex;align-items:center;justify-content:space-between"> 
                                     <div>{{item.user_info.user_real_name}}</div> <div>{{formatDate(item.chat_info.time)}}</div>
                                 </div>
                                 <div  style="font-size:14px;margin-top:5px;color:#555555" >
                                     {{item.chat_info.chat_content}}
                                 </div>
                            </div>
                        </div>
                       
                    </div>
                     <emptyHint v-show="chats.length == 0 && !loading"></emptyHint>
                </div>
            </div>
          </div>
       
          <blogFoot></blogFoot>
      </div>
</template>

<script>
import {userGetUndreaMessage,userGetUndreaMessageCount} from '../../../store/service'
import emptyHint from './../com/emptyHint.vue'
import loadMore from './../com/loadMore.vue'

import blogFoot from './../com/blogFoot.vue'
    export default {
        data(){
            return {
                userId:0,
                isLoadinMore:false,
                type:1,
                loading:false,
                itemCount:0,
                comment_unread_count:0,
                like_unread_count:0,
                attention_unread_count:0,
                chats_unread_count:0,
                comments:[],
                likes:[],
                attentions:[],
                chats:[]
            }
        },
        async mounted(){
            this.userId = this.$route.params.userId
            this.type = this.$route.params.type
            this.getMessageUnreadCount()
            this.getMessagesWithType()
            console.log('message_count')
            
        },
        methods:{
           async getMessageUnreadCount(){
                let res = await userGetUndreaMessageCount()
                if(res.code != 0){
                    return
                }
                console.log(res)
                setStore('message_count',res.data)
                this.comment_unread_count = res.data.comment_unread_count
                this.like_unread_count = res.data.like_unread_count
                this.attention_unread_count = res.data.attention_unread_count
                this.chats_unread_count = res.data.notice_unread_count
           },
           async getMessagesWithType(){
               this.loading = true
               let res =  await userGetUndreaMessage(this.type)
               this.loading = false
               if(res.code != 0){
                   toast(self,res.cMsg)
                   return
               }
               switch (this.type) {
                   case 1:
                       this.comments = res.data
                       if(this.comment_unread_count < this.comments.length){
                           this.comment_unread_count = 0
                       }
                       else{
                           this.comment_unread_count -= this.comments.length
                       }
                       break;
                    case 2:
                       this.likes = res.data
                       if(this.like_unread_count < this.likes.length){
                           this.like_unread_count = 0
                       }
                       else{
                           this.like_unread_count -= this.likes.length
                       }
                       break;
                    case 3:
                        this.attentions = res.data
                        if(this.attention_unread_count < this.attentions.length){
                           this.attention_unread_count = 0
                       }
                       else{
                           this.attention_unread_count -= this.attentions.length
                       }
                        break;
                    case 4:
                        this.chats = res.data;
                        break
                   default:
                       break;
               }
               let counts = getStore('message_count')
               counts.comment_unread_count = this.comment_unread_count
               counts.like_unread_count = this.like_unread_count
               counts.attention_unread_count = this.attention_unread_count
               counts.notice_unread_count = this.chats_unread_count
               setStore('message_count',counts)
           },
           selectType(type){
               if(this.type != type){
                   this.type = type
                   this.getMessagesWithType()
                   window.location.href = window.location.href.substring(0,window.location.href.length - 1) + type
                   //这招改URL的方式可行
               }
               
           },
           formatDate(time){
                let date = parseInt(time)
                date = new Date(date)
                let now = new Date()
                let prev = new Date(now.getTime() - 1000 * 60 * 60 * 24)
                if(now.getFullYear() == date.getFullYear() && now.getMonth() == date.getMonth() && now.getDay() == date.getDay()){
                    return formatTime(time,'hh:mm')
                }
                else if(prev.getFullYear() == date.getFullYear() && prev.getMonth() == date.getMonth() && prev.getDay() == date.getDay()){
                    return 'Yesterday ' + formatTime(time,'hh:mm')
                }
                else if(prev.getFullYear() == date.getFullYear()){
                    return formatTime(time,'MM dd  hh:mm')
                }
                else{
                    return formatTime(time,'yyyy MM dd  hh:mm')
                }
          },
          gotoArticle(item){
              return '#/article/' + item.comment_project_id
          },
          gotoArticleToComment(item){
              this.$router.push('/article/'+item.comment_project_id + '/comment')
          },
          gotoUserInfo(item){
               this.$router.push('/userInfo/' + item.sender_id + '/articles')
          },
          gotoChat(item){
              
              this.$router.push('/chat/'+item.sender_id)
          }
        },
        components:{
               emptyHint,blogFoot,loadMore
        },
    }
</script>

<style scoped>
.main-page{
    background: white;
    margin-top: 70px;
    border-top: 5px solid deepskyblue;
    min-height: 700px;
    display: flex;
}
.message_item{
    min-width: 200px;
    border-right: 2px solid peru;
}
.message_content{
    display: flex;
    padding: 12px 20px 10px 20px;
    margin-bottom: 2px;
    width: 100%;
}
.message_item_div{
    padding: 10px 10px 10px 20px;
    cursor: pointer;
}

.message_item_div_selected{
    padding: 10px 10px 10px 20px;
    cursor: pointer;
    background-color: #dddddddd;
}

.message_item div:hover{
    background: #dddddddd
}

.message_item div i{
    color: orangered;
    margin-right: 5px;
    font-size: 20px;
}

.message_item div span{
   float: right;
   background-color: red;
   width: 16px;
   height: 16px;
   border-radius: 8px;
   text-align: center;
   color: white;
    margin-top: 3px;
}


.attentionedUsers:hover{
    cursor: pointer;
    background: #dddddddd;
}
.message_time{
   font-size:12.5px;color:#666666;display:flex;justify-content:space-between
}

</style>
