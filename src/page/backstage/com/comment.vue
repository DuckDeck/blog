<template>
    <div class="commentCell">
         

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
            <el-button class="deleteMainComment" v-show="editMode" size="small" @click = "checkComment(comment)">删除</el-button>
       </div>
       <div class="commentContent">
           {{comment.comment_content}}
       </div>
       <div class="subComments" v-show = "subCommentCount > 0">
           <div v-for = "subCom in comment.sub_comments">
               <div>
                   <span style="color: darkorange">{{subCom.userInfo.user_name}}</span> 回复 
                   <span style="color: dodgerblue">@{{subCom.targetUserInfo.user_name}} </span>: {{subCom.comment_content}}
                    <el-button class="deleteMainComment" v-show="editMode" size="small" @click = "checkComment(subCom)">删除</el-button>
               </div> 
               <div>
                   <span class="subCommentTime">{{formatData(subCom.comment_time)}}</span>
                   
               </div>
            
           </div>
       </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
               
            }
        },
         props:{
            comment:{
               type: Object,
            },
            editMode:{
                type:Boolean,
                default:false
            }
        },
        mounted(){
            
        },
        methods:{
             formatData(time){
               return formatTime(new Date(time))
             },
             checkComment(com){
                 this.$emit('deleteComment',com)
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
.commentCell{
    border-bottom: 1px solid #ddd;
    margin-bottom: 30px;
    padding-bottom: 15px;
}
.articleNameClass{
    font-size: 25px;
    margin-bottom: 20px;
}

.commentUserInfo{
    vertical-align: middle;
    font-size: 20px;
    
    padding-bottom: 5px;
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