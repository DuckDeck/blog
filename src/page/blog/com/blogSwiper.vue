
<template>
    <el-carousel class="swiperArticle"  height="15rem">
        <el-carousel-item v-for="art in articles">
         <div >
               <img :src="art.article_main_img" alt="" class="swiperImg">
                <div class="swiperArticleInfo">
                    <div class="swiperArticleTitle" @click="gotoArticle(art)">
                        {{art.article_name}}
                    </div>
                   
                </div>
       </div>
            
        </el-carousel-item>
       
    </el-carousel>
</template>

<script>
    export default {
        data() {
            return{
            }
        },
        props:{  
          articles:{
            type:Array
          }
        },
        methods:{
           gotoArticle(article){
              this.$router.push('/article/'+article.article_id)
           }
        },
    }
</script>
<style scoped>
.swiperArticle{
    height: 15rem;
}
.swiperImg{
    width: 100%;
    opacity: 0.5
}

/*.swiperImg:before{
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(1, 1, 1, 0.5)
}*/
.swiper-wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    transition-property: transform;
    box-sizing: content-box;
}
.swiperArticleInfo{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}
.swiperArticleTitle{
    color: white;
    font-size: 1.5rem;
    text-align: center;
    margin-top: 8rem;
}
.swiperArticleTitle:hover{
    cursor: pointer
}
.swiperArticleBrief{
    font-size: 0.3rem;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
    color: white;
}
</style>
