<template>
    <div class="articleCellClass">
        <div class="articleCellUserInfo">
            <img :src="articleInfo.user_image_url" alt="">
            <span class="articleCellUserName">{{articleInfo.user_name}}</span>
            <span>{{createTile}}</span>
        </div>
        <div class="articleCellContent">
            <div >
               <span class="articleCellContentTitle">{{articleInfo.article_name}}</span>
               <p style="margin-bottom: 0rem;margin-top: 10px;">{{articleInfo.article_brief.slice(0,100)}}</p>
               <div class="articleTailInfo">
                <span class="articleTailSortName">{{articleInfo.article_sort_name}}</span> <i class="fa fa-eye"  aria-hidden="true"></i>
                    {{articleInfo.article_click}}  <i class="fa fa-comment"  aria-hidden="true"></i> {{articleInfo.comment_count}} 
                </div>
            </div>
            <img class="articleCellContenImg" v-if="articleInfo.article_main_img.length > 0" :src="articleInfo.article_main_img" alt="">
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
.articleCellClass{
    margin: 20px 0px;
    border-bottom: 1px solid #aaa;
    padding-bottom: 15px;
}
.articleCellContent{
    margin-top: 10px;
    display: flex;
    font-size: 15px;
    color: #555;
}
.articleCellContentTitle{
    font-size: 18px;
    font-weight: bold;
    color: #444;

}
.articleCellContenImg{
    width: 150px;
    height: 140px;
    margin-left: 10px;
}
.articleCellUserInfo{
    font-size: 15px;
}
.articleCellUserInfo img{
    width: 40px;
    height: 40px;
    border-radius: 20px;
}
.articleCellUserName{
 margin-left: 10px;   
}
.articleTailInfo{
    font-size: 12px;
    color: #888;
    margin-top: 10px;
}
.articleTailSortName{
    color: orangered;
    padding: 1px;
    border: 1px solid orangered;
    border-radius: 3px;
    margin-right: 5px;
}
 @media (max-width:900px){
     .articleCellContenImg{
        width: 150px;
        height: 140px;
        margin-left: 10px;
    }
 } 
</style>