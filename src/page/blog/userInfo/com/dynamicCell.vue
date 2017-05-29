<template>
    <div class="articleCellClass">
        <div class="articleCellUserInfo">
            <img :src="dynamicInfo.user_info.user_image_url" alt="">
            <span>{{dynamicInfo.user_info.user_real_name}}</span>
            <span>{{dynamicInfo.dynamic_type_name}}</span>
            <span>{{createTime}}</span>
        </div>
         <div class="dynamicComment" v-if = "dynamicInfo.dynamic_type_id == 4">
           <div class="dynamicCommentContent">
               {{dynamicInfo.selfObject.comment_content}}
           </div>
           <div class="dynamicCommentArticleInfo">
               <div class="articleCellContentTitle" @click="togoArticle(dynamicInfo.targetObject.article_id)" >
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
           <div class="dynamicComment" v-if = "dynamicInfo.dynamic_type_id == 1">
            <div class="articleCellContent">
                <div >
                <span @click="togoArticle(dynamicInfo.selfObject.article_id)" class="articleCellContentTitle" v-html= "dynamicInfo.selfObject.article_name" ></span>
                <p style="margin-bottom: 0rem;margin-top: 10px;" v-html = "dynamicInfo.selfObject.article_brief.slice(0,100)" ></p>
                <div class="articleTailInfo">
                    <span class="articleTailSortName">{{dynamicInfo.selfObject.article_sort_name}}</span> <i class="fa fa-eye"  aria-hidden="true"></i>
                        {{dynamicInfo.selfObject.article_click}}  <i class="fa fa-comment"  aria-hidden="true"></i> {{dynamicInfo.selfObject.comment_count}} 
                    </div>
                </div>
                
            </div>
           </div>
            <div class="dynamicComment" v-if = "dynamicInfo.dynamic_type_id == 7">
                
                <div class="dynamicCommentContent">
                    {{dynamicInfo.selfObject.comment_content}}
                </div>
                <div class="dynamicCommentParentContent">
                    {{dynamicInfo.targetObject.comment_content}}

                    <div class="dynamicCommentArticlelTail">
                        <span >{{dynamicInfo.targetObject.user_real_name}}</span>发布于{{formaTime(dynamicInfo.targetObject.comment_time)}}
                    </div>  

                </div> 
                
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
        togoArticle(id){
            this.$emit('articleTitleClick',id)
        },
        formaTime(time){
             return moment(time)
        }
    },
    computed:{
        createTime(){
            return moment(this.dynamicInfo.dynamic_oper_time)
        },
        
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
    padding-left: 20px;
    border-left: 5px solid #999;
    margin-top: 10px;
}
.dynamicCommentArticlelTail{
    font-size: 12px;
    margin-top: 5px;
    color: #888;
}
.dynamicCommentParentContent{
    font-size: 14px;
     border-left: 5px solid #999;
    margin-top: 10px;
    padding-left: 20px;
}
</style>