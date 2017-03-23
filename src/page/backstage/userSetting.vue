<template>
    <div>
         <div class="featureTitle">
          个人信息管理
        </div>
        <div class="userInfoManageClass"> 
            <div class="basicInfoManageClass" >
                <div class="basicInfoManageTitleClass">
                    基本信息
                </div>
                <div class="basicInfoEditManageClass">
                    <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="0px" >
                    <el-form-item >
                       账号  <el-input v-model="userInfo.user_name" :disabled="true"></el-input>
                    </el-form-item>
                     <el-form-item prop="user_real_name" >
                       用户姓名  <el-input v-model="userInfo.user_real_name" ></el-input>
                    </el-form-item>
                     <el-form-item >
                       手机号  <el-input v-model="userInfo.user_phone" ></el-input>
                    </el-form-item>
                     <el-form-item >
                       邮箱  <el-input v-model="userInfo.user_email" ></el-input>
                    </el-form-item>
                     <el-form-item >
                       QQ号  <el-input v-model="userInfo.user_qq" ></el-input>
                    </el-form-item>
                     <el-form-item >
                       地址  <el-input v-model="userInfo.user_addredd" ></el-input>
                    </el-form-item>
                     <el-form-item >
                       生日  <el-input v-model="userInfo.user_name" ></el-input>
                    </el-form-item>
                   
                  </el-form>
                </div>
            </div>

           
        </div>

    </div>
</template>

<script>
    import {getUserInfo} from '../../store/service'
    export default {
        data: function(){
            return {
                userInfo:{},
                rules: {
                    
                }
            }
        },
        mounted(){
            if(getStore('userInfo')){
                this.userInfo = getStore('userInfo')
            }
            else{
                let self = this
                 getUserInfo().then(function(data){
                    if(data.code == 0){
                        self.userInfo = data.data
                        setStore('userInfo',data.data)
                    }
                    else{
                        toast(self,data.ChineseMsg)
                    }
                },function(err){
                   toast(self,err.ChineseMsg)
                })
            }
        },
        methods:{

        }
        
    }
</script>

<style scoped>
.userInfoManageClass{
    display: flex;
    font-size: 20px;
    justify-content: space-between;
    margin-top: 20px;
}
.basicInfoManageClass{
    border: 1px solid #bbb;
    width: 90%;
    min-height: 180px;
}

.basicInfoManageTitleClass{
    color: white;
    background: red;
    height: 60px;
    padding: 5px 10px;
    line-height: 50px;
}

.basicInfoEditManageClass{
    display: flex;
    padding: 15px;
    flex-wrap: wrap;
}


</style>