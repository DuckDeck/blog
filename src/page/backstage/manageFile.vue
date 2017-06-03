<template >
    <div style="height: 100%">
      <div class="featureTitle">
           我上传的文件
      </div>
      <div class="uploadArea">
          <div class="uploadFile">
              <el-upload    class="upload-demo" drag  action="https://jsonplaceholder.typicode.com/posts/"    multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
          </div>

          <div class="uploadedContainer">
              <div v-for="f in files" class="uploadedContent">
                  <img :src="f.file_url" alt="">
                  <span class="uploadedFileName">{{f.file_name}}</span>
                   <el-button size="small" @click = "deleteFile(f)">删除</el-button>
              </div>
          </div>
      </div>
    </div>
</template>

<script>
import {getStoredFiles,deleteFile}  from '../../store/manageService'
    export default {
        data: function(){
            return {
                files:[]
            }
        },
        mounted(){          
           getStoredFiles().then(res=>{
                if(res.code == 0){
                    this.files = res.data
                }
                else{
                     toast(this,err.cMsg)
                }
           }).catch(err=>{
               toast(this,err.cMsg)
           })
        
        },
        methods:{
            async deleteFile(file){
                let res = await deleteFile(file.file_name)
                if(res.code == 0){
                    let index = this.files.findIndex(s=>{
                        return s.file_name == file.file_name
                    })
                    if(index >= 0){
                        this.files.splice(index,1)
                    }
                    toast(this,'删除成功')
                }
                else{
                    toast(this,res.cMsg)
                }
            }
        }
    }
</script>
<style>
.uploadedContainer{
    display: flex;
    flex-wrap: wrap;
    margin-top: 50px;
}
.uploadFile{
    font-size: 20px;
}
    .uploadedContent{
       width: 200px;
       font-size: 16px;
       text-align: center;
       padding-bottom: 10px;
    }
    .uploadedContent img{
        width: 160px;
        height:160px;
        border-radius: 5px;
        margin-bottom: 10px;
    }
    .uploadedFileName{
        display: block;
    }
</style>