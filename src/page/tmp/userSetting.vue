<template>
    <div class="container">
         <div class="mySetting">
             <div class="featureTitle">
                 个人信息管理
            </div>
                <div class="userInfoManageClass"> 
                    <div class="basicInfoManageClass" >
                        <div class="basicInfoManageTitleClass">
                            基本信息  <el-button class="saveInfoButton" type="primary" @click="submitForm('userInfo')">保存</el-button>
                        </div>
                        <div class="basicInfoEditManageClass">
                            <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="0px" >
                            <el-form-item >
                            <span class="infoTitleClass">账号</span>   <el-input v-model="userInfo.user_name" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item prop="user_real_name" >
                                <span class="infoTitleClass">用户呢称</span>  <el-input v-model="userInfo.user_real_name" ></el-input>
                            </el-form-item>
                            <el-form-item >
                                <span class="infoTitleClass">手机号</span>  <el-input v-model="userInfo.user_phone"  ></el-input>
                            </el-form-item>
                            <el-form-item >
                                <span class="infoTitleClass ">邮箱</span>  <el-input v-model="userInfo.user_email" class="emailClass"  :disabled="true"></el-input> <span class="emailValidated">已验证</span>
                            </el-form-item>
                            <el-form-item >
                                <span class="infoTitleClass">QQ号</span>  <el-input v-model="userInfo.user_qq" ></el-input>
                            </el-form-item>
                            <el-form-item >
                                <span class="infoTitleClass">地址</span>  <el-input v-model="userInfo.user_addreddss" ></el-input>
                            </el-form-item>
                            <el-form-item >
                             <span class="infoTitleClass birthdayTitleClass">生日</span>  <el-date-picker
                                    v-model="userInfo.user_birthday"
                                    type="date" class="birthdayClass"
                                    placeholder="选择日期"  >
                                    </el-date-picker>
                            </el-form-item>
                        </el-form>
                        </div>
                    </div>
                    <div class="basicInfoManageClass" >
                        <div class="headinfoManageTitleClass">   用户头像  </div>
                        <div class="basicInfoEditManageClass">
                              <el-upload class="avatar-uploader" :action="uploadHeadUrl" :show-file-list="false"
                                        :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">
                                        <img v-if="userInfo.user_image_url.length > 10" :src="userInfo.user_image_url" class="avatar"> 
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i> </el-upload>
                        </div>
                    </div>
                    <div class="basicInfoManageClass" >
                        <div class="selfIntroManageTitleClass">
                            自我描述
                            <el-button class="saveInfoButton" type="primary" @click="submitForm('userInfo')">保存</el-button>
                        </div>
                        <div class="basicInfoEditManageClass">
                            <el-form> 
                                <el-form-item >                 
                                    <span class="infoTitleClass">自我描述</span> 
                                    <el-input
                                        type="textarea"
                                        :rows="2" v-model="userInfo.user_description"
                                        placeholder="请输入内容">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item >     
                                    <span class="infoTitleClass">个人语录</span>
                                     <el-input
                                        type="textarea" v-model = "userInfo.user_says"
                                        :rows="2"
                                        placeholder="请输入内容">
                                        </el-input>
                                    </el-form-item>
                            </el-form>   
                        </div>
                    </div>

                </div>
         </div>
        <upToTop></upToTop>
        <blogFoot></blogFoot>
    </div>
</template>

<script>
    import {getUserInfo} from '../../../store/service'
    import upToTop from './../com/upToTop.vue'
    import blogFoot from './../com/blogFoot.vue'
    import {imgPath} from '../../../config/imgPathConfig'
    export default {
        data: function(){
            return {
                userInfo:{
                    user_birthday:'',
                    user_image_url:'',
                    user_description:'',
                    user_says:''
                },
                rules: {
                    
                },

            }
        },
        mounted(){
            if(getStore('userInfo')){
                this.userInfo = getStore('userInfo')
            }
            else{
                let self = this
                 getUserInfo().then(function(data){
                    if(data.code == 0){
                        self.userInfo = data.data

                        setStore('userInfo',data.data)
                    }
                    else{
                        toast(self,data.cMsg)
                    }
                },function(err){
                   toast(self,err.cMsg)
                })
            }
        },
        methods:{
            handleAvatarScucess(res, file) {
                this.userInfo.user_image_url = res.data.url;
                clearStore()
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
            
        },
        computed:{
            uploadHeadUrl(){
                return  imgPath +  'api/user/uploadHead/' + userId + '/' + createToken()
            }
        },
        components:{
            upToTop,blogFoot
        }
        
    }
</script>

<style scoped>
.mySetting{
    background: white;
    margin-top: 70px;
}
.featureTitle{
    margin-bottom: 0px;
    padding: 10px;
    font-weight: bold;
}
.userInfoManageClass{
    display: flex;
    font-size: 20px;
    flex-direction: column;
    justify-content: space-between;

}
.basicInfoManageClass{
    border: 1px solid #bbb;

    min-height: 180px;
    margin-bottom: 20px;
}

.basicInfoManageTitleClass{
    color: white;
    background: palevioletred;
    height: 60px;
    padding: 5px 10px;
    line-height: 50px;
}

.basicInfoEditManageClass{
    padding: 15px;

}
.basicInfoEditManageClass form{
    display:  flex;
    flex-wrap: wrap
}
.basicInfoEditManageClass form div{
    width: 45%;

}
.basicInfoEditManageClass form div div{
    width: 70%
}
.emailValidated{
    font-size: 14px;
    color: #666;
}
.saveInfoButton{
    width: 100px;
    float: right;
    margin-top: 8px;
    margin-right: 10px;
}
.infoTitleClass{
    width: 60px;
    display: inline-block
}
.emailClass{
    width: 60% !important;
}
.birthdayTitleClass{
    width: -10px;
}
.birthdayClass{
    width: 75% !important
}
.avatar-uploader{
display: inline-block;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
    
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
    border: 1px dotted #20a0ff;
  }
  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }
  .headinfoManageTitleClass{
       color: white;
   
        height: 60px;
        padding: 5px 10px;
        line-height: 50px;
      background: limegreen
  }
  .selfIntroManageTitleClass{
        color: white;
   
        height: 60px;
        padding: 5px 10px;
        line-height: 50px;
      background: orchid
  }
</style>