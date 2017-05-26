
<template>
    <div class="blogheader">
        <div class="bloglogo" @click="toMain">
                 <img src="/static/img/zoe_logo.jpg" alt="">
         </div>
         <div class="rightMenu">
             
            <el-input  class="searchInput" placeholder="搜索" icon="search" v-model="keyword"
             :on-icon-click="handleIconClick" @keyup.enter="handleIconClick"> </el-input>
            <div   class="rightMenuLogin" v-show="!isLogin" >
                <span @click="login" >登录</span>
                <span @click="register">注册</span>
            </div>
            <div class="userInfoDiv" v-show="isLogin">
                <el-dropdown trigger="click" @command="handleCommand">
                <span class="userInfoSpan el-dropdown-link" >
                    <img  :src="userInfo.user_image_url">
                    {{userInfo.user_real_name}}
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="mypage">我的主页</el-dropdown-item>
                    <el-dropdown-item command="write">写文章</el-dropdown-item>
                    <el-dropdown-item command="tag">我的标签</el-dropdown-item>
                    <el-dropdown-item command="setting">个人设置</el-dropdown-item>
                    <el-dropdown-item command="loginout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            </div>
        </div>
    
    </div>
</template>

<script>
    export default {
        data() {
            return{
                userInfo:{},
                keyword:''
            }
        },
        mounted(){
            this.$router.beforeEach((to, from, next) => {
                if(isEmpty(this.userInfo)){
                   if(getStore('userInfo')){
                       this.userInfo = getStore('userInfo')
                   }
                }
                next()
            })
            if(isEmpty(this.userInfo)){
                if(getStore('userInfo')){
                    this.userInfo = getStore('userInfo')
                }
            }
            let self = this
            window.addEventListener("afterSetItemEvent", function(e) {
                // 检测是否为需要监听的key值
                     if(getStore('userInfo')){
                       let u  = getStore('userInfo')
                       self.userInfo = u
                   }
                
            });
        },
        methods:{
            login(){
                this.$router.push('/login')
            },
            handleIconClick(){
                if(this.keyword.length > 0){
                    if(window.location.href.indexOf('search') > 0){
                        this.$router.replace('/search/' + this.keyword.trim())
                        window.location.reload()
                        //这里就作重新刷新吧
                    }
                    else{
                        this.$router.push('/search/' + this.keyword.trim())
                    }
                }
            },
            register(){
                this.$router.push('/register')
            },
            handleCommand(command) {
                if(command == 'loginout'){
                    removeStore('userInfo')
                    removeStore('token')
                    this.userInfo = {}
                    this.$router.push('/')
                }
                else if(command == 'write'){
                    this.$router.push('/writeArticle/0')
                }
                else if(command == 'mypage'){
                    this.$router.push('/userInfo/' + this.userInfo.user_id)
                }
                else if(command == "tag"){
                     this.$router.push('/mytag/' + this.userInfo.user_id)
                }
                else if(command == "setting"){
                    this.$router.push('/mysetting/' + this.userInfo.user_id)
                }
           },
           toMain(){
               this.$router.push('/')
           }
      },
      computed:{
          isLogin(){
              return !isEmpty(this.userInfo)
          },
      }
    }
</script>
<style scoped>
 .blogheader{
      color: white;
      width: 100%;
      font-size: 20px;
      padding: 7px 0px;
      display: flex;
      justify-content: space-between;
      position: fixed;
      background: #161E2C;
      z-index: 100;
 }

 .bloglogo img {
    width: 80px;
    padding-left: 10px;
 }
 .searchInput{
    width: 50%;
    max-width: 200px;
    display: inline-block;
}
  .rightMenu{
    
      width: 360px;
      display: flex;
      justify-content: space-around
  }

@media (max-width:480px){
    .bloglogo img {
        display: none;
    }
} 
@media (min-width:1200px){
    .blogheader{
        padding: 7px 100px;
    }
} 
@media (min-width:1400px){
    .blogheader{
        padding: 7px 200px;
    }
} 
@media (min-width:1600px){
    .blogheader{
        padding: 7px 300px;
    }
} 
@media (min-width:1800px){
    .blogheader{
        padding: 7px 400px;
    }
} 
.rightMenuLogin{
    line-height: 35px;
}
.rightMenuLogin span{
    margin-left: 10px;
    cursor: pointer;
    
}
.userInfoDiv span{
   color: white
}
.userInfoDiv:hover{
    cursor: pointer;
}
.userInfoSpan img{
    width: 35px;
    height: 35px;
    border-radius: 15px;
    margin-right: 10px;
}
.el-dropdown-menu__item{
        text-align: center;
        font-size: 16px;
    }
</style>
