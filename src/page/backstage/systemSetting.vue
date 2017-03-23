<template>
    <div>
         <div class="featureTitle">
          系统设置
        </div>
        <div class="userInfoManageClass"> 
            <div class="basicInfoManageClass" >
                <div class="basicInfoManageTitleClass">
                    基本信息  <el-button class="saveInfoButton" type="primary" @click="submitForm('userInfo')">保存</el-button>
                </div>
                <div class="basicInfoEditManageClass">
                    <el-form :model="systemInfo" :rules="rules" ref="systemInfo" label-width="0px" >
                    <el-form-item >
                       <span class="infoTitleClass">账号</span>   <el-input v-model="systemInfo.blog_name" :disabled="true"></el-input>
                    </el-form-item>
                     <el-form-item prop="user_real_name" >
                        <span class="infoTitleClass">用户姓名</span>  <el-input v-model="systemInfo.blog_description" ></el-input>
                    </el-form-item>
                     <el-form-item >
                        <span class="infoTitleClass">手机号</span>  <el-input v-model="systemInfo.blog_keyword" ></el-input>
                    </el-form-item>
                  </el-form>
                </div>
            </div>
             <div class="basicInfoManageClass" >
                <div class="headinfoManageTitleClass">
                    用户头像
                </div>
                <div class="basicInfoEditManageClass">
                   
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {getUserInfo} from '../../store/service'
    export default {
        data: function(){
            return {
                systemInfo:{
                    blog_name:'',
                    blog_description:'',
                    blog_keyword:'',
                },
                rules: {
                    
                }
            }
        },
        mounted(){
            if(getStore('userInfo')){
                
                this.userInfo = getStore('userInfo')
                console.log(this.userInfo)
            }
            else{
                let self = this
                 getUserInfo().then(function(data){
                    if(data.code == 0){
                        self.userInfo = data.data
                        setStore('userInfo',data.data)
                    }
                    else{
                        toast(self,data.ChineseMsg)
                    }
                },function(err){
                   toast(self,err.ChineseMsg)
                })
            }
        },
        methods:{
            handleAvatarScucess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
            
        }
        
    }
</script>

<style scoped>
.userInfoManageClass{
    display: flex;
    font-size: 20px;

    justify-content: space-between;
    margin-top: 20px;
}
.basicInfoManageClass{
    border: 1px solid #bbb;
    width: 90%;
    min-height: 180px;
    margin-bottom: 20px;
}

.basicInfoManageTitleClass{
    color: white;
    background: lightseagreen;
    height: 60px;
    padding: 5px 10px;
    line-height: 50px;
}


</style>