<template>
    <div class="articleCellClass">
        <div class="articleCellUserInfo">
            <img :src="dynamicInfo.user_image_url" alt="">
            <span>{{dynamicInfo.user_name}}</span>
            <span>{{dynamicInfo.dynamic_type_name}}</span>
            <span>{{createTime}}</span>
        </div>
        <div v-show = "dynamicInfo.dynamic_type_id == 4">
           <div>
               {{dynamicInfo.selfObject.comment_content}}
           </div>
           <div>
               <div>
                    {{dynamicInfo.targetObject.article_name}}
               </div>
               <div>
                   {{dynamicInfo.targetObject.article_brief}}
               </div>
               <div>
                   <span> {{dynamicInfo.targetObject.user_real_name}}</span> <span> {{dynamicInfo.targetObject.article_click}}</span> <span> {{dynamicInfo.targetObject.comment_count}}</span>
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

</style>