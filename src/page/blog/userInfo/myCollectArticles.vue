<template>
      <div style="text-align: center" class="container" >
          <div class="validate">
              <div v-show="isValidating">
                正在验证 <i class="el-icon-loading"></i> ......
              </div>
              <div v-show="!isValidating">
                {{validateResultMsg}}
              </div>
          </div>
        <el-dialog title="提示" v-model="dialogVisible" size="tiny">
            <span>{{displayMessage}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">重新验证</el-button>
                <el-button type="primary" @click="reSendMail">重新发邮件</el-button>
            </span>
        </el-dialog>
      </div>
</template>

<script>
import {validateUser,ressendemail} from '../../store/service'
    export default {
        data(){
            return {
                isValidating:true,
                displayMessage:'',
                dialogVisible:false,
                userId:0,
                validateResultMsg:''
            }
        },
        async mounted(){
            let code = this.$route.params.code
            this.userId = this.$route.params.userid
            let res = await validateUser(code)
            if(res.code == 101){
                this.displayMessage = '验证码错误或失效，请重新验证'
                this.dialogVisible = true
                this.isValidating = false
                this.validateResultMsg = '验证码错误或失效，请重新验证'
            }
            else if(res.code != 0){
                toast(this,res.cMsg)
                this.validateResultMsg = '验证失败，请重新再试'
                this.isValidating = false
            }
            else{
                this.validateResultMsg = '验证成功，即将转入登录页面......'
                this.isValidating = false
                let self = this
                setTimeout(function() {
                    self.$router.replace('/login')
                }, 1000);
            }

        },
        methods:{
            async reSendMail(){
                  let res = await ressendemail(this.userId)
                  toast(this,res.cMsg)
                  this.dialogVisible = false
                  if(res.code == 0){
                      this.validateResultMsg = '验证邮件成功发送，请检查邮箱'
                  }
            }
        }

    }
</script>

<style scoped>

.validate{
text-align: center;
background: white;
color: #10a5cd;
margin-top: 150px;
font-size: 30px;
height: 200px;

}
</style>
