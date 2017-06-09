<template>
    <div class="container">
        <div class="tagSortContent">
            <div class="tagSortUserHead">
                 <userHead :userInfo = "userInfo"></userHead>
            </div>
            <div class="featureTitle">
            类别/标签管理
            </div>
            <div class="tagSortClass"> 
                <div class="sortClass" >
                    <div class="sortTitleClass">
                        分类管理
                    </div>
                    <div class="sortsClass">
                        <el-tag :key="sort" v-for="sort in sorts" type='primary' :class="{tagSelected:sort.sort_article_id == selectedSort.sort_article_id}"
                          :closable="sort.sort_article_id > 0"   :close-transition="false"  @close="handleSortClose(sort)">
                        <span class="clickSpan"  @click="clickSort(sort)">{{sort.sort_article_name}}</span>
                        </el-tag>
                        <el-input style="width: 80px;" v-if="inputVisibleSort" v-model="inputValueSort" ref="saveSortInput" size="mini" 
                        @keyup.enter.native="handleSortInputConfirm"@blur="handleSortInputConfirm"
                        >
                        </el-input>
                        <el-button style="height: 28px;" v-else class="button-new-tag" size="small" @click="showSortInput">+ 新分类</el-button>
                    </div>
                </div>

                <div class="tagClass">
                    <div class="tagTitleClass">
                        标签管理
                    </div>
                    <div class="tagssClass">
                        <el-tag :key="tag" v-for="tag in tags" type='primary' :class="{tagSelected:tag.isSelected}"
                         :closable="tag.tag_id > 0" :close-transition="false" @close="handleTagClose(tag)">
                         <span  class="clickSpan" @click="clickTag(tag)"> {{tag.tag_name}}</span>
                       
                        </el-tag>
                        <el-input style="width: 80px;" v-if="inputVisibleTag" v-model="inputValueTag" ref="saveTagInput" size="mini" 
                        @keyup.enter.native="handleTagInputConfirm"@blur="handleTagInputConfirm"
                        >
                        </el-input>
                        <el-button v-else style="height: 28px;" class="button-new-tag" size="small" @click="showTagInput">+ 新标签</el-button>
                    </div>
                </div>
            </div>

            <div>
                <articleCell :articleInfo = "article" v-for="article in articles "></articleCell>
                 <div v-show="articles.length < articleCount" class="loadMoreDiv">
                    <el-button :loading="isLoadingArticles" @click="loadMoreArticle(false)" class="loadmoreButton">加载更多文章...</el-button>
                </div>
            </div>

        </div>
        <upToTop></upToTop>
        <blogFoot></blogFoot>
         <el-dialog title="提示" v-model="dialogVisible" size="tiny">
            <span>{{deleteMessage}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteArticleConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {addTag,getTags,getSorts,addSort,deleteSort,deleteTag,getUserInfo,articlesBySort} from '../../../store/service'
import userHead from './../com/userHeadInfo.vue'
import upToTop from './../com/upToTop.vue'
import blogFoot from './../com/blogFoot.vue'
import articleCell from './com/articleCell.vue'
    export default {
        data: function(){
            return {
                userInfo:{},
                tags:[],
                selectedTag:[],
                selectedSort:{},
                sorts:[],
                selectedTag:{},
                selectedSort:{},
                inputVisibleSort:false,
                inputValueSort:'',
                inputVisibleTag: false,
                inputValueTag: '',
                userId:0,
                articles:[],
                currentSort:"",
                currentTag:"",
                articleCount:0,
                isLoadingArticles:false,
                deleteMessage:'',
                dialogVisible:false,
                currentDeleteSort:{},
                currentDeleteTag:{},
                deleteType:0
            }
        },
       async mounted(){
            this.userId = this.$route.params.userId
            let resTag = await getTags(this.userId)
            if(resTag.code == 0){
                let tmp =  resTag.data.map(s=>{
                     s.isSelected = false
                     return s
                })
                this.selectedTag = [{
                    tag_id: -1,
                    user_id: this.userId,
                    tag_name: "全部标签",
                    isSelected : true
                }]
                tmp.unshift( this.selectedTag[0])
                tmp.unshift({
                    tag_id: 0,
                    user_id: this.userId,
                    tag_name: "无标签",
                    isSelected : false
                })
                this.currentTag = [-1]
                this.tags = tmp
            }
            else{
                toast(this,resTag.cMsg)
            }
            let resSort = await getSorts(this.userId)
            if(resSort.code == 0){
                let tmp = resSort.data.map(s=>{
                     s.isSelected = false
                     return s
                })
                this.selectedSort = {
                     sort_article_id: -1,
                    user_id: this.userId,
                    sort_article_name: "全部分类",
                    isSelected : true
                }
                tmp.unshift(this.selectedSort)       
                tmp.unshift({
                    sort_article_id: 0,
                    user_id: this.userId,
                    sort_article_name: "无分类",
                    isSelected : false
                })
                this.currentSort = -1
                
                this.sorts = tmp
            }
            else{
                toast(this,resSort.cMsg)
            }
            let resUserInfo = await getUserInfo(this.userId)
            if(resUserInfo.code == 0){
                this.userInfo = resUserInfo.data
            }
            else{
                toast(this,resUserInfo.cMsg)
            }
            await this.articlesBySortTag(-1,-1,0,10)
         
         },


       methods:{
           async articlesBySortTag(sort,tag,index,page){
                let resArticle =   await articlesBySort(this.userId,sort,tag,index,page)
                    if(resArticle.code == 0){
                        this.articleCount = resArticle.count
                        let self = this
                        if(index == 0){
                            this.articles = resArticle.data.map(s=>{
                                s.user_info = self.userInfo
                                return s
                            })
                        }
                        else{
                            this.articles = this.articles.concat(resArticle.data.map(s=>{
                                s.user_info = self.userInfo
                                return s
                            }))
                        }
                    }
            },
            handleSortClose(sort) {
                this.deleteMessage = "你确定要删除分类 " + sort.sort_article_name + " 吗?"
                this.deleteType = 0
                this.dialogVisible = true
                this.currentDeleteSort = sort
               
               
            },
            handleTagClose(tag) {
                this.deleteMessage = "你确定要删除标签 " + tag.tag_name + " 吗?"
                this.deleteType = 1
                this.dialogVisible = true
                this.currentDeleteTag = tag
                
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
            async handleSortInputConfirm() {
                let inputValue = this.inputValueSort;
                this.inputVisibleSort = false;
                this.inputValueSort = '';
                if(inputValue.length == 0){
                    return
                }

                let result = await addSort(inputValue)
                if(result.code == 0){
                     toast(this,'添加分类成功')   
                     let id = result.data.id
                     let sort = {sort_article_id:id,sort_article_name:inputValue}
                     this.sorts.push(sort)
                }
                else{
                    toast(this,result.cMsg)   
                }
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
                     toast(self,'添加标签成功')   
                     let id = result.data.id
                     let tag = {tag_id:id,tag_name:inputValue}
                     self.tags.push(tag)
                }).catch(err=>{
                    toast(self,err.cMsg)
                })
            },
            clickSort(sort){
                this.selectedSort.isSelected = false
                sort.isSelected = true
                this.selectedSort = sort 
                this.currentSort = sort.sort_article_id
                this.articlesBySortTag(this.currentSort,this.currentTag,0,10)
            },
            clickTag(tag){
                let selected = this.tags.filter(s=>{
                    return s.isSelected == true
                })
                if(selected.length  == 1){
                    if(tag.isSelected){
                        return
                    }
                }

                if( tag.tag_id == -1){
                    for(let t of this.tags){
                         t.isSelected = false   
                    }
                }
                else{
                    let t = this.tags.find(s=>{
                        return s.tag_id == -1
                    })
                    t.isSelected = false
                }
                tag.isSelected = !tag.isSelected
                selected = this.tags.filter(s=>{
                    return s.isSelected == true
                })
                let tags = selected.map(s=>{
                    return s.tag_id
                })
                this.currentTag = tags.join('_')
                this.articlesBySortTag(this.currentSort,this.currentTag,0,10)
            },
            loadMoreArticle(){
                this.isLoadingArticles = true
                this.articlesBySortTag(this.currentSort,this.currentTag,this.articles.length / 10,10)
                this.isLoadingArticles = false
            },
            deleteArticleConfirm(){
                this.dialogVisible = false
                if(this.deleteType == 0){
                     let self = this
                     deleteSort(this.currentDeleteSort).then(res=>{
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
                }
                else{
                    let self = this
                    deleteTag(this.currentDeleteTag).then(res=>{
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
                }
            }
        },
        components:{
          userHead, upToTop,blogFoot,articleCell
        }
       }
</script>

<style scoped>
.tagSortContent{
    background: white;
    font-size: 20px;
    padding: 20px;
    margin-top: 60px;
    border-top: 5px solid #c71585
}
.tagSortUserHead{
    padding: 10px;
    margin-bottom: 20px;
}
.featureTitle{
    font-size: 20px;
}
.tagSortClass{
    display: flex;
    font-size: 20px;
    justify-content: space-between;
    margin-top: 20px;
}
.sortClass{
    border: 1px solid #bbb;
    width: 48%;
    min-height: 180px;
}
.tagClass{
    border: 1px solid #bbb;
    width: 48%;
    min-height: 180px;
}
.sortTitleClass{
    color: white;
    background: palevioletred;
    height: 60px;
    padding: 5px 10px;
    line-height: 50px;
}
.tagTitleClass{
     color: white;
    background: lightseagreen;
    height: 60px;
    padding: 5px 10px;
    line-height: 50px;
}
.sortsClass{
    display: flex;
    padding: 15px;
    flex-wrap: wrap;
}
.sortsClass span{
    margin-right: 10px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    margin-bottom: 10px;
   
}

.clickSpan{
    margin-right: 0px !important;
}

.tagSelected{
    color: white;
    background: #20a0ff;
}

.tagssClass{
    display: flex;
    padding: 15px;
    flex-wrap: wrap;
}
.tagssClass span{
    margin-right: 10px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    margin-bottom: 10px;
}
</style>