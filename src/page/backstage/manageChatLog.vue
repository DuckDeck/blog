<template>
    <div class="table">
         <div class="featureTitle">
          聊天列表
        </div>

        <el-table v-loading="loading"  :data="tableData" border style="width: 100%">
            <el-table-column prop="info1.user_real_name" label="用户1" >
            </el-table-column>
            <el-table-column prop="info2.user_real_name"  width="100" label="用户2" >
                </el-table-column>
            <el-table-column prop="chat_type" :formatter="formatter" label="类型">
            </el-table-column>
            <el-table-column prop="time" :formatter="formatter" label="时间">
            </el-table-column>
             <el-table-column prop="chat_content"  label="最新信息">
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button size="small" @click = "checkChat(scope.row)">查看</el-button>
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
import {managerChatList} from '../../store/manageService'
    export default {
        data() {
            return {
                tableData: [],
                count:0,
                pageIndex:1,
                loading:false
            }
        },
         async mounted(){
            this.loadData()
         
        },
        methods: {
            async loadData(index,size){
                this.loading = true
                let res = await  managerChatList(index,size)
                this.loading = false
                if(res.code == 0){
                    this.tableData = res.data
                    this.count = res.count
                }
                else{
                    toast(self,res.cMsg)
                }
            },
           formatter(row, column) {
                if(column.label == "时间"){
                    return formatTime(new Date(row.time))
                }
                else if(column.label == '类型'){
                    if(row.chat_type == 1){
                        return '文本'
                    }
                }
            },
            checkChat(item){

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