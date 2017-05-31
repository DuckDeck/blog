<template>
    <div>
         <div class="featureTitle">
            个人信息
          </div>
          
         <div style="font-size: 40px;text-align: center;margin-top: 20px;">
                   
         </div>

         <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="个人详情" name="userInfo">
                 <div class="userInfoManageClass"> 
                    <div class="basicInfoManageClass" >
                        <div class="basicInfoManageTitleClass">
                            基本信息  <el-button class="saveInfoButton" type="primary" @click="submitForm('userInfo')">保存</el-button>
                        </div>
                        <div class="basicInfoEditManageClass">
                            <el-form :model="userInfo" :rules="rules" ref="userInfo" label-width="0px" >
                            <el-form-item >
                            <span class="infoTitleClass">账号</span>   <el-input v-model="userInfo.user_name" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item prop="user_real_name" >
                                <span class="infoTitleClass">用户姓名</span>  <el-input v-model="userInfo.user_real_name" ></el-input>
                            </el-form-item>
                            <el-form-item >
                                <span class="infoTitleClass">手机号</span>  <el-input v-model="userInfo.user_phone" ></el-input>
                            </el-form-item>
                            <el-form-item >
                                <span class="infoTitleClass">邮箱</span>  <el-input v-model="userInfo.user_email" ></el-input>
                            </el-form-item>
                            <el-form-item >
                                <span class="infoTitleClass">QQ号</span>  <el-input v-model="userInfo.user_qq" ></el-input>
                            </el-form-item>
                            <el-form-item >
                                <span class="infoTitleClass">地址</span>  <el-input v-model="userInfo.user_addreddss" ></el-input>
                            </el-form-item>
                            <el-form-item >
                             <span class="infoTitleClass">生日</span>  <el-date-picker
                                    v-model="userInfo.user_birthday"
                                    type="date"
                                    placeholder="选择日期"  >
                                    </el-date-picker>
                            </el-form-item>
                        </el-form>
                        </div>
                    </div>
                    <div class="basicInfoManageClass" >
                        <div class="headinfoManageTitleClass">   用户头像  </div>
                        <div class="basicInfoEditManageClass">
                              <el-upload class="avatar-uploader" :action="uploadHeadUrl" :show-file-list="false"
                                        :on-success="handleAvatarScucess" :before-upload="beforeAvatarUpload">
                                        <img v-if="userInfo.user_image_url.length > 10" :src="userInfo.user_image_url" class="avatar"> 
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i> </el-upload>
                        </div>
                    </div>
                    <div class="basicInfoManageClass" >
                        <div class="selfIntroManageTitleClass">
                            自我描述
                            <el-button class="saveInfoButton" type="primary" @click="submitForm('userInfo')">保存</el-button>
                        </div>
                        <div class="basicInfoEditManageClass">
                            <el-form> 
                                <el-form-item >                 
                                    <span class="infoTitleClass">自我描述</span> 
                                    <el-input
                                        type="textarea"
                                        :rows="2" v-model="userInfo.user_description"
                                        placeholder="请输入内容">
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item >     
                                    <span class="infoTitleClass">个人语录</span>
                                     <el-input
                                        type="textarea" v-model = "userInfo.user_says"
                                        :rows="2"
                                        placeholder="请输入内容">
                                        </el-input>
                                    </el-form-item>
                            </el-form>   
                        </div>
                    </div>

                </div>
            </el-tab-pane>
            <el-tab-pane label="标签/分类" name="tag">
                     <div class="tagSortManageClass"> 
                        <div class="sortManageClass" >
                            <div class="sortManageTitleClass">
                                分类管理
                            </div>
                            <div class="sortsManageClass">
                                <el-tag :key="sort" v-for="sort in sorts" type='primary' :closable="true" 
                                :close-transition="false"  @close="handleSortClose(sort)">
                                {{sort.sort_article_name}}
                                </el-tag>
                                <el-input style="width: 80px;" v-if="inputVisibleSort" v-model="inputValueSort" ref="saveSortInput" size="mini" 
                                @keyup.enter.native="handleSortInputConfirm"@blur="handleSortInputConfirm"
                                >
                                </el-input>
                                <el-button style="height: 28px;" v-else class="button-new-tag" size="small" @click="showSortInput">+ 新标签</el-button>
                            </div>
                        </div>

                        <div class="tagManageClass">
                            <div class="tagManageTitleClass">
                                标签管理
                            </div>
                            <div class="tagssManageClass">
                                <el-tag :key="tag" v-for="tag in tags" type='primary' :closable="true" :close-transition="false" @close="handleTagClose(tag)">
                                {{tag.tag_name}}
                                </el-tag>
                                <el-input style="width: 80px;" v-if="inputVisibleTag" v-model="inputValueTag" ref="saveTagInput" size="mini" 
                                @keyup.enter.native="handleTagInputConfirm"@blur="handleTagInputConfirm"
                                >
                                </el-input>
                                <el-button v-else style="height: 28px;" class="button-new-tag" size="small" @click="showTagInput">+ 新标签</el-button>
                            </div>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="友情链接" name="link">
                      <div class="table">
                        <el-table :data="tableData" border style="width: 100%">
                            <el-table-column prop="link_name" label="链接名称" sortable width="160" >
                            </el-table-column>
                            <el-table-column  label="链接地址" >
                                <template scope="scope">
                                    <a class="articleTitleClass" @click="gotoLink(scope.row)" >{{scope.row.link_url}}</a>
                                </template>
                            </el-table-column>
                            <el-table-column prop="link_logo" label="链接LOGO" sortable width="150">
                            </el-table-column>
                            <el-table-column prop="show_order"  label="链接排序,默认为0" >
                            </el-table-column>
                        </el-table>
                        <div class="pagination">
                            <el-pagination
                                    layout="prev, pager, next"
                                    :total="tableData.length">
                            </el-pagination>
                        </div>
                        <div style="clear: both">  </div>
                    </div>
                </el-tab-pane>
        </el-tabs>

       
    </div>
</template>

<script>
import {addTag,getTags,getSorts,addSort,deleteSort,deleteTag,getUserInfo,getUserLinks} from '../../store/service'
import {userInfoById} from '../../store/manageService'
import {imgPath} from '../../../config/imgPathConfig'
    export default {
        data: function(){
            return {
                activeName:'userInfo',
                userInfo:{},
                tags:[],
                sorts:[],
                inputVisibleSort:false,
                inputValueSort:'',
                inputVisibleTag: false,
                inputValueTag: '',
                userInfo:{
                    user_birthday:'',
                    user_image_url:'',
                    user_description:'',
                    user_says:''
                },
                rules: {
                    
                },
                tableData: [],
            }
        },
        async mounted(){
            let id = this.$route.params.id
            let self = this
            getTags(id).then(function(result){
                if(result.code == 0){
                    self.tags = result.data
                   
                }
            })
            getSorts(id).then(function(result){
                if(result.code == 0){
                    self.sorts = result.data
                }
            })
            getUserInfo(id).then(res=>{
                if(res.code == 0){
                    self.userInfo = res.data
                }
            })
            getUserLinks(id).then(res=>{
                if(res.code == 0){
                    self.tableData = res.data
                }
            })
        },
        methods:{
           handleSortClose(sort) {
                let self = this
                deleteSort(sort).then(res=>{
                    toast(self,res.cMsg)
                    if(res.code == 0){
                       let index = self.sorts.indexOf(sort)
                       if(index >=0){
                            self.sorts.splice(index,1)
                       } 
                    }
                }).catch(err=>{
                    toast(self,err.cMsg)
                })              
            },
            handleClick(tab,event){
                
            },
            handleTagClose(tag) {
                let self = this
                deleteTag(tag).then(res=>{
                    toast(self,res.cMsg)
                    if(res.code == 0){
                       let index = self.tags.indexOf(tag)
                       if(index >=0){
                            self.tags.splice(index,1)
                       } 
                    }
                }).catch(err=>{
                    toast(self,err.cMsg)
                })
            },
            showSortInput() {
                this.inputVisibleSort = true;
                this.$nextTick(_ => {
                  this.$refs.saveSortInput.$refs.input.focus();
                });
            },
            showTagInput() {
                this.inputVisibleTag = true;
                this.$nextTick(_ => {
                  this.$refs.saveTagInput.$refs.input.focus();
                });
            },
            handleSortInputConfirm() {
                let inputValue = this.inputValueSort;
                this.inputVisibleSort = false;
                this.inputValueSort = '';
                if(inputValue.length == 0){
                    return
                }
                let self = this
                addSort(inputValue).then(result=>{
                     toast(self,result.cMsg)   
                     let id = result.data.id
                     let sort = {sort_id:id,sort_article_name:inputValue}
                     self.sorts.push(sort)
                }).catch(err=>{
                    toast(self,err.cMsg)
                })
            },
            handleTagInputConfirm(){
                let inputValue = this.inputValueTag;
                this.inputVisibleTag = false;
                this.inputValueTag = '';
                if(inputValue.length == 0){
                    return
                }
                let self = this
                addTag(inputValue).then(result=>{
                     toast(self,result.cMsg)   
                     let id = result.data.id
                     let tag = {tag_id:id,tag_name:inputValue}
                     self.tags.push(tag)
                }).catch(err=>{
                    toast(self,err.cMsg)
                })
            },
            handleAvatarScucess(res, file) {
                this.userInfo.user_image_url = res.data.url;
                clearStore()
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            gotoLink(link){
                window.location.href = link.link_url
            }
            
        },
        computed:{
            uploadHeadUrl(){
                return imgPath +  'api/user/uploadHead/' + userId + '/' + createToken()
            }
        },
        components:{
            
        }
    }
</script>

<style scoped>
.tagSortManageClass{
    display: flex;
    font-size: 20px;
    justify-content: space-between;
    margin-top: 20px;
}
.sortManageClass{
    border: 1px solid #bbb;
    width: 47%;
    min-height: 180px;
}
.tagManageClass{
    border: 1px solid #bbb;
    width: 47%;
    min-height: 180px;
}
.sortManageTitleClass{
    color: white;
    background: palevioletred;
    height: 60px;
    padding: 5px 10px;
    line-height: 50px;
}
.tagManageTitleClass{
     color: white;
    background: lightseagreen;
    height: 60px;
    padding: 5px 10px;
    line-height: 50px;
}
.sortsManageClass{
    display: flex;
    padding: 15px;
    flex-wrap: wrap;
}
.sortsManageClass span{
    margin-right: 10px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    margin-bottom: 10px;
   
}

.tagssManageClass{
    display: flex;
    padding: 15px;
    flex-wrap: wrap;
}
.tagssManageClass span{
    margin-right: 10px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    margin-bottom: 10px;
}

.userInfoManageClass{
    display: flex;
    font-size: 20px;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 20px;
}
.basicInfoManageClass{
    border: 1px solid #bbb;
    width: 90%;
    min-height: 180px;
    margin-bottom: 20px;
}

.basicInfoManageTitleClass{
    color: white;
    background: palevioletred;
    height: 60px;
    padding: 5px 10px;
    line-height: 50px;
}

.basicInfoEditManageClass{
    padding: 15px;

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
.saveInfoButton{
    width: 100px;
    float: right;
    margin-top: 8px;
    margin-right: 10px;
}
.infoTitleClass{
    width: 60px;
    display: inline-block
}
.avatar-uploader{
display: inline-block;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
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
    width: 128px;
    height: 128px;
    line-height: 128px;
    text-align: center;
    border: 1px dotted #20a0ff;
  }
  .avatar {
    width: 128px;
    height: 128px;
    display: block;
  }
  .headinfoManageTitleClass{
       color: white;
   
        height: 60px;
        padding: 5px 10px;
        line-height: 50px;
      background: limegreen
  }
  .selfIntroManageTitleClass{
        color: white;
   
        height: 60px;
        padding: 5px 10px;
        line-height: 50px;
      background: orchid
  }
</style>