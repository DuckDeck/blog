<template>
    <div class="articleCellClass">
        <div class="articleCellUserInfo" @click="userHeadClick">
            <img :src="articleInfo.user_info.user_image_url" alt="">
            <span class="articleCellUserName">{{articleInfo.user_info.user_real_name}}</span>
            <span>{{createTile}}</span>
        </div>
        <div class="articleCellContent">
            <div >
               <span @click="togoArticle" class="articleCellContentTitle" v-html= "articleInfo.article_name" ></span>
               <p style="margin-bottom: 0rem;margin-top: 10px;" v-html = "articleInfo.article_brief.slice(0,100)" ></p>
               <div class="articleTailInfo">
                <span v-if="showSortname" class="articleTailSortName">{{articleInfo.article_sort_name}}</span> <i class="fa fa-eye"  aria-hidden="true"></i>
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
        togoArticle(){
             this.$router.push('/article/'+ this.articleInfo.article_id)
        },
        userHeadClick(){
            this.$emit("userHeadClick",this.articleInfo.user_info)
        }
    },
    computed:{
        createTile(){
            return moment(this.articleInfo.article_create_time)
        },
        showSortname(){
            if(!this.articleInfo)
                return false
            if(!this.articleInfo.article_sort_name)
                return false
            if(this.articleInfo.article_sort_name.length == 0){
                return false
            }
            return true
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
    justify-content: space-between;
}
.articleCellContentTitle{
    font-size: 18px;
    font-weight: bold;
    color: #666;

}
.articleCellContenImg{
    width: auto;
    height: 140px;
    margin-left: 10px;
}
.articleCellUserInfo{
    font-size: 14px;
}
.articleCellUserInfo img{
    width: 40px;
    height: 40px;
    border-radius: 20px;
}
.articleCellUserInfo:hover{
    cursor: pointer;
}
.articleCellUserName{
 margin-left: 10px;   
}
.articleCellContentTitle:hover{
    text-decoration: underline;
    cursor: pointer;
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
        display: none;
    }
 } 
</style>