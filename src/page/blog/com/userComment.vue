<template>
    <div class="commentBigCell">
       <div class="commentUserInfo">
           <img :src="comment.userInfo.user_image_url" alt="">
            <div style="display: inline-block;vertical-align: middle">
                <div class="userNameDiv">
                    {{comment.userInfo.user_name}}
                </div>
                <div class="userCommentTimeDiv">
                    {{formatedDate}}
                </div>
            </div>
       </div>
       <div class="commentContent">
           {{comment.comment_content}}
       </div>
       <div class="iconComment" >
            <a @click="writeComment"><i class="fa fa-comment-o"></i>{{subCommentCount}}回复</a>
       </div>

       <!--<div class="subComments">
           
       </div>-->
       <writeComment style="margin-top: 5px;" :needCancel="true"  @cancelComment="cancelComment"  v-show = "isShowWriteComment" @submitComment = "submitComment"></writeComment>
    </div>
</template>
<script>
import writeComment from './writeComment.vue'
import {submitComment} from '../../../store/service'
    export default {
    data() {
        return{
           isShowWriteComment:false
        }
    },
    props:{
        comment:{
            type:Object
        }
    },
    components:{
        writeComment
    },
    methods:{
       writeComment(){
            this.isShowWriteComment = true
       },
       cancelComment(){
           this.isShowWriteComment = false
       },
       async submitComment(com){
           if(com == ''){
               toast(this,'评论内容不能为空')
           }
           if(com.trim() == ''){
               toast(this,'评论内容不能为空字符')
           }
           let comment = {
               commentContent:com,
               commentTargetId:this.comment.comment_id,
               commentTargetUserId:this.comment.userInfo.user_id
           }
           let res = await submitComment(comment)
           toast(this,res.ChineseMsg)
           if(res.code == 0){
                
           }
       }
    },
    computed:{
        formatedDate(){
            return formatTime(new Date(this.comment.comment_time))
        },
        subCommentCount(){
            return this.comment.sub_comments.length == 0 ? '' : this.comment.sub_comments.length
        }
    }

}
</script>
<style >
.commentBigCell{
    margin-bottom: 15px;
}
.commentUserInfo{
    vertical-align: middle;
    font-size: 20px;
    
}
 .commentUserInfo img{
     width: 40px;
     height: 40px;
     border-radius: 20px;
     border: 1px solid #888;
     display: inline-block;
     vertical-align: middle;
 }
 .userNameDiv{
     font-size: 15px;
 }
 .userCommentTimeDiv{
    font-size: 12px;
 }
 .commentContent{
     font-size: 16px;
     margin-top: 5px;
 }
 .iconComment{
     font-size: 15px;
     margin-top: 5px;
     float: right;
 }
  .iconComment a:hover{
      cursor: pointer;
  }
  .iconComment a i{
    color: #777;
  }
</style>
