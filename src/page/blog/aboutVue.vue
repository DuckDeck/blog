<template>
     <div class="container">   
            <div class="main-page">          
                    <div class=" article-content">
                       <header>
                            <div  class="articleHeader" >
                                {{article.article_name}}
                            </div>
                            <userArtileInfo class="userArtileInfo" :userInfo="articleUserInfo"></userArtileInfo>
                            <div  class="articleTagClass">
                                  <el-tag  v-for="t in article.tags"   type="primary"  >{{t.tag_name}}</el-tag>
                            </div>
                       </header>
                    <div class="articleSeperateLine"></div>
                    <article class="articleContentClass" v-html = "article.article_content"></article>
                        <writeComment  @submitComment="submitComment" @refreshComment = "refreshComment"></writeComment>
                        
                    <div class="articleComments">
                        <div class="articleCommentsCount">
                            {{commentCount}}条评论  
                        </div>
                        <userComment v-for="com in article.comments" :comment="com" ></userComment>
                    </div>
                    </div>
                </div>
           <upToTop></upToTop>
           <blogFoot></blogFoot>
        </div> 
</template>

<script>
import blogLogo from './com/blogLogo.vue'

//todo comment sort feature
  export default {
    data() {
      return {
          article:{},
          articleUserInfo:{}
      }
    },
    async mounted(){
       
    },
    methods:{

    },
    components:{
        blogLogo
    },
    computed:{    
    }
  }
</script>
<style >


</style>