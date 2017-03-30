<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo"  @select = "selectMenu" theme="dark" unique-opened >
            <el-menu-item  index = "summary" >
                <i class="el-icon-setting"></i>仪表盘
            </el-menu-item>
           <el-menu-item index="editArticle">
               <i class="el-icon-menu"> </i>发布文章
           </el-menu-item>   
           <el-menu-item index="manageArticle">
                <i class="el-icon-menu"> </i>管理文章
            </el-menu-item>
            <el-menu-item index="manageComment">
                <i class="el-icon-menu"> </i>留言管理
            </el-menu-item>
            <el-menu-item index="tag">
                <i class="el-icon-menu"> </i>分类/标签
            </el-menu-item>
            <el-menu-item index="manageFile">
                <i class="el-icon-menu"> </i>文件管理
            </el-menu-item>
            <el-menu-item index="manageLink">
                <i class="el-icon-menu"> </i>友情链接
            </el-menu-item>
            <el-menu-item index="systemSetting">
                <i class="el-icon-menu"> </i>系统设计
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
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
        height:100%;
    }
</style>
