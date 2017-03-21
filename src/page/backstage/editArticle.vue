<template>
    <div style="height: 100%">
      <div class="featureTitle">
          发布文章
      </div>
      <div style="font-size: 20px;height: 90%">
          <el-form :model="article" :rules="rules" ref="article" label-width="0px" style="height: 60%"  >
                <el-form-item prop="title">
                    <el-input v-model="article.title" placeholder="文章标题"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-autocomplete  v-model="tag" :fetch-suggestions="getTags" placeholder="请输入标签" @select="handleSelect" ></el-autocomplete>
                    <el-tag class="selectedTagClass" v-for="tag in selectedTags" :closable="true"  type="primary" @close = "deleteTag(tag)" >
                    {{tag.value}}
                    </el-tag>
                    
                </el-form-item>
                <el-form-item >
                  <el-dropdown @command="dropdownSelect">
                    <el-button type="primary"> 文章分类<i class="el-icon-caret-bottom el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown" style="font-size: 21px" >
                        <el-dropdown-item v-for="sort in articleSort" :command="sort.sort_article_id.toString()" >{{sort.sort_article_name}}</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <span class="selectedTagClass" v-show="selectedSortId > 0">{{selectedSortName}}</span>
                </el-form-item>


                <!--<quill-editor ref="articleTextEditor" @editor-change = "editChange" style="font-size: 20px" v-model="content" :config="editorOption"></quill-editor>-->
                <vue-html5-editor :content="content" @change="updateData" ></vue-html5-editor>
                <div class="handleArticleClass">
                    
                    <el-button class="editor-btn" type="primary" @click="save('article',1)">发布文章</el-button>
                    <el-button class="editor-btn" type="primary" @click="save('article',0)">保存草稿</el-button>
                    <el-button v-if="articleId>0" class="editor-btn" type="primary" @click="cancle">取消</el-button>
                </div>
            </el-form>

          
         
      </div>
    </div>
</template>

<script>
import {addTag,getTags,getSorts,saveArticle} from '../../store/service'


    export default {
        data: function(){
            return {
                article: {
                    title: '',
                },
                rules: {
                    title: [
                        { required: true, message: '请输入文章标题', trigger: 'blur' }
                    ],
                },
                tags: [],
                disposedTag:[],
                selectedTags:[],
                filteredTags:[],
                tag:'',
                articleSort:[],
                selectedSortId:0,
                content: '',
                editorOption: {
                    // something config
                    placeholder:'从这里开始写你的文章'
                },
                articleId:0,
            }
        },
        mounted(){
            this.articleId = this.$route.params.id
            let self = this
            getTags().then(function(result){
                if(result.code == 0){
                    self.tags = result.data
                    for(var item of self.tags){
                        self.disposedTag.push({value:item.tag_name,id:item.tag_id})
                    }
                }
            })
            getSorts().then(function(result){
                console.log(result)
                if(result.code == 0){
                    self.articleSort = result.data
                }
            })
            if(this.articleId > 0){
                let articleDetail = getStore('article' + this.articleId)
                if(!articleDetail){
                    self.$vux.toast.show({
                        text: "文章信息错误",
                        position:"bottom",
                        type:'text'
                    })
                    return
                }
                this.article.title = articleDetail.article_name
                this.selectedTags = articleDetail.tag.map(s=>{
                    return {value:s.tag_name,id:s.tag_id}
                })
                this.selectedSortId = articleDetail.article_sort__id
                this.content = articleDetail.article_content
            }
        },
        methods:{
            getTags(str,cb){
                if(str.length == 0){
                    this.filteredTags = this.disposedTag
                    cb(this.filteredTags)
                }
                else{
                    this.filteredTags  = this.disposedTag.filter(function(item){
                        return item.value.indexOf(str) >= 0
                    })
                    cb(this.filteredTags)
                }
              
            },
            handleSelect(item) {
                if(this.selectedTags.find((s)=>{
                    return item.id == s.id
                })){
                    return
                }
                this.selectedTags.push(item)
            },
            deleteTag(tag){
                let index = this.selectedTags.indexOf(tag)
                if(index >= 0){
                    this.selectedTags.splice(index,1)
                }
            },
            dropdownSelect(command){
                this.selectedSortId = parseInt(command)
            },
            updateData(data){
                this.content = data
            },
            save(formName,mode){
                let self = this;
                if(self.selectedTags.length <= 0){
                    self.$vux.toast.show({
                        text: '你没有选择文章标签',
                        position:"bottom",
                        type:'text'
                    })
                    return
                }
                if(self.selectedSortId <= 0){
                    self.$vux.toast.show({
                        text: '你没有选择文章类型',
                        position:"bottom",
                        type:'text'
                    })
                    return
                }
                console.log(this.content)
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        let article = {
                            articalTitle:self.article.title,
                            articalSort:self.selectedSortId,
                            articalTags:self.selectedTags.map((s=>{
                                            return s.id
                                        })),
                            articalContent:self.content,
                            articleStatus:mode,
                            articleId:self.articleId
                        }
                        saveArticle(article).then(function(data){
                            if(data.code == 0){
                               self.$vux.toast.show({
                                    text: "保存成功",
                                    position:"bottom",
                                    type:'text'
                                })
                                
                                self.$router.push('/manage/article/' + data.data.id);
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
            },
            cancle(){
                this.$router.replace('/manage/manageArticle');
            }
        },
        computed:{
            selectedSortName(){
                let s =  this.articleSort.find((item)=>{
                    return item.sort_article_id == this.selectedSortId
                })
                if(s!=undefined)
                     return s.sort_article_name
                
            }
        },
        components:{
            
        }
    }
</script>

<style scoped>


 .selectedTagClass{
    margin-left: 0.15rem;
    margin-right: 0.05rem;

 }
.selectedTagDeleteClass{
    background: white;
    color: black;
}
.handleArticleClass{
    margin-top: 20px;
}
.editor-btn{
    float: right;
    margin-left: 20px;
}
</style>