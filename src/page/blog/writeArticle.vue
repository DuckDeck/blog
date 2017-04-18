<template>
    <div class="container">
      <div class="writeClassPage">
            <div class="featureTitle">
             发布文章
              <el-button class="editor-btn" type="primary" @click="save('article',1)">预览文章</el-button>
              <el-button class="editor-btn" type="primary" @click="save('article',0)">切换Markdown</el-button>
            </div>
            <div style="font-size: 20px;height: 90%">
                <el-form :model="article" :rules="rules" ref="article" label-width="0px" style="height: 60%"  >
                        <el-form-item prop="title">
                            <el-input v-model="article.title" placeholder="文章标题"></el-input>
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

                        <vue-html5-editor :content="content" @change="updateData" ></vue-html5-editor>
                        <div class="handleArticleClass">
                            <el-button class="editor-btn" type="primary" @click="save('article',1)">发布文章</el-button>
                            <el-button class="editor-btn" type="primary" @click="save('article',0)">保存草稿</el-button>
                            <div style="clear: both">
                                
                            </div>
                        </div>
                    </el-form>
            </div>
      </div>
      <blogFoot></blogFoot>
    </div>
</template>
<script>
import {getTags,getSorts,saveArticle,tempArticle} from '../../store/service'
import blogFoot from './com/blogFoot.vue'
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
                editorOption: {
                    placeholder:'从这里开始写你的文章'
                },
                mainImage:'',
                articleId:0,
                isEdit:true,
                needAutoSave:false,
                userInfo:{}
            }
        },
        async mounted(){
            this.userInfo = getStore('userInfo')
            let res = {}
            if( this.$route.params.id){
                 let articleDetail = res.data
                 this.article.title = articleDetail.article_name
                 this.selectedTags = articleDetail.tags
                 this.selectedSortId = articleDetail.article_sort_id
                 this.content = articleDetail.article_content
            }
            else{
                res = await tempArticle()
                if(res.code == 0){
                    let articleDetail = res.data
                    this.article.title = articleDetail.article_name
                    this.selectedTags = articleDetail.tags
                    this.selectedSortId = articleDetail.article_sort_id
                    this.content = articleDetail.article_content
                    this.articleId = articleDetail.article_id
                }
            }

            res = await getTags(this.userInfo.user_id)
            if(res.code == 0){
                this.tags = res.data
            }
            res = await getSorts(this.userInfo.user_id)
            if(res.code == 0){
                this.articleSort = res.data
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


            updateData(data){
                this.content = data
            },
            imgCallBack(result){
                console.log(result)
                if(result.code == 0){
                    if(this.mainImage == ''){
                        this.mainImage = result.data
                    }
                    this.content = this.content +  "<div style='text-align:center'><img style='max-width:100%;height:auto' src="+ result.data +" ></img></div>"
                }
                else{
                    toast(this,result.cMsg)
                }
            },
            save(formName,mode){
                let self = this;
                if(self.selectedTags.length <= 0){
                    toast(self,'你没有选择文章标签')
                    return
                }
                if(self.selectedSortId <= 0){
                    toast(self,'你没有选择文章类型')
                    return
                }
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
                            articleStatus:mode,
                            articleId:self.articleId,
                            articelImage:self.mainImage,
                            articleBrief:filterContent,
                        }
                        saveArticle(article).then(function(data){
                            if(data.code == 0){
                               
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
          
        },

        computed:{
            editStatus(){
                return this.isEdit?'发布文章':'预览文章'
            }
        },
        components:{
            blogFoot
        }
    }
</script>

<style scoped>
.writeClassPage{
    background: white;
    padding: 20px;
    margin-top: 50px;
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

.handleArticleClass{
    margin-top: 20px;
    margin-bottom: 30px;
}
.editor-btn{
    float: right;
    margin-left: 20px;
}
</style>