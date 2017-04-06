<template>
    <div>
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

    </div>
</template>

<script>
import {addTag,getTags,getSorts,addSort,deleteSort,deleteTag} from '../../store/service'
    export default {
        data: function(){
            return {
                tags:[],
                sorts:[],
                inputVisibleSort:false,
                inputValueSort:'',
                inputVisibleTag: false,
                inputValueTag: ''
            }
        },
        mounted(){
            let self = this
            getTags().then(function(result){
                if(result.code == 0){
                    self.tags = result.data
                   
                }
            })
            getSorts().then(function(result){
                if(result.code == 0){
                    self.sorts = result.data
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
</style>