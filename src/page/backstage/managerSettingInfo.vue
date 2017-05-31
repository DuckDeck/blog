<template>
    <div>
         <div class="featureTitle">
          个人信息管理
        </div>
        <div class="userInfoManageClass"> 
            
             <div class="basicInfoManageClass" >
                <div class="headinfoManageTitleClass">  管理员头像  </div>
                <div class="basicInfoEditManageClass">
                         <el-upload class="avatar-uploader" :action="uploadHeadUrl" :show-file-list="false"
                                :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">
                                <img v-if="manageInfo.m_head.length > 10" :src="manageInfo.m_head" class="avatar"> 
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i> </el-upload>
                </div>
            </div>
            <div class="basicInfoManageClass" >
                <div class="selfIntroManageTitleClass">
                    修改密码
                     <el-button class="saveInfoButton" type="primary" @click="savePass">保存</el-button>
                </div>
                <div class="basicInfoEditManageClass">
                     <el-form :model="pass" :rules="rules" ref="pass"> 
                          <el-form-item prop="old" >                 
                             <span class="infoTitleClass">旧密码</span> 
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
                              <el-input
                             type = 'password' v-model="pass.again" 
                                placeholder="请输入新密码">
                                </el-input>
                            </el-form-item>
                     </el-form>   
                </div>
            </div>

        </div>

    </div>
</template>

<script>
    import {managerInfoById,updateManagerPass} from '../../store/manageService'
    import {imgPath} from '../../../config/imgPathConfig'
    export default {
        data: function(){
             var validatePass = (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请输入密码'));
                } 
                else {
                    if (this.pass.again !== '') {
                        this.$refs.pass.validateField('again');
                    }
                     callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请再次输入密码'));
                } 
                else if (value !== this.pass.new) {
                    callback(new Error('两次输入密码不一致!'));
                } 
                else {
                 callback();
                }
            };
            return {
                manageInfo:{},
                pass:{
                    old:'',
                    new:'',
                    again:''
                },
                rules:{
                    old: [
                        { required: true, message: '原密码不能为空', trigger: 'blur' }
                    ],
                    new: [
                         { validator: validatePass, trigger: 'blur' },
                         { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                    again: [
                        { validator: validatePass2, trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        async mounted(){
            let id = this.$route.params.id
            
            let res = await managerInfoById(id)
            if(res.code == 0){
                this.manageInfo = res.data
            }
            else{
                toast(this,res.cMsg)
            }
        },
        methods:{
            handleAvatarScucess(res, file) {
                this.manageInfo.m_head = res.data.url;
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
            async savePass(){
                const self = this;
                self.$refs['pass'].validate((valid) => {
                    if (valid) {
                       updateManagerPass(createPasswordEnctypt(this.pass.old),createPasswordEnctypt(this.pass.new)).then(res=>{
                             if(res.code == 0){
                                 toast(self,'密码修改成功，请重新登录')
                                clearStore()
                                self.$router.replace('/managelogin');   
                            }
                            else{
                                toast(self,res.cMsg)
                            }
                       }).catch(err=>{
                           toast(self,err.cMsg)
                       })
                      
                    }
                });
               
            
            }
            
        },
        computed:{
            uploadHeadUrl(){
                return  imgPath + 'api/manage/head/' + manageId + '/' + createMtoken()
            }
        }
        
    }
</script>

<style scoped>
.userInfoManageClass{
    display: flex;
    font-size: 20px;
    flex-direction: column;
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
    background: palevioletred;
    height: 60px;
    padding: 5px 10px;
    line-height: 50px;
}

.basicInfoEditManageClass{
    padding: 15px;

}

.basicInfoEditManageClass form div{
    width: 45%;

}
.basicInfoEditManageClass form div div{
    width: 70%
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