<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
          <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" >
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" 
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import {manageLogin} from '../../store/service'
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
        methods: {
            submitForm(formName){
                const self = this;
                //  self.$refs[formName].validate((valid) => {
                //      console.log('123123')
                //  })
                //  return
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        manageLogin(self.ruleForm.username,self.ruleForm.password).then(function(data){
                            if(data.code == 0){
                                self.$router.push('/manage/');
                                setStore('token',data.data)
                                let s = getStore('token')
                                console.log('token = ' + s.token + 'u serid' + s.user_id)
                            }
                            else{
                                self.$vux.toast.show({
                                    text: err.ChineseMsg,
                                    position:"bottom",
                                    type:'text'
                            })
                            }
                        },function(err){
                            console.log()
                            self.$vux.toast.show({
                                text: err.ChineseMsg,
                                position:"bottom",
                                type:'text'
                            })
                        })
                    }
                });
               
                
            }
        },

    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100vh;
        background: #324157
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
        height:250px;
        margin: -10px 0px 0px -180px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
  
</style>