<template>
     <div class="container">   
         <blogLogo></blogLogo>
        <div class="aboutBlogContent">
            <div class="aboutBlog">
                <div class="aboutBlogTitle">
                    关于Zoe Blog
                </div>
                <div class="aboutBlogintro">
                    <p>Zoe Blog是一个由Vue和Node.js实现的一个开源博客网站,使用了以下技术</p>
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
                                Vue2.x , vue-router 和 Element UI 
                            </li>
                            <li>
                                使用vue-html5-editor实现富文本编辑,使用mavon-editor实现Markdown编辑
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="aboutBlog">
               
                     <div class="aboutBlogTitle">
                        ZOE博客功能
                    </div>
                    <div class="completeFeatureDiv">
                        已完成功能
                        <el-checkbox  checked label="注册，登录" ></el-checkbox>
                        <el-checkbox checked label="搜索文章，作者，分类功能" ></el-checkbox>
                        <el-checkbox checked label="发送邮箱验证用户和重设密码" ></el-checkbox>
                        <el-checkbox checked label="文章标签和分类功能" ></el-checkbox>
                        <el-checkbox checked label="富文本编辑和Markdown编辑模式自由切换" ></el-checkbox>
                        <el-checkbox checked label="自由评论文章和其他人的评论" ></el-checkbox>
                        <el-checkbox checked label="查看其他作者信息和文章" ></el-checkbox>
                        <el-checkbox checked label="个性设置" ></el-checkbox>
                        <el-checkbox checked label="后台管理员登录" ></el-checkbox>
                    </div>
                    <div class="unCompletedFeatureDiv">
                        存在问题
                        <el-checkbox  checked  label="富文本不能上传图片到server(解决了)" ></el-checkbox>
                        <el-checkbox  label="富文本和Markdown不能完全正确转换" ></el-checkbox>
                        <el-checkbox  label="Markdown编辑器存在一些Bug，比如会重新刷新页面" ></el-checkbox>
                    </div>
                    <div class="unCompletedFeatureDiv">
                        未完成功能
                        <el-checkbox  label="修改评论" ></el-checkbox>
                        <el-checkbox  label="网站HTTPS支持" ></el-checkbox>
                        <el-checkbox  checked label="关注其他作者，粉丝功能" ></el-checkbox>
                        <el-checkbox  checked label="收藏文章,点赞文章" ></el-checkbox>
                        <el-checkbox  checked label="使用七牛来保存图片(不再使用七牛了，因为七牛需要备案的域名，这里我用了自己的DDNS)" ></el-checkbox>
                        <el-checkbox  label="用户相册功能" ></el-checkbox>
                        <el-checkbox  label="用户之间私信功能和系统通知功能" ></el-checkbox>
                        <el-checkbox  label="其他更多......" ></el-checkbox>
                    </div>
                    

                </div>
               
            </div>
            <div class="aboutBlogTitle">
                网络开发者Stan
            </div>
            <div class="contactAuthor">
                <ul>
                    <li>
                        QQ:3421902,如果此Demo有问题，请在github提交issue或者给这个QQ号发邮件
                    </li>
                     <li>
                        Github 地址: <a href="https://github.com/DuckDeck/blog">Blog Github</a>
                    </li>
                </ul>
            </div>
             <div class="aboutBlogTitle">
                版权声明
            </div>
            <div class="rightDetail">
                此网站除引用框架和库外，全部代码都由开发者完成并且开源，该网站仅供前端爱好者参考，不作其他用途。
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
    border-top: 5px solid darkred;
    background: white;
    margin-top: 10px;
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
    margin-left: 20px;
    margin-top: 20px;
}
.aboutBlogintro{
    padding: 20px;
}
.completeFeatureDiv{
    padding: 10px;
   margin-left:30px
}
.completeFeatureDiv label{
    display: block;
    margin-top: 8px;
}
.unCompletedFeatureDiv{
 padding: 10px;
  margin-left:30px
}

.unCompletedFeatureDiv label{
    display: block;
    margin-top: 8px;
}

.contactAuthor{
     font-size: 18px;
}
.rightDetail{
     padding: 20px;
    padding-bottom: 50px;
 font-size: 18px;
}
p{
    margin-bottom: 10px;
}
ul{
    margin-bottom: 20px;
}
</style>