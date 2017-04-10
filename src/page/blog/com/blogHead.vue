
<template>
    <div class="blogheader">
        <div class="bloglogo" @click="toMain">
                 <img src="/static/img/zoe_logo.jpg" alt="">
         </div>
         <div class="rightMenu">
             
            <el-input  class="searchInput" placeholder="搜索" icon="search" :on-icon-click="handleIconClick"> </el-input>
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
              
            }
        },
        props:{  
          userInfo:{
              type:Object
          }
        },
        methods:{
            login(){
                this.$emit('headAction','login')
            },
            handleIconClick(){

            },
            register(){
                this.$emit('headAction','register')
            },
            handleCommand(command) {
                if(command == 'loginout'){
                    removeStore('userInfo')
                    removeStore('token')
                    this.$emit('headAction','logout')
                }
           },
           toMain(){
               this.$router.push('/')
           }
      },
      computed:{
          isLogin(){
              return !isEmpty(this.userInfo)
          }
      }
    }
</script>
<style scoped>
 .blogheader{
      color: white;
      width: 100%;
      font-size: 20px;
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
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
      float: right;
      width: 360px;
    
      display: flex;
      justify-content: space-around
  }

 @media (max-width:480px){
     .bloglogo img {
         display: none;
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
