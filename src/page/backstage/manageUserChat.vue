<template>
    <div class="table">
         <div class="featureTitle">
          聊天列表
        </div>

       
         <div class="chatContent">
            <div  v-loading = 'loading' ></div>
            <div v-for="msg in messages" v-bind:key="msg.time">
                <div style="padding:5px;text-align:center;font-size:12px;color:#bbbbbb" v-show="msg.showTime">{{formatDate(msg.time)}}</div>
                 <div  v-show="msg.sender_id == userInfo.user_id" style="display:flex;padding:10px">
                     <img class="head_img" :src="userInfo.user_image_url" alt="">
                    <div style="align-self:center;margin-left:10px">
                        <div style="font-size:12px">{{userInfo.user_real_name}}</div>
                        <div class="chat_text" style="margin-right:50px">{{msg.chat_content}}</div>
                    </div>
                </div>
                <div  v-show="msg.sender_id == myUserInfo.user_id" style="display:flex;padding:10px;flex-direction:row-reverse">
                     <img class="head_img" :src="myUserInfo.user_image_url" alt="">
                    <div style="align-self:center;margin-right:10px">
                        <div style="font-size:12px;text-align:right">{{myUserInfo.user_real_name}}</div>
                        <div class="chat_text" style="margin-left:50px">{{msg.chat_content}}</div>
                    </div>
                </div>
            </div>
        </div>


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
import {managerChatLogById} from '../../store/manageService'
    export default {
        data() {
            return {
                chat_id:'',
                messages: [],
                count:0,
                pageIndex:1,
                loading:false
            }
        },
         async mounted(){
            this.chat_id = this.$route.params.chat_id
            this.loadData()
         
        },
        methods: {
            async loadData(index,size){
                this.loading = true
                let res = await  managerChatLogById(this.chat_id, index,size)
                this.loading = false
                if(res.code == 0){
                    this.messages = res.data
                    this.count = res.count
                }
                else{
                    toast(self,res.cMsg)
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

</style>