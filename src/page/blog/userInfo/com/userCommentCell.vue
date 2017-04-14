<template>
    <div class="articleCellClass">
        <div class="articleCellUserInfo">
            <img :src="commentInfo.user_image_url" alt="">
            <span>{{commentInfo.user_name}}</span>
            发表了评论
            <span>{{createTime}}</span>
        </div>
        <div>
            
        </div>
        <div v-show = "commentInfo.comment_scope == 0">
           <div>
               {{commentInfo.comment_content}}
           </div>
           <div>
               <div>
                    {{commentInfo.target.article_name}}
               </div>
               <div>
                   {{commentInfo.target.article_brief}}
               </div>
               <div>
                   <span> {{commentInfo.target.user_real_name}}</span> <span> {{commentInfo.target.article_click}}</span> <span> {{commentInfo.target.comment_count}}</span>
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
        
    },
    computed:{
        createTime(){
            return formatTime(new Date(this.commentInfo.comment_time))
        }
    }
}
</script>
<style>

</style>