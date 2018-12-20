<template>
    <div class="table">
         <div class="featureTitle">
          <el-button @click="back" >返回</el-button>
        </div>

       
         <div class="chatContent">
            <div  v-loading = 'loading' ></div>
            <div v-for="msg in messages" v-bind:key="msg.time">
                <div style="padding:5px;text-align:center;font-size:12px;color:#bbbbbb" v-show="msg.showTime">{{formatDate(msg.time)}}</div>
                 <div  v-show="msg.sender_id == user_id1" style="display:flex;padding:10px">
                     <img class="head_img" :src="info1.user_image_url" alt="">
                    <div style="align-self:center;margin-left:10px">
                        <div style="font-size:12px">{{info1.user_real_name}}</div>
                        <div class="chat_text" style="margin-right:50px">{{msg.chat_content}}</div>
                    </div>
                </div>
                <div  v-show="msg.sender_id == user_id2" style="display:flex;padding:10px;flex-direction:row-reverse">
                    <img class="head_img" :src="info2.user_image_url" alt="">
                    <div style="align-self:center;margin-right:10px">
                        <div style="font-size:12px;text-align:right">{{info2.user_real_name}}</div>
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
                user_id1:0,
                user_id2:0,
                info1:null,
                info2:null,
                loading:false
            }
        },
         async mounted(){
            this.chat_id = this.$route.params.chat_id
            this.user_id1 = parseInt(this.chat_id.split('_')[0])
            this.user_id2 = parseInt(this.chat_id.split('_')[1])
            this.loadData()
         
        },
        methods: {
            async loadData(index,size){
                this.loading = true
                let res = await  managerChatLogById(this.chat_id, index,size)
                this.loading = false
                if(res.code == 0){
                    this.info1 = res.data.info1
                    this.info2 = res.data.info2
                    let msg = res.data.content
                    this.calculateBatchShowTime(msg)
                    this.messages = msg
                    this.count = res.count
                }
                else{
                    toast(self,res.cMsg)
                }
            },
            formatDate(time){
                let date = parseInt(time)
                date = new Date(date)
                let now = new Date()
                let prev = new Date(now.getTime() - 1000 * 60 * 60 * 24)
                console.log(date)
                if(now.getFullYear() == date.getFullYear() && now.getMonth() == date.getMonth() && now.getDate() == date.getDate()){
                    return formatTime(time,'hh:mm')
                }
                else if(prev.getFullYear() == date.getFullYear() && prev.getMonth() == date.getMonth() && prev.getDate() == date.getDate()){
                    return 'Yesterday ' + formatTime(time,'hh:mm')
                }
                else if(prev.getFullYear() == date.getFullYear()){
                    return formatTime(time,'MM dd  hh:mm')
                }
                else{
                    return formatTime(time,'yyyy MM dd  hh:mm')
                }
             },
         
            calculateBatchShowTime(msgs){
                
                msgs[0].showTime = true
                
                let index = 0
                let upper = 0
                while(index < msgs.length){
                    if(upper == 0){
                            upper = msgs[index].time - 60000
                    }
                    else{
                        console.log(upper)
                        console.log(msgs[index])
                        if(msgs[index].time < upper){
                            msgs[index].showTime = true
                            upper = msgs[index].time - 60000
                        }
                    }
                    index++
                }
             },
            back(){
                this.$router.go(-1) 
            },
             async handleCurrentChange(val){
                this.pageIndex = val
                this.loadData(this.pageIndex - 1,10)   
            }
        }
    }
</script>
<style>
.head_img{
     width: 40px;
    height: 40px;
    border-radius: 20px;
    object-fit: cover;
}
</style>