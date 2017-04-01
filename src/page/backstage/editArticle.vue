<template>
    <div style="height: 100%">
      <div class="featureTitle">
          发布文章
      </div>
      <div style="font-size: 20px;height: 90%">
          <el-form :model="article" :rules="rules" ref="article" label-width="0px" style="height: 60%"  >
                <el-form-item prop="title">
                    <el-input v-model="article.title" placeholder="文章标题"></el-input>
                    <!--<el-button class="editor-btn" type="primary" @click="save('article',1)"></el-button>-->
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
import {addTag,getTags,getSorts,saveArticle,tempArticle,saveTempArticle} from '../../store/service'
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
                    // something config
                    placeholder:'从这里开始写你的文章'
                },
                mainImage:'',
                articleId:0,
                isEdit:true
            }
        },
        mounted(){
            this.articleId = this.$route.params.id
            let self = this
            getTags().then(function(result){
                if(result.code == 0){
                    self.tags = result.data
                }
            })
            getSorts().then(function(result){
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
            else{
                tempArticle().then(res=>{
                    if(res.code == 0){
                        let articleDetail = res.data
                        self.article.title = articleDetail.article_name
                        setStore('tempArticleId',articleDetail.article_id)
                        self.selectedSortId = articleDetail.article_sort__id
                        self.content = articleDetail.article_content
                    }
               })
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
                console.log(this.selectedTags)
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
                    toast(this,result.ChineseMsg)
                }
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
                               removeStore('tempArticleId')
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
            },
            autoSave(){
                //自动保存至少要标题
                let self = this
                if(self.article.title.length <= 0){
                    return
                }
                let articleId = getStore('tempArticleId')
                if(articleId){
                    
                }
                else{
                    let filterContent  = self.content.replace(/<(?:.|\s)*?>/g,'').replace(/\s/g,'').substr(0,200)
                    let article = {
                        articalTitle:self.article.title,
                        articalSort:self.selectedSortId,
                        articalTags:self.selectedTags.map((s=>{
                                        return s.tag_id
                                    }))|| [],
                        articalContent:self.content,
                        articleStatus:5, //5 表示自动 保存的，只一时间只能存在一个
                        articleId:self.articleId,
                        articelImage:self.mainImage,
                        articleBrief:filterContent,
                    }

                    saveTempArticle(article)
                }
            }
        },
        beforeDestroy(){
           this.autoSave()
        },
        computed:{
            editStatus(){
                return this.isEdit?'发布文章':'预览文章'
            }
        },
        components:{
            
        }
    }
</script>

<style scoped>


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
}
.editor-btn{
    float: right;
    margin-left: 20px;
}
</style>