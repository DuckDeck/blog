<template>
    <div class="articleCellClass">
        <div class="articleCellUserInfo">
            <img :src="articleInfo.user_image_url" alt="">
            <span>{{articleInfo.user_name}}</span>
            <span>{{createTile}}</span>
        </div>
        <div class="articleCellContent">
            <div >
               <span class="articleCellContentTitle">{{articleInfo.article_name}}</span>
               <p style="margin-bottom: 0rem">{{articleInfo.article_brief.slice(0,100)}}</p>
            </div>
            <img class="articleCellContenImg" v-if="articleInfo.article_main_img.length > 0" :src="articleInfo.article_main_img" alt="">
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

.articleCellContent{
    margin-top: 10px;
    display: flex;
    font-size: 16px;
    color: #555;
}
.articleCellContentTitle{
    font-size: 20px;
    font-weight: bold;
    color: #444;
    margin-bottom: 5px;
}
.articleCellContenImg{
    width: 150px;
    height: 140px;
    margin-left: 10px;
}
.articleCellUserInfo{
    font-size: 16px;
}
.articleCellUserInfo img{
    width: 40px;
    height: 40px;
    border-radius: 20px;
}
.articleTailInfo{
    font-size: 20px;
}
</style>