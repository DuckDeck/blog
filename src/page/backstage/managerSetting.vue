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
            <el-table-column  label="管理员用户名" >
                <template scope="scope">
                    <a class="articleTitleClass" @click="gotoArticleDetail(scope.row)" >{{scope.row.m_username}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="m_last_login_time" label="上一次登录日期" sortable width="200" :formatter="formatter">
            </el-table-column>
            <el-table-column prop="m_login_times" label="登录次数"  width="140">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click = "editManageInfo(scope.row)" v-show = "canManage(scope.row)" >管理</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {managerList} from '../../store/manageService'
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
            async loadData(){
               let res = await managerList()
                if(res.code == 0){
                    this.tableData = res.data
                }
                else{
                    toast(this,res.cMsg)
                }
            },
            canManage(manage){
                return manage.m_id == manageId
            },            
            formatter(row, column) {
                if(column.label == "上一次登录日期"){
                    return formatTime(new Date(row.m_last_login_time))
                }
            },
            handleSelectionChange(val){

            },
            editManageInfo(manageInfo){
                this.$router.push('/manage/managerSettingInfo/' + manageInfo.m_id)
            }
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