<template>
    <div class="table">
         <div class="featureTitle">
          管理用户
        </div>
        
        <el-table v-loading="loading" :data="tableData" border style="width: 100%"  @selection-change="handleSelectionChange">
            <el-table-column width="100"   type="selection" >
                <template slot-scope="scope">
                   <el-checkbox v-model="scope.row.isSelect" ></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column  label="用户名" >
                <template slot-scope="scope">
                    <a class="articleTitleClass" @click="gotoArticleDetail(scope.row)" >{{scope.row.user_name}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="user_register_time" label="注册日期" sortable width="160" :formatter="formatter">
            </el-table-column>
            <el-table-column prop="user_isValidate" label="是否验证"  width="140">
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click = "editUserInfo(scope.row)">管理</el-button>
                    <el-button size="small" @click = "deleteUserInfo(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination" v-show="!loading" >
            <el-pagination
                     @size-change="sizeChange" 
                     @current-change="currentChange"
                    :page-size="queryParam.page_size"
                    layout="prev, pager, next"
                    :total="count">
            </el-pagination>
        </div>
        <el-dialog  title="删除用户"  :visible.sync="showDeleteUser"  size="tiny"  >
		    

		 <div style="margin-top:5px;margin-left:50px">是否确定删除该用户  {{currentDeleteUser.user_name}} ？</div>

			<div slot="footer" class="dialog-footer">
			<el-button @click="showDeleteUser = false">取消</el-button>
			<el-button v-loading="deleteLoading" type="primary" @click="deleteUserSubmit">确认</el-button>
			</div>
		</el-dialog>
    </div>
</template>

<script>
import {allUser,deleteUser} from '../../store/manageService'
    export default {
        data() {
            return {
                tableData: [],
                dialogVisible:false,
                deleteMessage:'',
                loading:false,
                count:0,
                queryParam: {
                    page_num: 0,
                    page_size: 10,
                },
                showDeleteUser:false,
                currentDeleteUser:{},
                deleteLoading:false,
            }
        },
        mounted(){
            this.loadData(this.queryParam)
        },
        methods:{
            async loadData(para){
                this.loading = true
                let res = await allUser(para.page_num,para.page_size)
                 this.loading = false
                if(res.code == 0){
                    this.tableData = res.data
                    this.count = res.count
                }
                else{
                    toast(this,res.cMsg)
                }
            },
            editUserInfo(userInfo){
                this.$router.push('/manage/manageUserInfo/' + userInfo.user_id)
            },
            deleteUserInfo(userInfo){
                this.currentDeleteUser =  userInfo
                this.showDeleteUser = true
            },
            async deleteUserSubmit(){
                this.showDeleteUser = false
                this.deleteLoading = true
                let res = await deleteUser(this.currentDeleteUser.user_id)
                this.deleteLoading = false
                if(res.code == 0){
                    toast(this,"该用户已成功删除")
                }
                else{
                    toast(this,res.cMsg)
                }
            },
            handleSelectionChange(val){

            },
            sizeChange(val) {
                this.queryParam.page_size = val
                this.loadData(this.queryParam)
            },
            currentChange(val){
                this.queryParam.page_num = val - 1 
                this.loadData(this.queryParam)
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