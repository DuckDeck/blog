
<template>
    <div class="blogheader">
        <div class="bloglogo" @click="toMain">
                 <img src="/static/img/zoe_logo.jpg" alt="">
         </div>
         <div class="rightMenu">
             
            <el-input  class="searchInput" placeholder="搜索"  v-model="keyword"
             :on-icon-click="handleIconClick" @keyup.enter="handleIconClick"> <i
    class="el-icon-search el-input__icon"
    slot="suffix"
    @click="handleIconClick">
  </i> 
  </el-input>
            <div   class="rightMenuLogin" v-show="!isLogin" >
                <span @click="login" >登录</span>
                <span @click="register">注册</span>
            </div>
            <div class="userInfoDiv" v-show="isLogin">
                
                    <el-dropdown trigger="click" @command="handleCommand">
                    <div style="display:flex" class="el-dropdown-link" >
                        <el-badge is-dot :hidden = "unreadMessageCount == 0" :max="99" class="item">
                        <img class="userheadimg" :src="userInfo.user_image_url">
                           </el-badge>
                        <span style="align-self:center">{{userInfo.user_real_name}}</span>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="mypage">我的主页</el-dropdown-item>
                        <el-dropdown-item command="mymessage">
                        <el-badge  :value="unreadMessageCount" :hidden = "unreadMessageCount == 0" 
                        :max="99" class="item">我的消息</el-badge></el-dropdown-item>
                        <el-dropdown-item command="write">写文章</el-dropdown-item>
                        <el-dropdown-item command="collect">收藏的文章</el-dropdown-item>
                        <el-dropdown-item command="like">喜欢的文章</el-dropdown-item>
                        <el-dropdown-item command="attention">我的关注</el-dropdown-item>
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
import {userGetUndreaMessageCount} from '../../../store/service'
    export default {
        data() {
            return{
                userInfo:{},
                keyword:'',
                unreadMessageCount:0
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
                    // console.log('localStorage 改变事件发生')
                    let n = JSON.parse(e.newValue)
                    // console.log(n)
                    if(n.comment_unread_count || n.comment_unread_count==0){
                        self.unreadMessageCount = n.comment_unread_count + n.like_unread_count + n.notice_unread_count + n.attention_unread_count
                        console.log(self.unreadMessageCount)
                    }
                    else{
                        if(getStore('userInfo')){
                            let u  = getStore('userInfo')
                            self.userInfo = u
                        }
                    }

            });
            this.getUnReadMessage()
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
                    let last = this.$router
                    console.log(last)
                    //ISSUE1 这个不好解决，同一个页面不能被PUSH，这是个严重的问题
                    //暂时放着吧,现在我改成不同参数的页面的，还是不行，需要强制
                    this.$router.push('/userInfo/' + getStore('userInfo').user_id + '/' + this.userInfo.user_id + "/articles")                
                    
                }
                else if(command == 'mymessage'){
                    this.$router.push('/mymessage/' + this.userInfo.user_id + '?type=1')
                }
                else if(command == "like"){
                    this.$router.push('/userInfo/' + getStore('userInfo').user_id + '/' + this.userInfo.user_id + "/like") 
                }
                else if(command == "collect"){
                     this.$router.push('/mycollect/' + this.userInfo.user_id)
                }
                else if(command == "attention"){
                     this.$router.push('/myattention/' + this.userInfo.user_id)
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
           },
           async getUnReadMessage(){
               if(isLogin()){
                   let res = await userGetUndreaMessageCount()
                   if(res.code != 0){
                       toast(this,res.cMsg)
                       return
                   }
                   setStore('message_count',res.data)
                   this.unreadMessageCount = res.count
               }
               
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
      height: 30px;
      width: 360px;
      display: flex;
      justify-content: space-around
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
.userheadimg{
    width: 40px;
    height: 40px;
    border-radius: 20px;
    margin-right: 10px;
    object-fit: cover;
}
.el-dropdown-menu__item{
        text-align: center;
        font-size: 16px;
    }
</style>
