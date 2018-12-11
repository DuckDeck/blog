<template>
     <div class="container" style="width:600px">   
        <div class="chatHeader"> <el-button @click="goBack">返回</el-button> <div style="display:inline-block;text-align:center;width:75%">{{userInfo.user_real_name}}</div></div>
        <div class="chatContent">
            <div style="height:20px" v-loading = 'loading' element-loading-spinner="el-icon-loading"></div>
            <div v-for="msg in messages" v-bind:key="msg.time">
                <div style="padding:5px;text-align:center" v-show="msg.showTime">{{formatDate(msg.time)}}</div>
                 <div  v-show="msg.sender_id == userInfo.user_id" style="display:flex;padding:10px">
                     <img class="head_img" :src="userInfo.user_image_url" alt="">
                    <div style="align-self:center;margin-right:10px">
                        <div style="font-size:12px">{{userInfo.user_real_name}}</div>
                        <div style="background-color:#eeeeeeee;margin-right:50px;padding:5px;margin-top:3px">{{msg.chat_content}}</div>
                    </div>
                </div>
                <div  v-show="msg.sender_id == myUserInfo.user_id" style="display:flex;padding:10px;flex-direction:row-reverse">
                     <img class="head_img" :src="myUserInfo.user_image_url" alt="">
                    <div style="align-self:center;margin-right:10px">
                        <div style="font-size:12px;text-align:right">{{myUserInfo.user_real_name}}</div>
                        <div style="background-color:#eeeeeeee;margin-left:50px;padding:5px;margin-top:3px">{{msg.chat_content}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="chatSender">
            <div style="padding:5px;font-size:20px;color:#c71585;border-top:1px solid #c71585"><i class="fa fa-smile-o"></i> <i class="fa fa-file-image-o"></i></div>
            <div style="display:flex;padding:5px"> <el-input v-model="msg" type="textarea" rows="3"></el-input> 
             <el-button @click="sendMsg" height="20px" style="margin-left:20px;margin-top:35px" type="primary">发送</el-button></div>
           
        </div>
     </div> 
</template>

<script>
import {getUserInfo,userGetChat} from '../../store/service'
import {Chat} from '../../tool/chat'
import io from 'socket.io-client';
import { clearInterval } from 'timers';
import { throws } from 'assert';
//todo comment sort feature
  export default {
    data() {
      return {
          myUserInfo:{},
          userInfo:{},
          userId:0,
          chat:null,
          socket:null,
          msg:'',
          roomId:'',
          heart:null,
          messages:[],
          scroll:null,
          isLoadAll:false,
          loading:false
      }
    },
    async mounted(){
         this.userId = this.$route.params.id
         this.getTargetUserInfo(this.userId)
        
         this.myUserInfo = getStore('userInfo')
         let id1 = getStore('userInfo').user_id
         let id2 = this.userId
         if(id1 > id2){
            [id1,id2] = [id2,id1]
         }
         console.log('id1:' + id1+'-----id2:'+id2)
         this.roomId = id1 + '_' + id2
         this.getChatMessages()
         this.socket = io.connect('http://127.0.0.1:3000?room_id=' + id1 + '_' + id2)
         
         this.chat =new Chat(this.socket)
         this.socket.on('connect',function (soc) {
            console.log('socket connect success')
         })
        // this.socket.on('disconnect',function (soc) {
        //     console.log('socket connect success')
        // })
        
        this.socket.emit('chat_info',{id1:id1,id2:id2})
        this.socket.on('joinResult',function (result) {
            //$('#room').text(result.room) //这应该写错了
           console.log('show result')
           console.log(result)
        }) 
        this.heart =  setInterval(()=> {
            this.socket.emit('rooms')
        },10000)
        this.socket.on('rooms',function (rooms) {
           console.log('show rooms')
           console.log(rooms)
        })
        this.socket.on('message',(msg)=> {
            console.log('receive new message')
            console.log(msg)
            this.calculateShowTime(msg)
            this.messages.push(msg)
        })
        this.$nextTick(()=>{
            this.scroll = document.querySelector('.chatContent')
            console.log(this.scroll)
            this.scroll.onscroll = (e)=>{
                console.log(this.scroll.scrollHeight)
                console.log(this.scroll.scrollTop)
                console.log(this.scroll.clientHeight)//外面的高度
                if(this.loading){
                    return
                }
                if(this.scroll.scrollTop <= 10){
                    this.loading = true
                    if(!this.isLoadAll){
                        this.getChatMessages()
                    }
                    
                }
            }
        })
    },
    methods:{
        async getTargetUserInfo(id){
           let res = await getUserInfo(id)
           if(res.code == 0){
               this.userInfo = res.data
           }
           else{
               toast(this,res.cMsg)
           }
       },
       async getChatMessages(){
           let id = 0
           if(this.messages.length > 0){
               let i = 0
               while(this.messages[i].id == null){
                   i++
               }
               id = this.messages[i].id
           }
           console.log('id' + id)
           let res = await userGetChat(id,this.roomId)
           this.loading = false
           if(res.code==0&&res.data.length>0){
               this.calculateBatchShowTime(res.data)
               console.log(res.data)
               this.messages = res.data.concat(this.messages)
               this.scrollToBottom()
           }
           else if(res.data.length==0){
               this.isLoadAll = true
               
           }
           else{
               this.isLoadAll = true
               toast(this,res.cMsg)
           }
       },
       goBack(){
           this.$router.go(-1)
       },
       calculateBatchShowTime(msgs){
            if(msgs.length == 1){
                msgs[0].showTime = true
            }
            let index = msgs.length - 2
            while(index >= 0){
                if((msgs[index + 1].time -  msgs[index].time) > 60000){ //如果不在一分钟内
                    msgs[index].showTime = true
                    break
                }
                else{ //如果在一分钟内
              
                }
                index--
            }
        
       },
       calculateShowTime(msg){
            if(this.messages.length == 0){
                msg.showTime = true
            }
            else{
                let index = this.messages.length - 1
                while(index >= 0){
                    let item = this.messages[index]//上一条消息时间是不是在一分钟内
                    console.log(item)
                     if((msg.time -  item.time) > 60000){ //如果不在一分钟内
                         msg.showTime = true
                         break
                     }
                     else{ //如果在一分钟内
                         if(item.showTime){

                         }
                     }
                     index--
                }
            }
       },
       formatDate(time){
           return formatTime(time,'hh:mm')
       },
       sendMsg(){
           //id,chat_type,sender_id,receive_id,time,chat_id,send_status,chat_content
            let msg = {id:null,chat_type:1, sender_id:getStore('userInfo').user_id,receive_id:this.userId,
            time:(new Date()).getTime(),chat_id:this.roomId,send_status:0, chat_content:this.msg}
            this.socket.emit('message',msg)
            this.calculateShowTime(msg)
            this.messages.push(msg)
            this.msg = ''
       },
       scrollToBottom(){
           this.scroll.scrollTop = this.scroll.scrollHeight - this.scroll.clientHeight
           
       }

    },

    computed:{ 
       
    },
    beforeDestroy(){
        console.log(this.heart)
        console.log('Chat vue distroy')
        this.socket.disconnect()
        window.clearInterval(this.heart)
    }
  }
</script>
<style >
.chatHeader{
     background: #eeeeee;
    font-size: 20px;
    padding: 10px;
    margin-top: 60px;
    border-top: 5px solid #c71585
}
.chatContent{
    height: 500px;
    background-color: white;
    overflow: auto
}
.chatSender{
     background-color: white
}
.chatSender div i {
    cursor: pointer;
}
.head_img{
    width: 40px;
    height: 40px;
    border-radius: 20px;
    object-fit: cover;
}
</style>