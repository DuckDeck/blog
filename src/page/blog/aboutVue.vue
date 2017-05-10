<template>
     <div class="container">   
         <blogLogo></blogLogo>
        <div class="aboutBlogContent">
            <div class="aboutBlog">
                <div class="aboutBlogTitle">
                    关于Zoe Blog
                </div>
                <div class="aboutBlogintro">
                    <p>Zoe Blog是一个由Vue和Node.js实现的一个开源Blog网站,使用了以下技术</p>
                    <div>
                        后端:
                        <ul>
                            <li>
                                数据库:mysql,使用mysql库连接mysql数据库
                            </li>
                            <li>
                                后台框架使用koa2和koa-router实现restful的API
                            </li>
                            <li>
                                使用koa-body解决http包实现文件上传
                            </li>
                            <li>
                                使用nodemailer实现发送邮件
                            </li>
                            
                        </ul>
                    </div>
                    <div>
                        前端:
                        <ul>
                            <li>
                                Vue2.x vue-router 和 Element UI 
                            </li>
                            <li>
                                使用vue-html5-editor实现富文本编辑,使用mavon-editor实现Markdown编辑
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="aboutAuthor">
                
            </div>
            <div class="contactAuthor">
                
            </div>
        </div>   
        
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
.aboutBlogContent{
    background: white;
}
.aboutBlog{
    font-size: 20px;
}
.aboutBlogTitle{
    border-left: 5px solid mediumvioletred;
    height: 50px;
    color: #111;
    font-size: 25px;
    line-height: 50px;
    padding-left: 20px;
}
.aboutBlogintro{
    padding: 20px;
}
</style>