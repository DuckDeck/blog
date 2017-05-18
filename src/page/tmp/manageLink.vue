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
                    <a class="articleTitleClass" @click="gotoLink(scope.row)" >{{scope.row.link_url}}</a>
                </template>
            </el-table-column>
            <el-table-column prop="link_logo" label="链接LOGO" sortable width="150">
            </el-table-column>
            <el-table-column prop="show_order"  label="链接排序,默认为0" >
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button size="small" @click = "editFriendLink(scope.row)"
                            >编辑</el-button>
                    <el-button size="small" type="danger" @click = "deleteFriendLink(scope.row)"
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
                    <el-form-item prop='link_name' >
                         <el-input  placeholder="请输入链接名称" v-model="editLink.link_name" ></el-input>
                    </el-form-item>
                     <el-form-item prop="link_url" >
                         <el-input placeholder="请输入链接地址" v-model="editLink.link_url" ></el-input>
                    </el-form-item>
                     <el-form-item prop='link_logo' >
                          <el-input placeholder="请输入链接LOGO，没有不填" v-model="editLink.link_logo" ></el-input>
                    </el-form-item>
                    <el-form-item prop='show_order' >
                          <el-input placeholder="链接排序" v-model="editLink.show_order" ></el-input>
                    </el-form-item>
                    <el-form-item  >
                         <el-button class="saveInfoButton" type="primary" @click="saveLink()">保存链接</el-button>
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
import {getUserLinks,updateFriendLinks,deleteLink} from '../../store/service'
    export default {
        data() {
            var validateUrl = (rule, value, callback) => {
                if (value == '') {
               
                   callback(new Error('请输入链接URL'));
                   return
                } 
                else {
                    if (!/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(value)) {
                        callback(new Error('必须为正确的URL'));
                   }
                   callback()
              }
            };
            return {
                tableData: [],
                dialogVisible:false,
                deleteMessage:'',
                deleteLink:{},
                editLink:{
                    link_name:'',
                    link_url:'',
                    link_logo:'',
                    show_order:0,
                    link_id:0
                },
                rules:{
                    link_name: [
                        { required: true, message: '请输入链接名称', trigger: 'blur' }
                    ],
                    link_url: [ 
                        { validator: validateUrl, trigger: 'blur' }
                    ]
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
                    toast(self,res.cMsg)
                }
            }).catch(err=>{
                toast(self,err.cMsg)
            })
        },
        methods: {
            editFriendLink(link){
                this.editLink = clone(link)
            },
            deleteFriendLink(link){
                this.deleteMessage = "你确定要删除链接 " + link.link_name +" 吗？"
                this.deleteLink = link
                this.dialogVisible = true
            },
            async deleteLinkConfirm(){
                this.dialogVisible = false
                if(!this.deleteLink){
                    return
                }
                let result = await deleteLink(this.deleteLink.link_id)
                toast(this,result.cMsg)
                if(result.code == 0){
                    let index = this.tableData.indexOf(this.deleteLink)
                    if(index >=0){
                        this.tableData.splice(index,1)
                    }
                }
            },
             saveLink(){
                const self = this;
                self.$refs['editLink'].validate((valid) => {
                    if (valid) {
                       let sort = parseInt(self.editLink.show_order)
                       if(isNaN(sort)){
                           sort = 0
                       }
                       self.editLink.show_order = sort
                       updateFriendLinks(self.editLink).then(res=>{
                           toast(self,res.cMsg)
                            if(res.code == 0){
                                let newLink = clone(self.editLink)
                                if(newLink.link_id == 0){
                                    newLink.link_id = res.data.id
                                    self.tableData.push(newLink)
                                }
                                else{
                                    let existLink = self.tableData.findIndex(s=>{
                                        s.link_id == newLink.id
                                    })
                                    self.tableData.splice(existLink,1,newLink)
                                }
                            
                                self.editLink = {
                                        link_name:'',
                                        link_url:'',
                                        link_logo:'',
                                        show_order:0,
                                        link_id:0
                                }
                            }
                       }).catch(err=>{
                           toast(self,err.cMsg)
                       })
                   
                       
                            
                    
                      
                    }
                });
            
            },
            gotoLink(link){
                window.location.href = link.link_url
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