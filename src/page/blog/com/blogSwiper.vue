
<template>
    <swiper class="swiperArticle" :options="swiperOption" >
        <swiper-slide v-for="art in articles">
         <div>
               <img :src="art.article_main_img" alt="" class="swiperImg">
                <div class="swiperArticleInfo">
                    <div class="swiperArticleTitle" @click="gotoArticle(art)">
                        {{art.article_name}}
                    </div>
                    <div class="swiperArticleBrief" >
                        {{art.article_brief.slice(0,50)}}...
                    </div>
                </div>
         </img> 
       </div>
            
        </swiper-slide>
        <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>
</template>

<script>
    export default {
        data() {
            return{
              swiperOption: {
                autoplay: 3500,
                setWrapperSize :true,
                pagination : '.swiper-pagination',
                paginationClickable :true,
                mousewheelControl : true,
                observeParents:true,
              },
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
    height: 5.5rem;
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

.swiperArticleInfo{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}
.swiperArticleTitle{
    color: white;
    font-size: 0.42rem;
    text-align: center;
    margin-top: 2.4rem;
}
.swiperArticleTitle:hover{
    cursor: pointer
}
.swiperArticleBrief{
    font-size: 0.22rem;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 20px;
    color: white;
}
</style>
