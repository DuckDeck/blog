<template>
      <div class="reset-body">
          <div class="ms-reset">
              <div class="blog-reset-title">
                  重设密码
              </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" >
                
                <el-form-item prop="email">
                    <el-input  placeholder="你的邮箱" v-model="ruleForm.email" 
                    @keyup.enter.native="submitForm('ruleForm')"></el-input> <el-button type="primary" :disabled="emailValid" class="resetButtonClass" >发送重设码</el-button>
                </el-form-item>
                <el-form-item prop="pass" >
                     <el-input   placeholder="重设码" v-model="ruleForm.pass" 
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
                    <el-button type="primary" @click="submitForm('ruleForm')" >提交</el-button>
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
           
            return {
               ruleForm: {
                    pass: '',
                    passAgain:'' 
                },
                rules: {
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
                loadingOption:{
                    text:"重设中..."
                }
            }
        },
        methods:{
             submitForm(formName){
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                       
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
.reset-body{
    width:100%;
    height:100vh;
    top:0;
    background: rgba(1, 1, 1, 0.5)
}
.ms-reset{
      position: absolute;
    left:50%;
    top:25%;
    width:380px;
    height:480px;
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
.resetButtonClass{
    float: right;
    margin-top: 20px;
}
</style>