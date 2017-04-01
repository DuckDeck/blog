<template>
    <div>
       <div class="featureTitle">
          仪表盘
        </div>
       <div class="meterContentClass">
           <div class="meterMenu">
               <div class="articleStatus">
                   <img  src="/static/img/pen.jpeg" alt="">
                   <div >
                        <span>发表了</span>
                        <span class="meterMenuCount">{{meter.articleCount}}</span>
                        <span>篇文章</span>
                   </div>    
               </div>
               <div class="articleStatus">
                   <img src="/static/img/text.jpeg" alt="">
                   <div>
                        <span>收到了</span>
                        <span class="meterMenuCount">{{meter.commentCount}}</span>
                        <span>条留言</span>
                   </div>
               </div>
               <div class="articleStatus">
                   <img src="/static/img/file.jpeg" alt="">
                   <div>
                       <span>上传了</span>
                       <span class="meterMenuCount">{{meter.fileCount}}</span>
                       <span>个文件</span>
                   </div>
               </div>
           </div>
          <div class="newestList" > 
            <div style="width: 49%" >
                <div class="newestTitle" >
                    最新文章
                </div>
                <div class="newestArticleTitle">
                  <div v-for="artilce in meter.myNewArticle">
                      <a @click="toArticle(artilce)">{{artilce.article_name}}</a>
                  </div>
                   
                </div>
            </div>

            <div style="width: 49%" >
                <div class="newestTitle">
                    最新留言(评论)
                </div>
                <div  class="newestArticleTitle">
                     <div v-for="comment in meter.myNewComment">
                     <a>{{comment.commenter}}</a>  <a style="color: #222">于{{formatData(comment.comment_time)}}</a> 说:<a>{{comment.comment_content}}</a>
                  </div>
                </div>
            </div>
        </div>
       </div>

    </div>
</template>

<script>
import {getMeter} from '../../store/service'

    export default {
        data: function(){
            return {
                meter:{}
            }
        },
        mounted(){
            getMeter().then(res=>{
                if(res.code == 0){
                    this.meter = res.data
                }
                else{
                    toast(this,res.ChineseMsh)
                }
            }).catch(err=>{
                toast(this,err.ChineseMsg)
            })
        },
        methods:{
            toArticle(article){
                this.$router.push('/manage/article/' + article.article_id);
            },
            formatData(time){
                 return formatTime(new Date(time))
            }
        },
        
    }
</script>

<style >
 .meterContentClass{
    margin-top: 40px;
 }
 .articleStatus{
     background: deepskyblue;
     padding: 20px;
     color: white;
     display: flex;
     min-width: 200px;
     margin-right: 20px;
 }
.articleStatus div{
    width: 40%;
    margin-left: 40px;
}
.articleStatus div span{
    display:  block;
    text-align: right
}
.meterMenuCount{
    font-size: 18px;
    color: wheat
}
 .meterMenu{
     display: flex;
     font-size: 12px;
     justify-content: flex-start;
 }
 .meterMenu div img{
     width: 60px;
     height: 60px;
     margin-right: 10px;
 }
 .newestList{
     font-size: 14px;
     display: flex;
     margin-top: 80px;
     justify-content: space-between
 }
 .newestTitle{
    background: #eee;
    padding: 10px;
 }
 .newestArticleTitle{

 }
 .newestArticleTitle div{
     border-left: 1px solid #ddd;
     border-right: 1px solid #ddd;
     border-top: 1px solid #ddd;
     padding: 10px;
     color: dodgerblue;
 }
  .newestArticleTitle:last-child{
      border-bottom: 1px solid #ddd;
  }
  .newestArticleTitle div a:hover{
      cursor: pointer;
  }
</style>