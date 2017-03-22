<template>
    <div>
       <header>
           <div style="font-size: 30px">
               {{articleDetail.article_name}}
           </div>
           <div class="articleInfoClass">
               发布于<span>{{releaseDate}}</span>  <span>  {{articleDetail.sort_name}}</span> <span>  {{articleDetail.article_click}}</span>浏览
           </div>
           <div  class="articleTagClass">
                <el-tag  v-for="t in articleDetail.tags"   type="primary"  >{{t.tag_name}}</el-tag>
           </div>
       </header>
       <div class="articleSeperateLine"></div>
       <article class="articleContentClass" v-html = "articleDetail.article_content"></article>
    </div>
</template>

<script>
import {articleById} from '../../store/service'
    export default {
        data: function(){
            return {
                articleDetail:{}
            }
        },
        mounted(){
             let id = this.$route.params.id

            let self = this
            articleById(id).then(res=>{
                if(res.code == 0){
                    self.articleDetail = res.data
                }else{
                    toast(self,err.ChineseMsg)
                }
            }).catch(err=>{
                toast(self,err.ChineseMsg)
            })
             
            
        },
        computed:{
            releaseDate(){
                return  formatTime(new Date(this.articleDetail.article_create_time))
            }
        }
    }
</script>

<style scoped>
.articleInfoClass{
    font-size: 15px;
    margin-top: 10px;
    color: #888;
}
.articleInfoClass span{
    display: inline-block;
    margin-right: 5px;
}
.articleTagClass{
    font-size: 15px;
    margin-top: 15px;
}
.articleTagClass span{

    margin-right: 10px;

}
.articleSeperateLine{
    height: 1px;
    background: #999;
    margin-top: 20px;
}
.articleContentClass{
    margin-top: 20px;
    font-size: 20px;
}
</style>