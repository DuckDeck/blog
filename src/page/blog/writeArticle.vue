<template>
    <div class="container">
      <div class="writeClassPage">
            <div class="featureTitle">
             <span>{{previewStatus}}</span>
             
              <div>
                  <el-button class="editor-btn" type="primary" @click="reviewArticle">{{previewButtonStatus}}</el-button>
                  <el-button class="editor-btn" type="primary" v-show="isEdit" @click="switchMarkDown">{{editStatus}}</el-button>
              </div>
            </div>
            <div style="font-size: 20px;height: 90%;margin-top: 30px;" v-show="isEdit">
                <el-form :model="article" :rules="rules" ref="article" label-width="0px" style="height: 60%"  >
                        <el-form-item prop="title">
                            <el-input class="articleTitle" v-model="article.title" placeholder="文章标题"></el-input>
                        </el-form-item>
                        <el-form-item >
                            <span>请选择文章标签:   </span>
                            <el-button   :class="[{selectedTag:isTagContain(tag)},'tagClass']" v-for="tag in tags"   @click="selectTag(tag)" >
                            {{tag.tag_name}}
                            </el-button>      
                        </el-form-item>
                        <el-form-item >
                            <span>请选择文章类型:   </span>
                            <el-button :class="[{selectedTag:sort.sort_article_id == selectedSortId},'tagClass']"  v-for="sort in articleSort"   @click="selectSort(sort)" >
                                {{sort.sort_article_name}}
                            </el-button>
                        </el-form-item>
                        <!--VueHtml5Editor不能及时更新上传的url，因为一开始就只读读一次配置，所以是写死的，需要解决这个问题-->
                        <!--使用这个vue-html5-editor确实无解了，无法变成url会让上传的图片都不知道是谁，所以要么用别的组件，要么hook 这个ajax请求，更改url-->
                        <!--搞定，使用Js 拦截全局ajax请求并更改url的方法完全解决-->
                        <vue-html5-editor class="editor" v-show="editMode" :content="content" @change="updateData" ></vue-html5-editor>
                        <mavonEditor @change="updateMarkdownData" @save="saveMarkdownData" class="editor" v-show="!editMode" v-model="markDownContent"/>
                        <div class="handleArticleClass">
                            <el-button class="editor-btn" type="primary"  @click="save('article',1)">发布文章</el-button>
                            <el-button class="editor-btn" type="primary" v-show="isNew" @click="tempSave(false)">保存草稿</el-button>
                            <i class="fa fa-spinner fa-pulse" v-show="isSaving" style="float: right;margin-top: 7px;"></i>
                            <div style="clear: both">
                            </div>
                        </div>
                    </el-form>
            </div>
            <div class=previecArticle v-show="!isEdit">
                <div  class="articleHeader" >
                    {{article.title}}
                </div>
                <div  class="articleTagClass">
                        <el-tag  v-for="t in selectedTags"   type="primary"  >{{t.tag_name}}</el-tag>
                </div>
                <article class="articleContentClass" v-html = "content"></article>
            </div>
      </div>
      <blogFoot></blogFoot>
    </div>
</template>
<script>
import {getTags,getSorts,saveArticle,tempArticle,articleById,saveTempArticle} from '../../store/service'
import blogFoot from './com/blogFoot.vue'
import { mavonEditor } from 'mavon-editor'
import  toMarkdown  from 'to-markdown'

//wait to do auto save feature
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
                selectedTags:[],
                tag:'',
                articleSort:[],
                selectedSortId:0,
                content: '',
                markDownContent:'',
                editorOption: {
                    placeholder:'从这里开始写你的文章'
                },
                articleId:0,
                isNew:false,//是不是新文章  
                isEdit:true,
                needAutoSave:false,
                editMode:true,
                userInfo:{},
                isSaving:false,
                previousLetterCount:0,
                isSaving:false
            }
        },
        async mounted(){
            this.userInfo = getStore('userInfo')
            this.editMode = this.userInfo.user_editor_type == 0
            let res = {}
            let id = parseInt(this.$route.params.id)
            if(id == 0){
                this.isNew = true
            }
            this.articleId = id
            if( id == 0){
                res = await tempArticle()
                if(res.code == 0){
                    let articleDetail = res.data
                    this.article.title = articleDetail.article_name
                    this.selectedTags = articleDetail.tags
                    this.selectedSortId = articleDetail.article_sort_id
                    this.content = articleDetail.article_content
                    this.markDownContent = toMarkdown(this.content)
                    this.articleId = articleDetail.article_id
                }
            }
            else{
                res = await articleById(id)
                if(res.code == 0){
                    let articleDetail = res.data
                    this.article.title = articleDetail.article_name
                    this.selectedTags = articleDetail.tags
                    this.selectedSortId = articleDetail.article_sort_id
                    this.content = articleDetail.article_content
                     this.markDownContent = toMarkdown(this.content)
                    this.articleId = articleDetail.article_id
                }
            }
            res = await getTags(this.userInfo.user_id)
            if(res.code == 0){
                let tmp = res.data
                tmp.unshift({
                    tag_id: 0,
                    user_id: this.userId,
                    tag_name: "无标签",
                    isSelected : false
                })
                this.tags = tmp
            }
            res = await getSorts(this.userInfo.user_id)
            if(res.code == 0){
                let tmp  = res.data
                tmp.unshift({
                    sort_article_id: 0,
                    user_id: this.userId,
                    sort_article_name: "无分类",
                    isSelected : false
                })
                this.articleSort = tmp
            }
            
            setGlobalVue(this)
        },
        methods:{
            selectTag(tag){
                let index = this.selectedTags.findIndex(s=>{
                    return s.tag_id == tag.tag_id
                })
                if(index < 0 ){
                    this.selectedTags.push(tag)
                }
                else{
                    this.selectedTags.splice(index,1)
                }
            },
            isTagContain(tag){
                let index = this.selectedTags.findIndex(s=>{
                    return s.tag_id == tag.tag_id
                })
                return index >= 0
            },
            selectSort(sort) {
                this.selectedSortId = sort.sort_article_id
            },
            switchMarkDown(){
                this.editMode = !this.editMode
                if(!this.editMode)
                {
                    this.markDownContent = toMarkdown(this.content)
                }
            },
            reviewArticle(){
                this.isEdit = !this.isEdit
            },
            updateData(data){
                this.content = data
                this.saveData()
            },
            updateMarkdownData(val,render){
                this.markDownContent =  val;
                this.content = render
                this.saveData()
            },
            async saveMarkdownData(val,render){
                if(!this.editMode){
                    this.markDownContent =  val;
                    this.content = render            
                    await this.tempSave(false)
                }
            },
            async saveData(){
                 if(this.content.length - this.previousLetterCount > 100){
                    if(this.isSaving){
                         return
                    }
                    this.isSaving = true
                    await this.tempSave()
                    this.isSaving = false
                    this.previousLetterCount = this.content.length
                }
            },
            imgCallBack(result){
                if(result.code == 0){
                    this.content = this.content +  "<span style='text-align:center;display:block'><img style='max-width:100%;height:auto' src="+ result.data +" ></img></span>"
                }
                else{
                    toast(this,result.cMsg)
                }
            },
            save(formName){
                let self = this;
                // if(self.selectedTags.length <= 0){
                //     toast(self,'你没有选择文章标签')
                //     return
                // }
                // if(self.selectedSortId <= 0){
                //     toast(self,'你没有选择文章类型')
                //     return
                // }
                
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        let filterContent  = self.content.replace(/<(?:.|\s)*?>/g,'').replace(/\s/g,'').substr(0,200)
                        let article = {
                            articalTitle:self.article.title,
                            articalSort:self.selectedSortId,
                            articalTags:self.selectedTags.map((s=>{
                                            return s.tag_id
                                        })),
                            articalContent:self.content,
                            articleStatus:1,
                            articleId:self.articleId,
                            articleBrief:filterContent,
                        }
                        saveArticle(article,self.isNew).then(function(data){
                            if(data.code == 0){
                               self.isNew = false
                               toast(self,'保存成功')
                               let id = data.data.id
                               self.$router.push('/article/' + id)
                            }
                            else{
                                toast(self,err.cMsg)
                            }
                        },function(err){
                            toast(self,err.cMsg)   
                        })
                    }
                });
            },
            cancle(){
                this.$router.replace('/manage/manageArticle');
            },
            async tempSave(auto = true){
                if(!this.isNew)
                {
                    return
                }
                if(isStringNullOrEmpty(this.article.title) && isStringNullOrEmpty(this.content)){
                    return
                }
                let filterContent  = this.content.replace(/<(?:.|\s)*?>/g,'').replace(/\s/g,'').substr(0,200)
                let article = {
                    articalTitle:this.article.title,
                    articalSort:this.selectedSortId,
                    articalTags:this.selectedTags.map((s=>{
                                    return s.tag_id
                                })),
                    articalContent:this.content,
                    articleId:this.articleId,
                    articleBrief:filterContent,
                }
                this.isSaving = true
                let res = await saveTempArticle(article)
                this.isSaving = false
                if(res.code == 0){
                    this.articleId = res.data.id
                    if(!auto){
                        toast(this,"保存成功")
                    }
                }
            }
        },
        computed:{
            editStatus(){
                return this.editMode ? '切换Markdown': '切换富文本'
            },
            previewStatus(){
                return this.isEdit ? '发布文章': '预览文章'
            },
            previewButtonStatus(){
                return this.isEdit ? '预览文章': '编辑文章'
            },
        },
        components:{
            blogFoot,mavonEditor
        },
        beforeDestroy(){
             this.tempSave()
        }
    }
</script>

<style scoped>
.featureTitle{
    display: flex;
    justify-content: space-between;
    line-height: 36px;
}
.articleTitle{
    width: 100%;
}
.writeClassPage{
    background: white;
    padding: 20px;
    margin-top: 50px;
    border-top: 5px solid #ff00cc;
}
 .tagClass{
    cursor: pointer;
    margin-right: 0.15rem;
    margin-top: 10px;
 }
 .selectedTag{
    background: #20a0ff;
    color: white;
 }
.editor{
    min-height: 500px;
    height: auto;
}
.handleArticleClass{
    margin-top: 20px;
    margin-bottom: 30px;
}
.editor-btn{
    float: right;
    margin-left: 20px;
}
.previecArticle{
    min-height: 665px;
}
@media (max-width:500px){
.featureTitle{
    
    flex-direction: column;
}
    
} 
</style>