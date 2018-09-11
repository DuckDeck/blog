<template>
    <div class="table">
         <div class="featureTitle">
          查看用户关注的作者
        </div>
        <el-table :data="tableData" border style="width: 100%"  >
            <el-table-column  label="用户名" >
                <template scope="scope">
                    <a class="articleTitleClass"  >{{scope.row.user_real_name}}</a>
                </template>
            </el-table-column>
             <el-table-column  label="作者"  width="120">
                 <template scope="scope">
                  <img class="attentionUserHead" :src="scope.row.user_image_url" alt="">
                </template>
            </el-table-column>
            <el-table-column prop="attention_time" label="日期" sortable width="160" :formatter="formatter">
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
import {managerGetUserAttentionById} from  '../../store/manageService'
    export default {
        data() {
            return {
                userId:0,
                tableData: [],
                dialogVisible:false,
                count:0,
                index:0
            }
        },
        mounted(){
            this.userId = this.$route.params.userId
            this.loadData() 
        },
        methods: {
            async loadData(){
                let res = await  managerGetUserAttentionById(this.userId,this.index,10)
                if(res.code == 0){
                    this.tableData = res.data
                    this.count = res.count
                }
                else{
                    toast(this,res.cMsg)
                }
            },
            async handleCurrentChange(val){
                this.index = val
                this.loadData()
            },
            
            formatter(row, column) {
                if(column.label == "日期"){
                    return formatTime(new Date(row.attention_time))
                }
            },
        }
    }
</script>
<style>
.attentionUserHead{
    width: 50px;
    height: 50px;
}
</style>