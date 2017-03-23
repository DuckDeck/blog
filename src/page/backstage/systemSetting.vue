<template>
    <div>
         <div class="featureTitle">
          系统设置
        </div>
        <div class="systemInfoManageClass"> 
            <div class="basicInfoManageClass" >
                <div class="basicInfoManageTitleClass">
                    基本信息  <el-button class="saveInfoButton" type="primary" @click="submitForm('systemInfo')">保存</el-button>
                </div>
                <div class="basicInfoEditManageClass">
                  <el-form :model="systemInfo" :rules="rules" ref="systemInfo" label-width="0px" >
                    <el-form-item prop='blog_name' >
                       <span class="infoTitleClass">站点名称</span>   <el-input v-model="systemInfo.blog_name"></el-input>
                    </el-form-item>
                     <el-form-item prop="blog_description" >
                        <span class="infoTitleClass">站点描述</span>  <el-input v-model="systemInfo.blog_description" ></el-input>
                    </el-form-item>
                     <el-form-item prop='blog_keyword' >
                        <span class="infoTitleClass">站点关键词</span>  <el-input v-model="systemInfo.blog_keyword" ></el-input>
                    </el-form-item>
                  </el-form>
                </div>
            </div>
             <div class="basicInfoManageClass" >
                <div class="basicInfoManageTitleClass" style="background: coral">
                    个性化设置 <el-button class="saveInfoButton" type="primary" @click="submitForm('myLink')">保存</el-button>
                </div>
                <div class="basicInfoEditManageClass">
                    <el-form :model="myLink" :rules="linkRules" ref="myLink" label-width="0px" >
                    <el-form-item prop="url" >
                       <span class="infoTitleClass">微博账号</span>   <el-input v-model="myLink.weibo.link_url"></el-input>
                    </el-form-item>
                     <el-form-item prop="user_real_name" >
                        <span class="infoTitleClass">Github账号</span>  <el-input v-model="myLink.github.link_url" ></el-input>
                    </el-form-item>
                     <el-form-item >
                        <span class="infoTitleClass">知乎账号</span>  <el-input v-model="myLink.zhihu.link_url" ></el-input>
                    </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {getSysytemInfo,uploadSysytemInfo,getUserLinks} from '../../store/service'
    export default {
        data: function(){
            return {
                systemInfo:{
                    blog_name:'',
                    blog_description:'',
                    blog_keyword:'',
                },
                rules: {
                    blog_name: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    blog_description: [
                        { required: true, message: '请输入博客描述', trigger: 'blur' }
                    ],
                    blog_keyword: [
                        { required: true, message: '请输入博客关键字', trigger: 'blur' }
                    ]
                },
                myLink:{
                    weibo:{},
                    github:{},
                    zhihu:{}
                },
                linkRules:{
                    url:[
                        { required: false, type:'url', message: '请输入名称', trigger: 'blur' }
                    ]
                }
            }
        },
        mounted(){
            let self = this
            getSysytemInfo().then(res=>{
                if(res.code == 0){
                    self.systemInfo = res.data
                }
                else{
                    toast(self,res.ChineseMsg)
                }
            }).catch(err=>{
                toast(self,err.ChineseMsg)
            })
            getUserLinks().then(res=>{
                if(res.code == 0){
                    for(link in res.data){
                        if(link.link_name == 'weibo'){
                            self.myLink.weibo = link
                        }
                        if(link.link_name == 'github'){
                            self.myLink.weibo = link
                        }
                        if(link.link_name == 'zhihu'){
                            self.myLink.weibo = link
                        }
                    }
                }
                else{
                    toast(self,res.ChineseMsg)
                }
            }).catch(err=>{
                toast(self,err.ChineseMsg)
            })
        },
        methods:{
          submitForm(formName){
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        let system = {
                            blog_name:self.systemInfo.blog_name,
                            blog_desc:self.systemInfo.blog_description,
                            blog_keyword:self.systemInfo.blog_keyword
                        }
                       uploadSysytemInfo(system).then(res=>{
                          toast(self,res.ChineseMsg)               
                       }).catch(err=>{
                           toast(self,err.ChineseMsg)
                       })
                    }
                });
               
                
            }
            
        }
        
    }
</script>

<style scoped>
.systemInfoManageClass{
    display: flex;
    font-size: 20px;

    justify-content: space-between;
    margin-top: 20px;
}
.basicInfoManageClass{
    border: 1px solid #bbb;
    width: 49%;
    min-height: 180px;
    margin-bottom: 20px;
}

.basicInfoManageTitleClass{
    color: white;
    background: lightseagreen;
    height: 60px;
    padding: 5px 10px;
    line-height: 50px;
}
.saveInfoButton{
        width: 100px;
    float: right;
    margin-top: 8px;
    margin-right: 10px;
}
.basicInfoEditManageClass{
    padding: 15px;

}
.basicInfoEditManageClass form{
    display:  flex;
    flex-wrap: wrap
}
.basicInfoEditManageClass form div{
    width: 90%;

}
.basicInfoEditManageClass form div div{
    width: 70%
}
.infoTitleClass{
    width: 80px;
    display: inline-block
}
</style>