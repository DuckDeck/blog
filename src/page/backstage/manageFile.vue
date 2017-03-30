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

          <div>
              <div class="uploadedContent">
                  <img src="" alt="">
                  <span></span>
                   <el-button size="small" @click = "checkComment(scope.row)">删除</el-button>
              </div>
          </div>
      </div>
    </div>
</template>
<script>
    export default {
        data: function(){
            return {
                files:[]
            }
        },
        mounted(){

        },
        computed:{
            
        }
    }
</script>