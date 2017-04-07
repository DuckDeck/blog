<template>
    <div class="table">
         <div class="featureTitle">
          管理用户
        </div>
        
        <el-table :data="tableData" border style="width: 100%"  @selection-change="handleSelectionChange">
            <el-table-column width="100"   type="selection" >
                <template scope="scope">
                   <el-checkbox v-model="scope.row.isSelect" ></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column  label="用户名" >
                <template scope="scope">
                    <a class="articleTitleClass" @click="gotoArticleDetail(scope.row)" >{{scope.row.user_name}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="user_register_time" label="注册日期" sortable width="160" :formatter="formatter">
            </el-table-column>
            <el-table-column prop="user_isValidate" label="是否验证"  width="140">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click = "editUserInfo(scope.row)">管理</el-button>
                    
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    layout="prev, pager, next"
                    :total="tableData.length">
            </el-pagination>
        </div>

    </div>
</template>

<script>
import {allUser} from '../../store/manageService'
    export default {
        data() {
            return {
                tableData: [],
                dialogVisible:false,
                deleteMessage:'',
            }
        },
        mounted(){
            this.loadData()
        },
        methods:{
            async loadData(index = 0,size = 10){
                let res = await allUser(index,size)
                if(res.code == 0){
                    this.tableData = res.data
                }
                else{
                    toast(this,res.cMsg)
                }
            },
            editUserInfo(userInfo){
                this.$router.push('/manage/manageUserInfo/' + userInfo.user_id)
            },
            handleSelectionChange(val){

            },
            formatter(row, column) {
                if(column.label == "注册日期"){
                    return formatTime(new Date(row.user_register_time))
                }
               
            },
        }
      
    }
</script>
<style >
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