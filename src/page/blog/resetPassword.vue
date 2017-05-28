<template>
      <div class="reset-body">
          <div class="ms-reset">
              <div class="blog-reset-title">
                  重设密码
              </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" >
                
                <el-form-item prop="email">
                    <el-input  placeholder="你的邮箱" v-model="email" @change="emailChange"></el-input>
                   <div class="hintDiv" >
                      <span class="resetHint" >输入你的注册邮箱后点击发送重设码,系统会发送一封邮件到你填写的邮箱里
                          ,你可以用邮件里的重设码来重设你的密码
                      </span>
                     <el-button type="primary" :disabled="!emailValid||isSendedEmail" class="resetButtonClass" @click="sendEmail" >{{btnSendEmailText}}</el-button>
                   </div>
                </el-form-item>
                <el-form-item  prop='resetCode'>
                     <el-input   placeholder="重设码" v-model="ruleForm.resetCode" 
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="pass" >
                     <el-input  type="password" placeholder="新密码" v-model="ruleForm.pass" 
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="passAgain" >
                     <el-input  type="password" placeholder="确认新密码" v-model="ruleForm.passAgain" 
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="reset-btn">
                    <el-button type="primary" :loading="isLoading" @click="submitForm('ruleForm')" >提交</el-button>
                </div>
                <div class="resetOption"  >
                    <a class="loginAction" @click="login" >重新登录</a>
                    <a   class="loginAction" @click="register">去注册</a>
                </div>
            </el-form>
        </div>
      </div>

</template>

<script>
import {resetPasswordCode,resetPassword} from '../../store/service'
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
           
            return {
               email:'',
               ruleForm: {
                   resetCode:'',
                    pass: '',
                    passAgain:'' 
                },
                rules: {
                    resetCode: [
                      { required: true, message: '重设码不能为空', trigger: 'blur' }
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
                emailValid:false,
                isSendedEmail:false,
                isLoading:false,
                btnSendEmailText:'发送重设码'
            }
        },
        methods:{
            emailChange(val){
                if(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(val)){
                    this.emailValid = true
                }
                else{
                     this.emailValid = false
                }
            },
            login(){
                this.$router.back();
            },
            async sendEmail(){
                let res = await resetPasswordCode(this.email)
                if(res.code == 0){
                    this.isSendedEmail = true
                    this.countDown()
                    setStore('tempEmail',this.email)
                    toast(this,"获取成功,请到邮箱里查看")
                }
                else{
                    toast(this,"获取重设码失败，请稍侯重新再试...")
                }
              
            },
            register(){
                this.$router.replace('/register');
            },
            submitForm(formName){
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                       let tmpEmail = getStore('tempEmail') || self.email
                       if(!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(tmpEmail)){
                            toast(self,'请填写正确的Email地址')
                            return
                       }
                       let dict = {
                           email:tmpEmail,
                           code:self.ruleForm.resetCode,
                           password:createPasswordEnctypt(self.ruleForm.pass)
                       }
                       self.isLoading = true
                       resetPassword(dict).then(res=>{
                           self.isLoading = false
                           if(res.code == 0){
                               toast(self,"重设成功，待转到登录页面")
                               setTimeout(function() {
                                   self.$router.replace('/login')
                               }, 500);
                           }
                           else{
                               toast(self,res.cMsg)
                           }
                       }).catch(err=>{
                           self.isLoading = false
                            toast(self,err.cMsg)
                       })
                    }
                });
            },
            close(e){
                if(e.target!=e.currentTarget) return;
            },
            countDown(){
                let num = 60;
                this.btnSendEmailText = "60后再发送"
                let countTime =  setInterval(()=>{
                    num = num - 1
                    this.btnSendEmailText = num + "后再发送"
                    if(num == 0){
                        clearInterval(countTime)
                        this.btnSendEmailText = "重新发送"
                        this.isSendedEmail = false
                    }
                },1000)
            }
        }

    }
</script>

<style scoped>
.reset-body{
    width:100%;
    height:100vh;
    top:0;
    background: rgba(1, 1, 1, 0.5)
}
.ms-reset{
      position: absolute;
    left:50%;
    top:22%;
    width:400px;
    height:550px;
    margin: -10px 0px 0px -180px;
    padding:40px;
    border-radius: 5px;
    background: #fff;
    font-size: 20px;
}
.blog-reset-title{
    text-align: center;
    height: 60px;
    font-size: 30px;
}
.reset-btn{
    text-align: center;
}
.reset-btn button{
    width: 270px;
    margin-top: 15px;
}
.hintDiv{
    display: flex;
   
}
.resetHint{
    width: 210px;
    display: inline-block;
     font-size: 11px;
     line-height: 14px;
     margin-top: 20px;
     color: #20a0ff;
     margin-right: 10px;
}
.resetButtonClass{
    float: right;
    margin-top: 20px;
    width: 100px;
}
.resetOption{
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
}
.resetOption a{
    font-size: 14px;
    color: #20a0ff
}
.resetOption a:hover{
  cursor: pointer;
}
</style>