<template>
    <div class="table">
         <div class="featureTitle">
          管理留言
        </div>

        <el-table :data="tableData" border style="width: 100%">
            <el-table-column  label="标题" >
                <template scope="scope">
                    <a class="articleTitleClass" @click="gotoArticleDetail(scope.row)" >{{scope.row.article_name}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="article_create_time" label="日期" sortable width="160" :formatter="formatter">
            </el-table-column>
            <el-table-column prop="comment_count"  width="100" label="评论个数" >
            </el-table-column>
            <el-table-column prop="newComment.comment_content"  label="最新评论">
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template scope="scope">
                    <el-button size="small" @click = "checkComment(scope.row)">查看</el-button>
                    
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
             <el-pagination
                @current-change="handleCurrentChange"
                :current-page="pageIndex"
                :page-size="10"
                layout="total, prev, pager, next"
                :total="count">
                </el-pagination>
        </div>

     

    </div>
</template>

<script>
import {articlesNewComment} from '../../store/manageService'
    export default {
        data() {
            return {
                tableData: [],
                count:0,
                selectedData:[],
                pageIndex:1
            }
        },
         async mounted(){
            this.loadData()
         
        },
        methods: {
            async loadData(index,size){
                let self = this
                let resArticle = await  articlesNewComment(index,size)
                if(resArticle.code == 0){
                    this.tableData = resArticle.data
                    self.count = resArticle.count
                }
                else{
                    toast(self,resArticle.cMsg)
                }
            },
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
            checkComment(article){
                setStore('currentCommentArticleTitle',article.article_name)
                this.$router.push('/manage/manageCommentInfo/' + article.article_id);
            },
             async handleCurrentChange(val){
                this.pageIndex = val
                this.loadData(this.pageIndex - 1,10)   
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
.table td, .table th{
    padding: 0rem;
}
.table thead th{
    vertical-align: middle;
    text-align: center;
}
.el-table--border td, .el-table--border th{
    border-right:0px;
}
.cell{
    text-align: center;
}
</style>