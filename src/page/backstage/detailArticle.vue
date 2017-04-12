<template>
    <div>
         <div class="featureTitle">
            文章信息
          </div>
          
          <div style="font-size: 40px;text-align: center;margin-top: 20px;">
                    {{articleDetail.article_name}}
         </div>

         <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="文章详情" name="articleDetail">
                <header>
 
                <div class="articleInfoClass">
                    发布于<span>{{releaseDate}}</span>  <span>  {{articleDetail.sort_name}}</span> <span>  {{articleDetail.article_click}}</span>浏览
                </div>
                <div  class="articleTagClass">
                        <el-tag  v-for="t in articleDetail.tags"   type="primary"  >{{t.tag_name}}</el-tag>
                </div>
            </header>
            <div class="articleSeperateLine"></div>
            <article class="articleContentClass" v-html = "articleDetail.article_content"></article>
         </el-tab-pane>
            <el-tab-pane label="作者信息" name="authorInfo">
                <userInfoShow :userInfo ="userInfo" ></userInfoShow>
            </el-tab-pane>
            <el-tab-pane label="文章评论" name="third">
               <comment v-for="comment in comments" :comment = "comment"></comment>
            </el-tab-pane>
            
        </el-tabs>

       
    </div>
</template>

<script>
import {commentsByArticleId} from '../../store/service'
import {articleById,userInfoById} from '../../store/manageService'
import userInfoShow from './com/userInfoShow.vue'
import comment from './com/comment.vue'
    export default {
        data: function(){
            return {
                activeName:'articleDetail',
                articleDetail:{},
                userInfo:{},
                comments:[]
            }
        },
        async mounted(){
            let id = this.$route.params.id
            let res =  await articleById(id)
            if(res.code == 0){
                  this.articleDetail = res.data
            }
            else{
                toast(self,res.cMsg)
            }
            res = await userInfoById(this.articleDetail.user_id)
            if(res.code == 0){
                  this.userInfo = res.data
            }
            else{
                toast(self,res.cMsg)
            } 
            res = await commentsByArticleId(this.articleDetail.article_id)
            if(res.code == 0){
                  this.comments = res.data
            }
            else{
                toast(self,res.cMsg)
            } 

        },
        methods:{
            handleClick(tab,event){
                
            }
        },
        computed:{
            releaseDate(){
                return  formatTime(new Date(this.articleDetail.article_create_time))
            }
        },
        components:{
            userInfoShow,comment
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