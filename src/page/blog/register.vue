<template>
      <div class="register-body">
          <div class="ms-register">
              <div class="blog-register-title">
                  ZOE
              </div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" >
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="你的呢称"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input  placeholder="你的邮箱" v-model="ruleForm.password" 
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item  >
                     <el-input  type="password" placeholder="密码" v-model="ruleForm.password" 
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item  >
                     <el-input  type="password" placeholder="密码" v-model="ruleForm.password" 
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
import {login,getUserInfo} from '../../store/service'
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
                    ],
                     pass: [
                         { validator: validatePass, trigger: 'blur' },
                         { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ],
                    passAgain: [
                        { validator: validatePass2, trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
                }
            }
        },
        methods:{
             submitForm(formName){
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        login(self.ruleForm.username,self.ruleForm.password).then(function(data){
                            if(data.code == 0){
                                setStore('token',data.data)
                                getUserInfo(data.data.user_id).then(res=>{
                                    if(res.code == 0){
                                        toast(self,'登录成功')
                                        setStore('userInfo',res.data)
                                        self.$router.back() 
                                    }
                                    else{
                                        toast(self,res.cMsg)
                                    }
                                }).catch(err=>{
                                     toast(self,err.cMsg)
                                })
                                      
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
.register-body{
    width:100%;
    height:100vh;
    top:0;
    background: rgba(1, 1, 1, 0.5)
}
.ms-register{
      position: absolute;
    left:50%;
    top:35%;
    width:360px;
    height:400px;
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
    width: 100px;
}
</style>