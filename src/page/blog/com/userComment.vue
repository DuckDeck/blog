<template>
    <div class="commentBigCell">
       <div class="commentUserInfo">
           <img :src="comment.userInfo.user_image_url" @click="userHeadClick" alt="">
            <div style="display: inline-block;vertical-align: middle">
                <div class="userNameDiv">
                    {{comment.userInfo.user_real_name}}
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

       <div class="subComments" v-show = "subCommentCount > 0">
           <div v-for = "subCom in comment.sub_comments">
               <div>
                   <span style="color: darkorange">{{subCom.userInfo.user_real_name}}</span> 回复 
                   <span style="color: dodgerblue">@{{subCom.targetUserInfo.user_real_name}} </span>: {{subCom.comment_content}}
               </div> 
               <div>
                   <span class="subCommentTime">{{formatData(subCom.comment_time)}}</span>
                   <a class="subCommentReplay" @click="writeSubComment(subCom)"><i class="fa fa-comment-o"></i>回复</a>
               </div>
           </div>
       </div>
       <writeComment style="margin-top: 10px;" :needCancel="true"  @cancelComment="cancelComment"  v-show = "isShowWriteComment" 
       @submitComment = "submitComment" :placeHolder="placeHolder" ref='writeCommentCom'></writeComment>
    </div>
</template>
<script>
import writeComment from './writeComment.vue'
import {submitComment,getComment} from '../../../store/service'
    export default {
    data() {
        return{
           isShowWriteComment:false,
           currentCom:{},
           placeHolder:'写下你的评论...'
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
           this.currentCom = {}
           this.placeHolder = '写下你的评论...'
           this.isShowWriteComment = true
       },
       userHeadClick(){
            this.$emit("userHeadClick",this.comment.userInfo)
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
           let comment = {}
           //判断是哪种评论
           if(isEmpty(this.currentCom)){
             comment = {
                commentContent:com,
                commentTargetId:this.comment.comment_id,
                commentTargetUserId:this.comment.userInfo.user_id,
                commentScope:this.comment.comment_id,
                commentType:0
              }
           }
           else{
             comment = {
                commentContent:com,
                commentTargetId:this.currentCom.comment_id,
                commentTargetUserId:this.currentCom.userInfo.user_id,
                commentScope:this.comment.comment_id,
                commentType:1
              }
           }
           
           let res = await submitComment(comment)
           toast(this,res.cMsg)
           if(res.code == 0){
                this.$emit('refreshComment',this.comment.comment_id)
                res = await getComment(this.comment.comment_id)
                if(res.code == 0){
                   this.comment = res.data //the vue will warn  can not mutating the property.......
                }   
                this.isShowWriteComment = false
                this.$refs.writeCommentCom.clear()
           }
       },
       writeSubComment(com){
           this.isShowWriteComment = true
           this.placeHolder = "@" + com.userInfo.user_name
           this.currentSub = com
       },
       formatData(time){
            return formatTime(new Date(time))
       }
    },
    computed:{
        formatedDate(){
            return formatTime(new Date(this.comment.comment_time))
        },
        subCommentCount(){
            return this.comment.sub_comments.length == 0 ? '' : this.comment.sub_comments.length
        },
       
    }

}
</script>
<style >
.commentBigCell{
    margin-bottom: 30px;
}
.commentUserInfo{
    vertical-align: middle;
    font-size: 20px;
    
}
 .commentUserInfo img{
     width: 38px;
     height: 38px;
     border-radius: 20px;
     border: 1px solid #888;
     display: inline-block;
     vertical-align: middle;
 }
 .userNameDiv{
     font-size: 13px;
     color: #666;
 }
 .userCommentTimeDiv{
    font-size: 11px;
    color: #aaa;
 }
 .commentContent{
     font-size: 16px;
     margin-top: 10px;
     color: #555;
 }
 .iconComment{
     font-size: 13px;
     margin-top: 5px;
     float: right;
      margin-top: -5px;
 }
  .iconComment a:hover{
      cursor: pointer;
  }
  .iconComment a i{
    color: #777;
    margin-right: 3px;
   
  }
  .subComments{
     color: #555;
      border-left: 1px solid #aaa;
      padding-left: 15px;
      margin-top: 20px;
      margin-bottom: 5px;
      font-size: 16px;

  }
  .subCommentTime{
      font-size: 12px;
      color: #777;
  }
  .subCommentReplay{
      margin-left: 8px;
      font-size: 13px;
  }
</style>
