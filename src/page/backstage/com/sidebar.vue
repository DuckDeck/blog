<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo"  @select = "selectMenu" theme="dark" unique-opened >
            <el-menu-item  index = "summary" >
                <i class="el-icon-setting"></i>仪表盘
            </el-menu-item>
           <el-menu-item index="manageUser">
               <i class="el-icon-edit"> </i>管理用户
           </el-menu-item>   
           <el-menu-item index="manageArticle">
                <i class="el-icon-document"> </i>管理文章
            </el-menu-item>
            <el-menu-item index="manageComment">
                <i class="el-icon-message"> </i>留言管理
            </el-menu-item>
            <el-menu-item index="manageFile">
                <i class="el-icon-picture"> </i>文件管理
            </el-menu-item>
            <el-menu-item index="systemSetting">
                <i class="el-icon-setting"> </i>系统设计
            </el-menu-item>
            <el-menu-item index="managerSetting">
                <i class="el-icon-setting"> </i>管理员管理
            </el-menu-item>
        </el-menu>
        <copyRight></copyRight>
    </div>
</template>
<script>
import copyRight from './copyRight'
    export default {
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },

        methods:{
            selectMenu(index,path){
                if(index == 'editArticle')
                {
                    this.$router.replace("/manage/" + index + '/0')
                }
                else{
                     this.$router.replace("/manage/" + index)
                }
               
            }
        },
        components:{
            copyRight
        }
    }
</script>
<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:95%;
    }
</style>
