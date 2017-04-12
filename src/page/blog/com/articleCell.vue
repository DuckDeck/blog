<template>
    <div class="articleCellClass">
        <div class="articleCellUserInfo">
            <img src="" alt="">
            <span>{{articleInfo.user_name}}</span>
            <span>{{createTile}}</span>
        </div>
        <div class="articleContent">
            <div>
               <span>{{articleInfo.article_name}}</span>
               <p>{{articleInfo.article_brief}}</p>
            </div>
            <img v-if="articleInfo.article_main_img.length > 0" :src="articleInfo.article_main_img" alt="">
        </div>
        <div class="articleTailInfo">
           {{articleInfo.article_sort_name}} <i class="fa fa-eye"  aria-hidden="true"></i>
            {{articleInfo.article_click}}  <i class="fa fa-comment"  aria-hidden="true"></i> {{articleInfo.comment_count}} 
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
         articleInfo:{
             type:Object
         }
    },
    methods:{
        
    },
    computed:{
        createTile(){
            return formatTime(new Date(this.articleInfo.article_create_time))
        }
    }
}
</script>
<style>
.articleContent{
    display: flex;
}
.articleContent img{
    width: 200px;
    height: 200px;
}
</style>