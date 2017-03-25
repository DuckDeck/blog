
<template>
    <div class="blogheader">
       
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
                    <el-dropdown-item command="backPage">切换后台</el-dropdown-item>
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
                blogInfo:{}
            }
        },
        props:{
          
        },
        methods:{
          
        }
    }
</script>
<style scoped>
 .blogheader{
     height: 50px;
     background: rgba(0, 0, 0, 0.5)
 }
</style>
