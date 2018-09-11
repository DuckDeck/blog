<template>
    <div class="table">
         <div class="featureTitle">
          查看用户相关信息
        </div>
        <div style="padding:20px">
            <el-button :type="selectedType == 0 ? 'primary':'default'" plain @click="selectType(0)">喜欢的文章</el-button>
            <el-button :type="selectedType == 1 ? 'primary':'default'" plain @click="selectType(1)">收藏的文章</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%"  >
            <el-table-column  label="标题" >
                <template scope="scope">
                    <a class="articleTitleClass" @click="gotoArticleDetail(scope.row)" >{{scope.row.article_name}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="article_create_time" label="日期" sortable width="160" :formatter="formatter">
            </el-table-column>
            <el-table-column prop="user_real_name" label="作者"  width="120">
            </el-table-column>
            <el-table-column prop="article_sort_name"  width="100" label="所属类型" >
            </el-table-column>
         
        </el-table>
        <div class="pagination">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page="index"
                :page-size="10"
                layout="total, prev, pager, next"
                :total="count">
                </el-pagination>
        </div>

       

    </div>
</template>

<script>
import {managerGetUserLikeArticlesById,managerGetUserCollectArticlesById} from  '../../store/manageService'
    export default {
        data() {
            return {
                userId:0,
                selectedType:0,
                tableData: [],
                dialogVisible:false,
                count:0,
                index:0
            }
        },
        mounted(){
            this.userId = this.$route.params.userId
            this.selectedType = this.$route.params.tab
            this.loadData() 
        },
        methods: {
            async loadData(){
                if (this.selectedType == 0){
                    let res = await  managerGetUserLikeArticlesById(this.userId,this.index,10)
                    if(res.code == 0){
                        this.tableData = res.data
                        this.count = res.count
                    }
                    else{
                        toast(this,res.cMsg)
                    }
                }
                else{
                    let res = await  managerGetUserCollectArticlesById(this.userId,this.index,10)
                    if(res.code == 0){
                        this.tableData = res.data
                        this.count = res.count
                    }
                    else{
                        toast(this,res.cMsg)
                    }
                }
            },
            async handleCurrentChange(val){
                this.index = val
                this.loadData()
            },
            selectType(type){
                if(type != this.selectedType){
                    this.selectedType = type
                    this.count = 0
                    this.tableData = []
                    this.loadData()
                }                
            },
            gotoArticleDetail(article){
                setStore('article' + article.article_id ,article)
                this.$router.push('/manage/article/' + article.article_id);
            },
            formatter(row, column) {
                if(column.label == "日期"){
                    return formatTime(new Date(row.article_create_time))
                }
            },
        }
    }
</script>
<style>

</style>