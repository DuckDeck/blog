<template>
    <div class="container">
         <div class="mySetting">
             <div class="featureTitle">
                 个人信息管理
            </div>

             <el-tabs v-model="activeName" class="userSettingTab" type="border-card" @tab-click="handleClick">
                        <el-tab-pane   name="basic">
                            <span slot="label"><i class="fa fa-file-text"></i> 基本信息 </span>
                                <div class="basicInfoEditManageClass">
                                      <el-upload class="avatar-uploader" :action="uploadHeadUrl" :show-file-list="false"
                                                :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">
                                                <img v-if="userInfo.user_image_url.length > 10" :src="userInfo.user_image_url" class="avatar"> 
                                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                <el-button style="margin-left: 20px; "  type="primary" >更换头像</el-button>  
                                                 </el-upload>
                                              
                                </div>

                                <el-form :model="userInfo" :rules="ruleBasic" ref="userInfo" class="basicInfoForm" label-width="0px" >
                                    <el-form-item prop = "user_name" >
                                        <div v-show = "isCanResetUserName" style="color: red" >账号为邮箱的，可以重新设定一次</div>
                                    <span class="infoTitleClass">账号</span>   <el-input class="user_input" v-model="userInfo.user_name" :disabled="!isCanResetUserName"></el-input>
                                    </el-form-item>
                                    <el-form-item prop="user_real_name" >
                                        <span class="infoTitleClass">用户呢称</span>  <el-input  class="user_input" v-model="userInfo.user_real_name" ></el-input>
                                    </el-form-item>
                                    <el-form-item prop="user_phone" >
                                        <span class="infoTitleClass">手机号</span>  <el-input  class="user_input" v-model="userInfo.user_phone"  ></el-input>
                                        <span class="emailValidated">可选</span>
                                    </el-form-item>
                                    <el-form-item >
                                        <span class="infoTitleClass ">邮箱</span>  <el-input    v-model="userInfo.user_email" class="user_input emailClass" 
                                         :disabled="true"></el-input> <span class="emailValidated">已验证</span>
                                    </el-form-item>
                                    <el-form-item >
                                        <span class="infoTitleClass">QQ号</span>  <el-input  class="user_input" v-model="userInfo.user_qq" ></el-input>
                                        <span class="emailValidated">可选</span>
                                    </el-form-item>
                                    <el-form-item >
                                        <span class="infoTitleClass">地址</span>  <el-input  class="user_input" v-model="userInfo.user_address"  ></el-input>
                                        <span class="emailValidated">可选</span>
                                    </el-form-item>
                                    
                                    <el-button class="saveBasicInfoButton" type="primary" @click="saveBasic" >保存</el-button> 
                                </el-form>
                         </el-tab-pane>
                        <el-tab-pane  name="dynamic">
                            <span slot="label"><i class="el-icon-date"></i> 个性设置 </span>
                           <el-form   >
                               <el-form-item  >
                                <span class="infoTitleClass">性别</span> 
                                 <el-radio-group v-model="gender" @change = "genderChange">
                                    <el-radio :label='1'>男</el-radio>
                                    <el-radio :label="2">女</el-radio>
                                    <el-radio :label="4">保密</el-radio>
                                </el-radio-group>
                              </el-form-item>
                               <el-form-item >
                                 <span class="infoTitleClass">常用编辑器</span> 
                                 <el-radio-group  v-model="editor_type" @change = "editorTypeChange">
                                    <el-radio :label='0'>富文本</el-radio>
                                    <el-radio :label="1">Markdown</el-radio>
                                    
                                </el-radio-group>
                              </el-form-item>
                            <el-form-item >
                              <span class="infoTitleClass birthdayTitleClass">生日</span>  <el-date-picker
                                    v-model="birthday"
                                    type="date" class="birthdayClass"
                                    placeholder="选择日期"  >
                                    </el-date-picker>
                            </el-form-item>
                            <el-form-item  >
                              <span class="infoTitleClass birthdayTitleClass">我的网站</span> 
                              <div style="display: inline-block">
                                  <div style="max-width: 800px;display: block">
                                    <el-input class="myLinkInput" placeholder="http://个人网站" v-model="mainLink.link_url" ></el-input>
                                    <el-input style="width: 30%;margin-left: 10px;"  placeholder="网站名称" v-model="mainLink.link_name" ></el-input>
                                    <i class="fa fa-plus-circle addNewLink" @click="addNewLinkClick"></i>
                                </div>
                                <addLink v-for="link in otherLinks" @deleteLink="deleteLink"  :linkInfo="link"></addLink>
                              </div>
                            </el-form-item>
                            <el-form-item>
                                  <span class="infoTitleClass">自我描述</span> 
                                   <el-input class="userdesciption"  :rows="6"   type="textarea" v-model="userInfo.user_description"
                                        placeholder="请输入内容" ></el-input>
                            </el-form-item>
                             <el-form-item>
                                  <span class="infoTitleClass">个人语录</span> 
                                   <el-input   :rows="6"   type="textarea"  class="userdesciption" v-model="userInfo.user_says"
                                        placeholder="请输入内容" ></el-input>
                            </el-form-item>
                            <el-button class="saveBasicInfoButton" type="primary" @click="saveInfo" >保存</el-button> 
                           </el-form>
                        </el-tab-pane>
                        <el-tab-pane  name="comment">
                            <span slot="label"><i class="fa fa-comment-o"></i> 修改密码 </span>
                                <el-form :model="pass" :rules="rulePass" ref="pass" style="min-height: 650px" > 
                                    <el-form-item prop="old" >                 
                                        <span style="margin-left: -5px" class="infoTitleClass">旧密码</span> 
                                        <el-input   style="margin-left: 5px;"  type = 'password' v-model="pass.old"      placeholder="请输入原密码">
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item prop="new"  >     
                                        <span class="infoTitleClass">新密码</span>
                                         <el-input    type = 'password' v-model="pass.new"     placeholder="请输入新密码">
                                            </el-input>
                                        </el-form-item>
                                        <el-form-item prop="again"  >     
                                        <span class="infoTitleClass">确认</span>
                                         <el-input  type = 'password' v-model="pass.again" placeholder="请输入新密码">
                                            </el-input>
                                        </el-form-item>
                                        <el-button class="saveBasicInfoButton" type="primary" @click="changePassword" >保存</el-button> 
                                </el-form> 
                        </el-tab-pane>
                        
                    </el-tabs>

         </div>
        <el-dialog title="提示" v-model="dialogVisible" size="tiny">
            <span>{{deleteMessage}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteArticleConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <blogFoot></blogFoot>
    </div>
</template>

<script>
    import {getUserInfo,updateUserInfo,checkUserName,deleteLink} from '../../../store/service'
    import upToTop from './../com/upToTop.vue'
    import blogFoot from './../com/blogFoot.vue'
    import addLink from './com/addLink.vue'
    import qs from 'qs'
    import {imgPath} from '../../../../config/imgPathConfig'
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
            var validateUserName =  (rule, value, callback) => {
               if(!this.isEmail){
                  callback()
                  return
               }
                if(!this.isValidating){
                    this.isValidating = true
                    checkUserName(value).then(res=>{
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
                activeName:'basic',
                userInfo:{
                    user_image_url:'',
                    user_phone:'',
                    user_qq:'',
                    user_address:''
                },
                pass:{
                    old:'',
                    new:'',
                    again:''
                },
                ruleBasic: {
                    user_real_name: [
                        { required: true, message: '请输入用户呢称', trigger: 'blur' }
                    ],
                    user_name: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { validator: validateUserName, trigger: 'blur' },
                    ],
                 },
                rulePass:{
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
                 },
                gender:10,
                editor_type:0,
                birthday:new Date(),
                mainLink:{
                    link_id:0,
                    link_name:'',
                    link_url:''
                },
                otherLinks:[],
                deleteMessage:'',
                dialogVisible:false,
                currentDeleteLink:{},
                isCanResetUserName:false,//是否可以重设用户名
            }
        },
        mounted(){
            if(getStore('userInfo')){
                this.userInfo = getStore('userInfo')
                this.isCanResetUserName = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.userInfo.user_name)
                this.gender = this.userInfo.user_gender
                this.editor_type = this.userInfo.user_editor_type
                this.birthday = new Date(this.userInfo.user_birthday)
                this.initLink()
            }
            else{
                this.getUserInfoFromNet()
            }
        },
        methods:{
            deleteArticleConfirm(){
               this.dialogVisible = false
               this.deleteUserLink()
            },
            getUserInfoFromNet(){
                let id = this.$route.params.userId
                let self = this
                 getUserInfo(id).then(function(data){
                    if(data.code == 0){
                        self.userInfo = data.data
                        self.isCanResetUserName = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(self.userInfo.user_name)
                        self.gender = self.userInfo.user_gender
                        self.editor_type = self.userInfo.user_editor_type
                        self.birthday = new Date(self.userInfo.user_birthday)
                        self.initLink()
                        setStore('userInfo',data.data)
                    }
                    else{
                        toast(self,data.cMsg)
                    }
                },function(err){
                   toast(self,err.cMsg)
                })
            },
            handleAvatarScucess(res, file) {
                if(res.code == 0){
                    this.userInfo.user_image_url = res.data.url
                    let u = getStore('userInfo')
                    u.user_image_url = res.data.url
                    setStore('userInfo',u)
                }
                else{
                   toast(this,res.cMsg)
                }
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                     toast(this,'上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                     toast(this,'上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            handleClick(tab,event){
                
            },
            genderChange(val){
                this.userInfo.user_gender = val
            },
            editorTypeChange(val){
                this.userInfo.user_editor_type = val
            },
            saveBasic(){
                //save basic info
                const self = this;
                self.$refs['userInfo'].validate((valid) => {
                    if (valid) {
                        let dict = {
                            user_id:self.userInfo.user_id,
                            user_real_name:self.userInfo.user_real_name
                        }
                        if(self.isCanResetUserName){
                            if(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(self.userInfo.user_name)){
                                toast(self,"新用户名不能再使用邮箱")
                            }
                            else{
                                 dict.user_name = self.userInfo.user_name
                            }
                        
                        }
                        if(self.userInfo.user_phone.length > 0){
                            if(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(self.userInfo.user_phone))
                              dict.user_phone = self.userInfo.user_phone  
                            else{
                                toast(self,"手机号格式错误")
                                return
                            }                             
                        }
                        if(self.userInfo.user_qq.length > 0){
                            if(/^[1-9]\d{3,11}$/.test(self.userInfo.user_phone))
                              dict.user_qq = self.userInfo.user_qq  
                            else{
                                toast(self,"QQ号格式错误")
                                return
                            }      
                        }
                        if(self.userInfo.user_address.length > 0){
                            dict.user_address = self.userInfo.user_address
                        }
                        updateUserInfo('updatebasic',dict).then(res=>{
                            if(res.code == 0){
                                toast(self,`修改成功`)
                                setStore('userInfo',self.userInfo)
                                self.isCanResetUserName =  /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(self.userInfo.user_name)
                            }
                            else{
                               toast(self,res.cMsg)
                            }
                        }).catch(err=>{
                            toast(self,err.cMsg)
                        })

                    }
                });
               
            },
            saveInfo(){
                let bir = this.birthday.getTime()
                let dict = {
                    user_id:this.userInfo.user_id,
                    user_gender:this.userInfo.user_gender,
                    user_birthday:bir,
                    edit_type:this.editor_type,
                    user_description:this.userInfo.user_description,
                    user_says:this.userInfo.user_says
                }
                let links = []
                if(this.checkLink(this.mainLink)){
                    links.push(this.mainLink)
                }
                else{
                    if( isStringNullOrEmpty(this.mainLink.link_name) && isStringNullOrEmpty(this.mainLink.link_url)){

                    }
                    else{
                        return
                    }
                    
                }
                for(let l of this.otherLinks){
                    if(this.checkLink(l)){
                        //加上http
                        //todo
                        links.push(l)
                    }
                    else{
                        if( isStringNullOrEmpty(l.link_name) && isStringNullOrEmpty(l.link_url)){

                        }
                        else{
                            return
                        }
                        
                    }
                }
                if(links.length > 0){
                    dict.links = JSON.stringify(links)
                }
                //上传要转化一个格式
                //这确实 是个问题，上传对象要研究
                let self = this
                updateUserInfo('updateindividual',dict).then(res=>{
                            if(res.code == 0){
                                toast(self,`修改成功`)
                                self.getUserInfoFromNet()
                            }
                            else{
                                toast(self,res.cMsg)
                            }
                        }).catch(err=>{
                            toast(self,err.cMsg)
                        })
            },
            changePassword(){
                if(this.pass.old == this.pass.new){
                    toast(this,"新旧密码不能相同")
                    return
                }     
                let dict = {
                      user_id:this.userInfo.user_id,    
                      old_password:createPasswordEnctypt(this.pass.old),
                      new_password:createPasswordEnctypt(this.pass.new)
                }
                const self = this;
                self.$refs['pass'].validate((valid) => {
                    if (valid) {
                         updateUserInfo('updatepassword',dict).then(res=>{
                             if(res.code == 0){
                                toast(self,'密码修改成功,请重新登录')
                                 clearStore()
                                self.$router.replace('/login'); 
                             }
                             else{
                                toast(self,res.cMsg)
                             }
                         }).catch(err=>{
                                toast(self,err.cMsg)
                         })
                      
                    }
                });
            },
            close(e){
                if(e.target!=e.currentTarget) return;
            },
            addNewLinkClick(){
                let newLink = {
                    link_id:0,
                    link_name:'',
                    link_url:'',
                }
                newLink.index = this.otherLinks.length
                this.otherLinks.push(newLink)  
            },
            deleteLink(link){
                this.currentDeleteLink = link
               if(link.link_id > 0){
                    this.deleteMessage = "你确定要删除" + link.link_name + "这个链接吗？"
                    this.dialogVisible = true
                    this.currentDeleteLink = link
               }
               else{
                   this.deleteUserLink()
               } 
               
            },
            async deleteUserLink(){
                 let link = this.currentDeleteLink
                 if(link.link_id==0){
                   let index = link.index
                   this.otherLinks.splice(index,1)
                }
                else{
                    let res = await deleteLink(link.link_id)//delete from web
                    if(res.code != 0){
                        toast(this,res.cMsg)
                    }
                    toast(this,'删除成功')
                    let index = this.otherLinks.findIndex(s=>{
                        return link.link_id == s.link_id
                    })
                    if(index >= 0){
                        this.otherLinks.splice(index,1)
                    }
                    removeStore('userInfo')
                }
            },
            initLink(){
                if(this.userInfo.links && Array.from(this.userInfo.links).length > 0){
                    this.mainLink = this.userInfo.links[0]
                    if(Array.from(this.userInfo.links).length > 1){
                        this.otherLinks = this.userInfo.links.filter(s=>{
                            return s.link_id != this.mainLink.link_id
                        })
                    }
                }
            },
            checkLink(link){
                if(isStringNullOrEmpty(link.link_name) && isStringNullOrEmpty(link.link_url)){
                    return false
                }
                if(!isStringNullOrEmpty(link.link_name) && !isStringNullOrEmpty(link.link_url)){
                    if(link.link_url.substring(0,7) != "http://" && link.link_url.substring(0,8) != "https://"){
                        link.link_url = "http://" + link.link_url
                    }
                    if(/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(link.link_url)){
                        return true
                    }
                    else{
                        toast(this,'名称为 ' + link.link_name + ' 的url格式填写错误，请修正')
                        return false
                    }
                    
                }
                toast(this,'网站名称和网站地址不能有一样为空')
                return false
            },
            
            
        },
        computed:{
            uploadHeadUrl(){
                return imgPath + 'api/user/uploadHead/' + userId() + '/' + createToken()
            },
        },
        components:{
            upToTop,blogFoot,addLink
        }
        
    }
</script>

<style >
.mySetting{
    background: white;
    margin-top: 70px;
    border-top: 5px solid deepskyblue;
}
.featureTitle{
    margin-bottom: 0px;
    padding: 10px;
    font-weight: bold;
}
.userSettingTab{
    font-size: 20px;
}

.basicInfoForm{
    margin-left: 20px;
    margin-top: 50px;
}
.basicInfoEditManageClass{
    padding: 15px;
    margin-top: 20px;
}
.basicInfoEditManageClass form{
    display:  flex;
    flex-wrap: wrap
}
.basicInfoEditManageClass form div{
    width: 45%;

}
.basicInfoEditManageClass form div div{
    width: 70%
}
div.el-upload{
    display: flex;
    align-items: center;
}
.el-input{
    width: 300px;
}
.emailValidated{
    font-size: 14px;
    color: #666;
}

.infoTitleClass{
    width: 70px;
    display: inline-block;
    color: #555;
}

.birthdayTitleClass{
    margin-left: -5px;
}
.myLinkInput{
    width: 300px;
}
.addNewLink{
   font-size: 16px;
   color: #20a0ff
}
.addNewLink:hover{
    cursor: pointer;
}
.avatar-uploader{
display: inline-block;
}
.avatar-uploader .el-upload {
    
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
    width: 100px;
    height: 100px;
    line-height: 100px;
    text-align: center;
    border-radius: 50px;
    border: 1px dotted #20a0ff;
  }
  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    display: block;
    border: 1px dashed #d9d9d9;
  }

.saveBasicInfoButton{
    width: 100px;
    margin-top: 20px;
    margin-bottom: 50px;
}
.userdesciption{
    max-width: 600px;
}
 @media (max-width:500px){

    .basicInfoForm{
         margin-left: 5px;
 
    }
    .myLinkInput{
        width: 250px;
    }
    .user_input{
        width: 220px;
    }
    .userdesciption{
        max-width: 400px;
    }
} 
 @media (max-width:550px){

 
    .myLinkInput{
        width: 200px;
    }

} 
 @media (max-width:360px){

    .basicInfoForm{
         margin-left: 5px;
 
    }
    .user_input{
        width: 200px;
    }
    .userdesciption{
        max-width: 300px;
    }
    .myLinkInput{
        width: 120px;
    }
} 
 @media (max-width:400px){

    .basicInfoForm{
         margin-left: 5px;
 
    }
    .user_input{
        width: 180px;
    }
    .userdesciption{
        max-width: 300px;
    }

    .myLinkInput{
        width: 180px;
    }
} 
</style>