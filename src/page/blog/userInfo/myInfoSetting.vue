<template>
    <div class="container">
         <div class="mySetting">
             <div class="featureTitle">
                 个人信息管理
            </div>

             <el-tabs v-model="activeName" class="userSettingTab" type="border-card" @tab-click="handleClick">
                        <el-tab-pane   name="basic">
                            <span slot="label"><i class="fa fa-file-text"></i> 基本信息 </span>
                                <div class="basicInfoEditManageClass">
                                      <el-upload class="avatar-uploader" :action="uploadHeadUrl" :show-file-list="false"
                                                :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">
                                                <img v-if="userInfo.user_image_url.length > 10" :src="userInfo.user_image_url" class="avatar"> 
                                                <i v-else class="el-icon-plus avatar-uploader-icon"></i> </el-upload>
                                            <el-button style="margin-left: 20px;"  type="primary" >更换头像</el-button>    
                                </div>

                                <el-form :model="userInfo" :rules="rules" ref="userInfo" class="basicInfoForm" label-width="0px" >
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
                                    
                                    <el-button class="saveBasicInfoButton" type="primary" >保存</el-button> 
                                </el-form>
                         </el-tab-pane>
                        <el-tab-pane  name="dynamic">
                            <span slot="label"><i class="el-icon-date"></i> 个性设置 </span>
                           <el-form  >
                                 <el-form-item prop="user_real_name" >
                                <span class="infoTitleClass">性别</span> 
                                 <el-radio-group v-model="gender">
                                    <el-radio :label="1">男</el-radio>
                                    <el-radio :label="2">女</el-radio>
                                    <el-radio :label="0">保密</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item >
                              <span class="infoTitleClass birthdayTitleClass">生日</span>  <el-date-picker
                                    v-model="userInfo.user_birthday"
                                    type="date" class="birthdayClass"
                                    placeholder="选择日期"  >
                                    </el-date-picker>
                            </el-form-item>
                            <el-form-item>
                                  <span class="infoTitleClass">自我描述</span> 
                                   <el-input class="userdesciption"  :rows="2"   type="textarea"
                                        placeholder="请输入内容" ></el-input>
                            </el-form-item>
                             <el-form-item>
                                  <span class="infoTitleClass">个人语录</span> 
                                   <el-input   :rows="2"   type="textarea" class="userdesciption"
                                        placeholder="请输入内容" ></el-input>
                            </el-form-item>
                            <el-button class="saveBasicInfoButton" type="primary" >保存</el-button> 
                           </el-form>
                        </el-tab-pane>
                        <el-tab-pane  name="comment">
                            <span slot="label"><i class="fa fa-comment-o"></i> 修改密码 </span>
                                <el-form :model="pass" :rules="rulePass" ref="pass"> 
                                    <el-form-item prop="old" >                 
                                        <span style="margin-left: -5px" class="infoTitleClass">旧密码</span> 
                                        <el-input
                                        type = 'password' v-model="pass.old" 
                                            placeholder="请输入原密码">
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item prop="new"  >     
                                        <span class="infoTitleClass">新密码</span>
                                         <el-input 
                                        type = 'password' v-model="pass.new" 
                                            placeholder="请输入新密码">
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item prop="again"  >     
                                        <span class="infoTitleClass">确认</span>
                                         <el-input  type = 'password' v-model="pass.again" 
                                            placeholder="请输入新密码">
                                            </el-input>
                                        </el-form-item>
                                        <el-button class="saveBasicInfoButton" type="primary" >保存</el-button> 
                                </el-form> 
                        </el-tab-pane>
                        
                    </el-tabs>


                
         </div>
    
        <blogFoot></blogFoot>
    </div>
</template>

<script>
    import {getUserInfo} from '../../../store/service'
    import upToTop from './../com/upToTop.vue'
    import blogFoot from './../com/blogFoot.vue'
    export default {
        data: function(){
            return {
                activeName:'basic',
                userInfo:{
                    user_birthday:'',
                    user_image_url:'',
                    user_description:'',
                    user_says:''
                },
                 pass:{
                    old:'',
                    new:'',
                    again:''
                },
                rules: {
                    
                },
                rulePass:{

                },
                gender:0,
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
            },
             handleClick(tab,event){
                
             }
        },
        computed:{
            uploadHeadUrl(){
                return 'http://localhost:3000/api/user/uploadHead/' + userId + '/' + createToken()
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
.userSettingTab{
    font-size: 20px;
}

.basicInfoForm{
    margin-left: 20px;
    margin-top: 50px;
}
.basicInfoEditManageClass{
    padding: 15px;
    margin-top: 20px;
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
.el-input{
    width: 300px;
}
.emailValidated{
    font-size: 14px;
    color: #666;
}

.infoTitleClass{
    width: 80px;
    display: inline-block

}

.birthdayTitleClass{
    margin-left: -9px;
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
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border-radius: 50px;
    border: 1px dotted #20a0ff;
  }
  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }

.saveBasicInfoButton{
    width: 100px;
    margin-top: 20px;
    margin-bottom: 50px;
}
.userdesciption{
    max-width: 300px;
}

 @media (max-width:500px){

    .basicInfoForm{
         margin-left: 5px;
 
    }
    .el-input{
        width: 200px;
    }
} 
</style>