<template>

     <div class="container">
        <div class="row">         
            <blogHeader  :userInfo = "userInfo"  @headAction="headAction"></blogHeader>      
            <div class="main-page">          
                <blogSide ></blogSide>
                    <div class="content-main"> 
                         <div class=" article-content">
                             <header>
                                <div  class="articleHeader" >
                                    {{article.article_name}}
                                </div>
                                <div class="articleInfoClass">
                                    发布于<span>{{releaseDate}}</span>  <span>  {{article.sort_name}}</span> <span>  {{article.article_click}}</span>浏览
                                </div>
                                <div  class="articleTagClass">
                                        <el-tag  v-for="t in article.tags"   type="primary"  >{{t.tag_name}}</el-tag>
                                </div>
                            </header>
                            <div class="articleSeperateLine"></div>
                            <article class="articleContentClass" v-html = "article.article_content"></article>
                         </div>
                  </div>
                </div>
             </div>
        </div> 
</template>

<script>
import {articleById} from '../../store/service'
import blogHeader from './com/blogHead.vue'
import blogSide from './com/blogSide.vue'
  export default {
    data() {
      return {
          userInfo:{},
            article:{},
      }
    },
    async mounted(){
        let self= this
        if(getStore('userInfo')){
            this.isLogin = true
            this.userInfo = getStore('userInfo')
        }
        
        let id = this.$route.params.articleId
        let res = await articleById(id)
        if(res.code == 0){
            this.article = res.data
        }
        else{
            toast(this,res.ChineseMsg)
        }
    },
    methods:{
        headAction(action){
            if(action == 'login'){
                this.$router.push('/login')
            }
            else if(action == 'logout'){
                this.userInfo =  {}
            }
        },
    },
    components:{
        blogHeader,blogSide
    },
    computed:{
        releaseDate(){
            return  formatTime(new Date(this.article.article_create_time))
        }
    }

  }
</script>
<style >

  .container{
     padding-left: 15px;
     padding-right: 15px;
     margin-left: auto;
     margin-right: auto;
  }
  .row{
    margin-left: -15px;
    margin-right: -15px;
  }

.main-page{
      position: relative;
    margin-top: 40px;
}
.content-main{
    padding-left: 340px;
	width: 100%;
	box-sizing: border-box;
	float: none;
}
.article-content{
    background: white;
    border-top: 7px solid #10a5cd;
}
.articleHeader{
    font-size: 35px;
    text-align: center;
    margin-top: 30px;
    font-weight: bold;
}
.articleInfoClass{
    font-size: 20px;
    margin-top: 10px;
    margin-left: 20px;
}
.articleTagClass{

    font-size: 20px;
    margin-left: 20px;
    margin-top: 10px;
}
.articleTagClass span{
    margin-right: 10px;
}
.articleContentClass{
    margin:20px;
    font-size: 20px;
    padding-bottom: 50px;
}
.articleContentClass img{
    
}
@media (max-width:991px) {
.content-main{
    padding-left: 0px;    
}
}
</style>