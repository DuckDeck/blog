<template>
      <div class="login-body">
          <div class="ms-login">
              <div class="blog-login-title">
                  ZOE
              </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" >
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名/邮箱"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" 
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item  style="margin-bottom: 10px;height: 50px;">
                    <a class="loginAction" @click="register" >注册</a>
                    <a  style="float: right" class="loginAction" @click="resetPassword">忘记密码？</a>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')" >登录</el-button>
                </div>
            </el-form>
        </div>
        <el-dialog title="提示" v-model="dialogVisible" size="tiny">
            <span>该用户尚未验证，请验证后登录</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">现在去验证</el-button>
                <el-button type="primary" @click="reSendMail">重新发邮件</el-button>
            </span>
        </el-dialog>
      </div>

</template>

<script>
import {login,getUserInfo,ressendemail} from '../../store/service'
import { Loading } from 'element-ui'
    export default {
        data: function(){
            return {
               ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                dialogVisible:false,
                userId:0,
                loadingOption:{
                    text:"登录中..."
                }
            }
        },
        methods:{
             register(){
               this.$router.push('/register') 
             },
             async reSendMail(){
               let res = await ressendemail(this.userId)
               toast(this,res.cMsg)
               this.dialogVisible = false
             },
             resetPassword(){
                 this.$router.push('/resetpassword')
             },
             submitForm(formName){
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        let loadingInstance = Loading.service(self.loadingOption)
                        login(self.ruleForm.username,createPasswordEnctypt(self.ruleForm.password)).then(function(data){
                            loadingInstance.close()
                            if(data.code == 0){
                                setStore('token',data.data)
                                getUserInfo(data.data.user_id).then(res=>{
                                    if(res.code == 0){
                                        toast(self,'登录成功')
                                        setStore('userInfo',res.data)
                                        self.$router.push('/') 
                                    }
                                    else{
                                        toast(self,res.cMsg)
                                    }
                                }).catch(err=>{
                                     toast(self,err.cMsg)
                                })
                                      
                            }
                            else{
                                 if(data.code == 503){
                                    self.userId= data.data.user_id
                                    self.dialogVisible = true
                                 }
                                 else{
                                    toast(self,data.cMsg)
                                }
                            }
                        },function(err){
                            loadingInstance.close()
                            toast(self,err.cMsg)
                        })
                    }
                });
               
            },
            close(e){
                if(e.target!=e.currentTarget) return;
               
            }
        }

    }
</script>

<style scoped>
.login-body{

    width:100%;
    height:100vh;
    top:0;
    background: rgba(1, 1, 1, 0.5)
}
.ms-title{
    position: absolute;
    top:32%;
    width:100%;
    margin-top: -100px;
    text-align: center;
    font-size:30px;
    color: #fff;

}
.ms-login{
    position: absolute;
    left:50%;
    top:35%;
    width:380px;
    height:360px;
    margin: -10px 0px 0px -180px;
    padding:40px;
    border-radius: 5px;
    background: #fff;
    font-size: 20px;
}
.blog-login-title{
    text-align: center;
    height: 60px;
    font-size: 30px;
}
.login-btn{
    text-align: center;
}
.login-btn button{
    width:100%;
    height:36px;
}
.loginAction{
    cursor: pointer;
}
.loginAction:hover{
    color: #20a0ff !important;
}
</style>