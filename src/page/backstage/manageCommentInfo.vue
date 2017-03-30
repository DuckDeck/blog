<template>
    <div>

        <div class="articleNameClass">
            <span style="color: yellowgreen">{{articleName}}</span> 的评论
        </div>

         <div class="commentUserInfo">
           <img :src="comment.userInfo.user_image_url" alt="">
            <div style="display: inline-block;vertical-align: middle">
                <div class="userNameDiv">
                    {{comment.userInfo.user_name}}
                </div>
                <div class="userCommentTimeDiv">
                    {{formatData(comment.comment_time)}}
                </div>
            </div>
            <el-button class="deleteMainComment" size="small" @click = "checkComment(comment)">删除</el-button>
       </div>
       <div class="commentContent">
           {{comment.comment_content}}
       </div>
 

       <div class="subComments" v-show = "subCommentCount > 0">
           <div v-for = "subCom in comment.sub_comments">
               <div>
                   <span style="color: darkorange">{{subCom.userInfo.user_name}}</span> 回复 
                   <span style="color: dodgerblue">@{{subCom.targetUserInfo.user_name}} </span>: {{subCom.comment_content}}
               </div> 
               <div>
                   <span class="subCommentTime">{{formatData(subCom.comment_time)}}</span>
                   <a class="subCommentReplay" @click="writeSubComment(subCom)"><i class="fa fa-comment-o"></i>回复</a>
               </div>

           </div>
       </div>
          <el-dialog title="提示" v-model="dialogVisible" size="tiny">
            <span>{{deleteMessage}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteArticleConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {getComment} from '../../store/service'
    export default {
        data() {
            return {
                articleName:'',
                comment:{},
                dialogVisible:false,
                currentDeleteComment:{},
                deleteMessage:''
            }
        },
        mounted(){

          let id = this.$route.params.articleId
          this.articleName = getStore('currentCommentArticleTitle')
          let that = this
           getComment(id).then(resCom=>{
               if(resCom.code == 0){
                   that.comment = resCom.data
               }
           })
         
        },
        methods: {
             formatData(time){
               return formatTime(new Date(time))
             },
             checkComment(comment){
                this.dialogVisible = true
                this.currentDeleteComment = comment
                this.deleteMessage = '你要删除 ' + comment.comment_content +' 评论吗'
             },
             deleteArticleConfirm(){
                this.dialogVisible = false
                //delete comment is unavaileble
             }
        },
        computed:{
            subCommentCount(){
              return this.comment.sub_comments.length == 0 ? '' : this.comment.sub_comments.length
            },
        }
    }
</script>
<style>
.articleNameClass{
    font-size: 25px;
    margin-bottom: 20px;
}

.commentUserInfo{
    vertical-align: middle;
    font-size: 20px;
    border-bottom: 1px solid #aaa;
    padding-bottom: 10px;
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
 .deleteMainComment{
     float: right
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
.el-dialog__headerbtn{
    display:  none;
}
</style>