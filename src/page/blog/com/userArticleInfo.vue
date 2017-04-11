<template>
    <div class="articleUserInfo">
        <img :src="userInfo.user_image_url" class="userArticleHead" alt="">
        <div class="articleUserDetail">
            <div>
                <span class="articleAuthorTag">作者</span> <span>{{userInfo.user_real_name}}</span>
            </div>
            <div class="articleReleaseTime">
                <span>发布于:{{articleReleaseTime}}  </span> <span>  文章数{{userInfo.article_count}}</span>
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
          userInfo:{
            type:Object
          }
        },
        computed:{
           articleReleaseTime(){
               return formatTime(new Date(this.userInfo.article_release_time))
           }
        },
    }
</script>
<style scoped>
.articleUserInfo{
    font-size: 16px;
    display: flex;
}
.userArticleHead{
 width: 44px;
 height: 44px;
 border-radius: 44px;
 border: 1px solid #bbb;
}
.articleUserDetail{
    margin-left: 15px;
}
.articleAuthorTag{
    color: mediumvioletred;
    border: 1px solid mediumvioletred;
    padding: 2px;
    border-radius: 2px;
}
.articleReleaseTime{
    font-size: 14px;
    color: #aaa;
}
</style>
