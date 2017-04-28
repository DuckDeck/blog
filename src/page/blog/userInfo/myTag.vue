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
                        <el-tag :key="sort" v-for="sort in sorts" type='primary'  :closable="sort.sort_article_id > 0" 
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

                <div class="tagClass">
                    <div class="tagTitleClass">
                        标签管理
                    </div>
                    <div class="tagssClass">
                        <el-tag :key="tag" v-for="tag in tags" type='primary' :closable="tag.tag_id > 0" :close-transition="false" @close="handleTagClose(tag)">
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

            <div>
                <articleCell :articleInfo = "article" v-for="article in articles "></articleCell>
            </div>

        </div>
         
         
        <upToTop></upToTop>
        <blogFoot></blogFoot>
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
                sorts:[],
                selectedTag:{},
                selectedSort:{},
                inputVisibleSort:false,
                inputValueSort:'',
                inputVisibleTag: false,
                inputValueTag: '',
                userId:0,
                articles:[]
            }
        },
       async mounted(){
            this.userId = this.$route.params.userId
            let resTag = await getTags(this.userId)
            if(resTag.code == 0){
                let tmp =  resTag.data
                tmp.unshift({
                    tag_id: 0,
                    user_id: this.userId,
                    tag_name: "全部标签"
                })
                tmp.unshift({
                    tag_id: -1,
                    user_id: this.userId,
                    tag_name: "无标签"
                })
                this.tags = tmp
            }
            else{
                toast(this,resTag.cMsg)
            }
            let resSort = await getSorts(this.userId)
            if(resSort.code == 0){
                let tmp = resSort.data
                tmp.unshift({
                    sort_article_id: 0,
                    user_id: this.userId,
                    sort_article_name: "全部分类"
                })
                tmp.unshift({
                    sort_article_id: -1,
                    user_id: this.userId,
                    sort_article_name: "无分类"
                })
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
            let resArticle = await this.articlesBySortTag(0,0,0,10)
            if(resArticle.code == 0){
                this.articles = resArticle.data
            }
        },
        methods:{
            async articlesBySortTag(sort,tag,index,page){
                return await articlesBySort(this.userId,sort,tag,index,page)
            },
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