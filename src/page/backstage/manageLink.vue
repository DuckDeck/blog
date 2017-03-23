<template>
    <div class="table">
         <div class="featureTitle">
          管理链接
        </div>
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="link_name" label="链接名称" sortable width="160" >
            </el-table-column>
            <el-table-column  label="链接地址" >
                <template scope="scope">
                    <a class="articleTitleClass" @click="gotoArticleDetail(scope.row)" >{{scope.row.link_url}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="link_logo" label="链接LOGO" sortable width="150">
            </el-table-column>
            <el-table-column prop="show_order"  label="链接排序" >
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click = "editLink(scope.row)"
                            >编辑</el-button>
                    <el-button size="small" type="danger" @click = "deleteLink(scope.row)"
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
        <div style="clear: both">
            
        </div>
        <div class="addLinkDivClass">
             <div class="addLinkTitleClass">
                    基本信息 
                </div>
                <div >
                  <el-form :model="editLink" :rules="rules" ref="editLink" label-width="0px"  class="linkEditFormClass" >
                    <el-form-item prop='blog_name' >
                         <el-input  placeholder="请输入链接名称" ></el-input>
                    </el-form-item>
                     <el-form-item prop="blog_description" >
                         <el-input placeholder="请输入链接地址" ></el-input>
                    </el-form-item>
                     <el-form-item prop='blog_keyword' >
                          <el-input placeholder="请输入链接LOGO，没有不填" ></el-input>
                    </el-form-item>
                    <el-form-item prop='blog_keyword' >
                          <el-input  ></el-input>
                    </el-form-item>
                    <el-form-item prop='blog_keyword' >
                         <el-button class="saveInfoButton" type="primary" @click="saveSystemInfo()">保存链接</el-button>
                    </el-form-item>
                  </el-form>
                </div>
        </div>


        <el-dialog title="提示" v-model="dialogVisible" size="tiny">
            <span>{{deleteMessage}}</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteLinkConfirm">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import {getUserLinks} from '../../store/service'
    export default {
        data() {
            return {
                tableData: [],
                dialogVisible:false,
                deleteMessage:'',
                deleteLink:{},
                editLink:{},
                rules:{

                }
            }
        },
        mounted(){
            let self = this
            getUserLinks().then((res)=>{
                if(res.code == 0){
                    self.tableData = res.data.filter(s=>{
                        return s.link_type == 0
                    })
                }
                else{
                    toast(self,res.ChineseMsg)
                }
            }).catch(err=>{
                toast(self,err.ChineseMsg)
            })
        },
        methods: {
           

           
            editLink(link){
                
            },
            deleteLink(link){
                this.deleteMessage = "你确定要删除链接 " + link.link_name +" 吗？"
                this.deleteLink = article
                this.dialogVisible = true
            },
            async deleteLinkConfirm(){
                this.dialogVisible = false
                if(!this.deleteLink){
                    return
                }
                // let result = await deleteAticle(this.deleteArticle)
                // toast(this,result.ChineseMsg)
                // if(result.code == 0){
                //     let index = this.tableData.indexOf(this.deleteArticle)
                //     if(index >=0){
                //         this.tableData.splice(index,1)
                //     }
                // }
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
.addLinkTitleClass{
    color: white;
    background: lightseagreen;
    height: 60px;
    padding: 5px 10px;
    line-height: 50px;
    font-size: 20px;
}
.linkEditFormClass{
    display: flex;
    margin-top: 20px;

}
.linkEditFormClass div{
    margin-right: 5px;
}
</style>