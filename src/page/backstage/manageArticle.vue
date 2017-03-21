<template>
    <div class="table">
         <div class="featureTitle">
          管理文章
        </div>

        <el-table :data="tableData" border style="width: 100%">
            <el-table-column  label="标题" width="120">
                <template scope="scope">
                    <a class="articleTitleClass" @click="gotoArticleDetail(scope.row)" >{{scope.row.article_name}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="article_create_time" label="日期" sortable width="150" :formatter="formatter">
            </el-table-column>
            <el-table-column prop="article_click" label="浏览量" sortable width="100">
            </el-table-column>
            <el-table-column prop="article_sort_name" label="所属类型" >
            </el-table-column>
            <el-table-column prop="article_status" label="发布状态" :formatter="formatter" >
            </el-table-column>
            <el-table-column  label="标签" >
                 <template scope="scope">
                      <el-tag class="tagSpanClass" v-for="tag in scope.row.tag"  type="primary"  >
                    {{tag.tag_name}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click = "editArtilcle(scope.row)"
                            >编辑</el-button>
                    <el-button size="small" type="danger" @click = "deleteArtilcle(scope.row)"
                            >删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    layout="prev, pager, next"
                    :total="tableData.length">
            </el-pagination>
        </div>

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
import {articleList,deleteAticle} from '../../store/service'
    export default {
        data() {
            return {
                tableData: [],
                dialogVisible:false,
                deleteMessage:'',
                deleteArticle:{}
            }
        },
        mounted(){
            let self = this
            articleList().then((res)=>{
                if(res.code == 0){
                    self.tableData = res.data
                }
                else{
                    self.$vux.toast.show({
                        text: err.ChineseMsg,
                        position:"bottom",
                        type:'text'
                    })
                }
            })
        },
        methods: {
           formatter(row, column) {
                if(column.label == "日期"){
                    return formatTime(new Date(row.article_create_time))
                }
                if(column.label == "发布状态"){
                    return row.article_status == 0 ? "未发布" : "已发布"
                }
            },

            gotoArticleDetail(article){
                setStore('article' + article.article_id ,article)
                this.$router.push('/manage/article/' + article.article_id);
            },
            editArtilcle(article){
                setStore('article' + article.article_id ,article)
                this.$router.replace('/manage/editArticle/' + article.article_id);
            },
            deleteArtilcle(article){
                this.deleteMessage = "你确定要删除文章 " + article.article_name +" 吗？"
                this.deleteArticle = article
                this.dialogVisible = true
            },
            async deleteArticleConfirm(){
                this.dialogVisible = false
                if(!this.deleteArticle){
                    return
                }
                let result = await deleteAticle(this.deleteArticle)
                toast(this,result.ChineseMsg)
                if(result.code == 0){
                    let index = this.tableData.indexOf(this.deleteArticle)
                    if(index >=0){
                        this.tableData.splice(index,1)
                    }
                }
            }
        }
    }
</script>
<style>
.articleTitleClass{
    cursor: pointer;
    color:#20a0ff
}
.tagSpanClass{
    margin: 0px 5px;
    display: inline-block
}
.el-dialog__headerbtn{
display:  none;
}
</style>