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
                        <el-checkbox style="margin-left: 15px;" checked label="注册，登录" ></el-checkbox>
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
                        <el-checkbox style="margin-left: 15px;"  label="富文本不能上传图片到server" ></el-checkbox>
                        <el-checkbox  label="富文本和markdown不能完全正确转换" ></el-checkbox>
                        
                    </div>
                    <div class="unCompletedFeatureDiv">
                        未完成功能
                        <el-checkbox style="margin-left: 15px;"  label="富文本评论" ></el-checkbox>
                        <el-checkbox   label="修改评论" ></el-checkbox>
                        <el-checkbox  label="关注其他作者，粉丝功能" ></el-checkbox>
                        <el-checkbox  label="收藏文章" ></el-checkbox>
                        <el-checkbox  label="点赞文章" ></el-checkbox>
                        <el-checkbox  label="用户之间互私信功能" ></el-checkbox>
                        <el-checkbox  label="其他更多......" ></el-checkbox>
                    </div>
                    

                </div>
               
            </div>
            <div class="aboutAuthor">
                网络开发者Stan
            </div>
            <div class="contactAuthor">
                <ul>
                    <li>
                        QQ:3421902
                    </li>
                    <li>网站 </li>
                </ul>
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
}
.completeFeatureDiv label{
    display: block;
}
.unCompletedFeatureDiv{
 padding: 10px;
}

.unCompletedFeatureDiv label{
    display: block;
}
.aboutAuthor{
    padding: 20px;
    font-size: 18px;
}
.contactAuthor{
     font-size: 18px;
}
p{
    margin-bottom: 10px;
}
ul{
    margin-bottom: 20px;
}
</style>