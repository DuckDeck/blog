<template>

      <div class="login-body">
          <div class="ms-login">
              <div class="blog-login-title">
                  ZOE Blog后台
              </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" >
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="管理员用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password" 
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item  style="margin-bottom: 10px;height: 50px;">
                   <a   class="loginAction">忘记密码？ 请联系网站作者</a>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')" >登录</el-button>
                </div>
            </el-form>
        </div>
      </div>

</template>

<script>
import {login} from '../../store/manageService'
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
                }
            }
        },
        methods:{
             submitForm(formName){
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        login(self.ruleForm.username, createPasswordEnctypt(self.ruleForm.password)).then(function(data){
                            if(data.code == 0){
                                clearStore()
                                setStore('m_token',data.data)    
                                self.$router.push('/manage')     
                            }
                            else{
                                 toast(self,data.cMsg)
                            }
                        },function(err){
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
    width:360px;
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