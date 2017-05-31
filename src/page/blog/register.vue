<template>
      <div class="register-body">
          <div class="ms-register">
              <div class="blog-register-title">
                  注册 ZOE Blog
              </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" >
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="你的呢称"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input  placeholder="你的邮箱" v-model="ruleForm.email" 
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="pass" >
                     <el-input  type="password" placeholder="密码" v-model="ruleForm.pass" 
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="passAgain" >
                     <el-input  type="password" placeholder="密码" v-model="ruleForm.passAgain" 
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="register-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')" >注册</el-button>
                </div>
            </el-form>
        </div>
      </div>

</template>

<script>
import {checkEmail,register} from '../../store/service'
import { Loading } from 'element-ui'
    export default {
        data: function(){
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请输入密码'));
                } 
                else {
                    if (this.ruleForm.again !== '') {
                        this.$refs.ruleForm.validateField('passAgain');
                    }
                     callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请再次输入密码'));
                } 
                else if (value !== this.ruleForm.pass) {
                    callback(new Error('两次输入密码不一致!'));
                } 
                else {
                 callback();
                }
            };
            var validateEmail =  (rule, value, callback) => {
                if(!this.isValidating){
                    this.isValidating = true
                    checkEmail(value).then(res=>{
                        if(res.code == 0){
                            callback()
                        }
                        else{
                            callback(new Error(res.cMsg))
                        }
                        this.isValidating = false
                    }).catch(err=>{
                        callback(new Error(err.cMsg))
                        this.isValidating = false
                    })
                    
                    
                }
                
            };
            return {
               ruleForm: {
                    username: '',
                    email:'',
                    pass: '',
                    passAgain:''
                    
                },
                rules: {
                    username: [
                        { required: true, message: '请输入呢称，注册后可随时修改', trigger: 'blur' }
                    ],
                    email: [
                        {  required: true, message: '请输入邮箱', trigger: 'blur' },
                        {  type: 'email', message: '邮箱格式不正确', trigger: 'blur' },
                        { validator: validateEmail, trigger: 'blur' },
                    ],
                     pass: [
                         { validator: validatePass, trigger: 'blur' },
                         { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                    passAgain: [
                        { validator: validatePass2, trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                },
                isValidating:false,
                loadingOption:{
                    text:"注册中..."
                }
            }
        },
        methods:{
             submitForm(formName){
                const self = this;
                self.$refs[formName].validate((valid) => {
                    console.log(valid)
                    if (valid) {
                        let p = {
                            nickname:self.ruleForm.username,
                            password:createPasswordEnctypt(self.ruleForm.pass),
                            email:self.ruleForm.email
                        }
                        let loadingInstance = Loading.service(self.loadingOption)
                        register(p).then(res=>{
                            loadingInstance.close()
                            if(res.code == 0){
                                toast(self,'注册成功，验证邮件已经成功发送到你的邮箱里，请验证后再登录')
                                self.$router.replace('/login');
                            }
                            else{
                                toast(self,res.cMsg)
                            }
                        }).catch(err=>{
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
.register-body{
    width:100%;
    height:100vh;
    top:0;
    background: rgba(1, 1, 1, 0.5)
}
.ms-register{
      position: absolute;
    left:50%;
    top:25%;
    width:380px;
    height:430px;
    margin: -10px 0px 0px -180px;
    padding:40px;
    border-radius: 5px;
    background: #fff;
    font-size: 20px;
}
.blog-register-title{
    text-align: center;
    height: 60px;
    font-size: 30px;
}
.register-btn{
    text-align: center;
}
.register-btn button{
    width: 270px;
    margin-top: 15px;
}
</style>