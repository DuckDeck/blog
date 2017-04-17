<template>
    <div class="articleCellClass">
        <div class="articleCellUserInfo">
            <img :src="dynamicInfo.user_image_url" alt="">
            <span>{{dynamicInfo.user_name}}</span>
            <span>{{dynamicInfo.dynamic_type_name}}</span>
            <span>{{createTime}}</span>
        </div>
        <div class="dynamicComment" v-show = "dynamicInfo.dynamic_type_id == 4">
           <div class="dynamicCommentContent">
               {{dynamicInfo.selfObject.comment_content}}
           </div>
           <div class="dynamicCommentArticleInfo">
               <div class="articleCellContentTitle" >
                    {{dynamicInfo.targetObject.article_name}}
               </div>
                <p style="margin-bottom: 0rem;margin-top: 10px;">{{dynamicInfo.targetObject.article_brief.slice(0,100)}}</p>  
               <div class="dynamicCommentArticlelTail">
                  <span >{{dynamicInfo.targetObject.user_real_name}}</span>    <i class="fa fa-eye"  aria-hidden="true"></i>
                            {{dynamicInfo.targetObject.article_click}} 
                             <i class="fa fa-comment"  aria-hidden="true"></i> {{dynamicInfo.targetObject.comment_count}} 
         
               </div>
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
         dynamicInfo:{
             type:Object
         }
    },
    methods:{
        
    },
    computed:{
        createTime(){
            return formatTime(new Date(this.dynamicInfo.dynamic_oper_time))
        }
    }
}
</script>
<style>
.dynamicComment{
    margin-top: 20px;
}
.dynamicCommentContent{
    font-size: 16px;
}
.dynamicCommentArticleInfo{
    padding-left: 30px;
    border-left: 5px solid #999;
    margin-top: 10px;
}
.dynamicCommentArticlelTail{
    font-size: 12px;
    color: #888;
}
</style>