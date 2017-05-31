<template>
    <div class="articleCellClass">
        <div class="articleCellUserInfo">
            <img :src="commentInfo.user_info.user_image_url" alt="">
            <span>{{commentInfo.user_info.user_real_name}}</span>
            发表了评论
            <span>{{createTime}}</span>
        </div>
        <div class="commentDetail" v-if = "commentInfo.comment_scope == 0">
           <div class="dynamicCommentContent">
               {{commentInfo.comment_content}}
           </div>

           <div class="dynamicCommentArticleInfo">
               <div class="articleCellContentTitle" >
                    {{commentInfo.target.article_name}}
               </div>
                <p style="margin-bottom: 0rem;margin-top: 10px;">{{commentInfo.target.article_brief.slice(0,100)}}</p>  
               <div class="dynamicCommentArticlelTail">
                  <span >{{commentInfo.target.user_real_name}}</span>    <i class="fa fa-eye"  aria-hidden="true"></i>
                            {{commentInfo.target.article_click}} 
                             <i class="fa fa-comment"  aria-hidden="true"></i> {{commentInfo.target.comment_count}} 
         
               </div>
             </div>
        </div>
        <div class="commentDetail" v-if = "commentInfo.comment_scope > 0">
           <div class="dynamicCommentContent">
               {{commentInfo.comment_content}}
           </div>
           <div class="dynamicCommentParentContent">
                    {{commentInfo.target.comment_content}}
                    <div class="dynamicCommentArticlelTail">
                        <span >{{commentInfo.target.user_real_name}}</span>发布于{{formaTime(commentInfo.target.comment_time)}}
                    </div>  

                </div> 
        </div>
    </div>
</template>
<script>
 export default {
    data() {
        return{
           
        }
    },
    props:{  
         commentInfo:{
             type:Object
         }
    },
    methods:{
        formaTime(time){
             return moment(time)
        }
    },
    computed:{
        createTime(){
            return moment(this.commentInfo.comment_time)
        }
    }
}
</script>
<style>
.commentDetail{
    font-size: 16px;
    margin-top: 20px;
}
</style>