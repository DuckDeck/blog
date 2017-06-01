<template>
    <div class="table">
         <div class="featureTitle">
          管理文章
        </div>
        <div class="itchManageArticle">
            <el-button type="primary" @click="releaseArticle(1)">发布文章</el-button>
            <el-button type="primary" @click="releaseArticle(0)">不发布文章</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%"  @selection-change="handleSelectionChange">
            <el-table-column width="80"   type="selection" >
            </el-table-column>
            <el-table-column  label="标题" >
                <template scope="scope">
                    <a class="articleTitleClass" @click="gotoArticleDetail(scope.row)" >{{scope.row.article_name}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="article_create_time" label="日期" sortable width="160" :formatter="formatter">
            </el-table-column>
            <el-table-column prop="user_name" label="作者"  width="120">
            </el-table-column>
            <el-table-column prop="article_sort_name"  width="100" label="所属类型" >
            </el-table-column>
            <el-table-column prop="article_status" width="100" label="发布状态" :formatter="formatter" >
            </el-table-column>
            <el-table-column  label="标签" >
                 <template scope="scope">
                      <el-tag class="tagSpanClass" v-for="tag in scope.row.tags"  type="primary"  >
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
                @current-change="handleCurrentChange"
                :current-page="pageIndex"
                :page-size="10"
                layout="total, prev, pager, next"
                :total="count">
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
import {articleList} from '../../store/service'
import {allArticle,releaseArticle,deleteAticleByManage} from  '../../store/manageService'
    export default {
        data() {
            return {
                tableData: [],
                dialogVisible:false,
                deleteMessage:'',
                deleteArticle:{},
                count:0,
                selectedData:[],
                pageIndex:1
            }
        },
        mounted(){
            this.loadData() 
        },
        methods: {
           async loadData(index = 0,size = 10){
                let self = this
                let res = await  allArticle(index,size)
                if(res.code == 0){
                    self.tableData = res.data.map(s=>{
                        s.isSelect = false
                        return s
                    })
                    self.count = res.count
                    this.selectedData = []
                }
                else{
                    toast(this,res.cMsg)
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
            editArtilcle(article){
                setStore('article' + article.article_id ,article)
                this.$router.push('/manage/editArticle/' + article.article_id);
            },
            deleteArtilcle(article){
                this.deleteMessage = "你确定要删除文章 " + article.article_name +" 吗？"
                this.deleteArticle = article
                this.dialogVisible = true
            },
            handleSelectionChange(val){
               this.selectedData = val
            },
            async deleteArticleConfirm(){
                this.dialogVisible = false
                if(!this.deleteArticle){
                    return
                }
                let result = await deleteAticleByManage(this.deleteArticle)
                toast(this,result.cMsg)
                if(result.code == 0){
                    let index = this.tableData.indexOf(this.deleteArticle)
                    if(index >=0){
                        this.tableData.splice(index,1)
                    }
                }
            },
            async releaseArticle(status){
                let ids = this.selectedData.map(d=>{
                    return d.article_id
                })
                if(ids.length <= 0){
                    return
                }
                let res = await releaseArticle(status,ids)
                if(res.code == 0){
                    this.loadData(this.pageIndex - 1,10)
                }
                else{
                    toast(this,res.cMsg)
                }
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
.el-checkbox{
    margin-bottom: 0px;
}
</style>