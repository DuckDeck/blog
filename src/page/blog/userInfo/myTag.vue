<template>
    <div class="container">
         <div>
            <userHead :userInfo = "userInfo"></userHead>
         </div>
         <div class="featureTitle">
          类别/标签管理
        </div>
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
        <upToTop></upToTop>
        <blogFoot></blogFoot>
    </div>
</template>

<script>
import {addTag,getTags,getSorts,addSort,deleteSort,deleteTag,getUserInfo} from '../../../store/service'
import userHead from './../com/userHeadInfo.vue'
import upToTop from './../com/upToTop.vue'
import blogFoot from './../com/blogFoot.vue'
    export default {
        data: function(){
            return {
                userInfo:{},
                tags:[],
                sorts:[],
                inputVisibleSort:false,
                inputValueSort:'',
                inputVisibleTag: false,
                inputValueTag: '',
                userId:0,
            }
        },
       async mounted(){
            this.userId = this.$route.params.userId
            let resTag = await getTags(this.userId)
            if(resTag.code == 0){
                this.tags = resTag.data
                
            }
            else{
                toast(this,resTag.cMsg)
            }
            let resSort = await getSorts(this.userId)
            if(resSort.code == 0){
                this.sorts = resSort.data
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
          userHead, upToTop,blogFoot
        }
    }
</script>

<style scoped>

</style>