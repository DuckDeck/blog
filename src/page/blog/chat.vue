<template>
     <div class="container" style="width:600px">   
        <div class="chatHeader"> <el-button @click="goBack">返回</el-button> <div style="display:inline-block;text-align:center;width:75%">{{userInfo.user_real_name}}</div></div>
        <div class="chatContent">
            <div v-for="msg in messages" v-bind:key="msg.time">
                <div style="padding:5px;text-align:center" v-show="msg.showTime">{{formatDate(msg.time)}}</div>
                 <div  v-show="msg.sender_id == userInfo.user_id" style="display:flex;padding:10px">
                     <img class="head_img" :src="userInfo.user_image_url" alt="">
                    <div style="align-self:center;margin-right:10px">
                        <div style="font-size:12px">{{userInfo.user_real_name}}</div>
                        <div style="background-color:#eeeeeeee;margin-right:50px;padding:5px;margin-top:3px">{{msg.text}}</div>
                    </div>
                </div>
                <div  v-show="msg.sender_id == myUserInfo.user_id" style="display:flex;padding:10px;flex-direction:row-reverse">
                     <img class="head_img" :src="myUserInfo.user_image_url" alt="">
                    <div style="align-self:center;margin-right:10px">
                        <div style="font-size:12px;text-align:right">{{myUserInfo.user_real_name}}</div>
                        <div style="background-color:#eeeeeeee;margin-left:50px;padding:5px;margin-top:3px">{{msg.text}}</div>
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
import {getUserInfo} from '../../store/service'
import {Chat} from '../../tool/chat'
import io from 'socket.io-client';
import { clearInterval } from 'timers';
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
       goBack(){
           this.$router.go(-1)
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
            let msg = {room:this.roomId,sender_id:getStore('userInfo').user_id,receive_id:this.userId,
            text:this.msg,type:1,time:(new Date()).getTime()}
            this.socket.emit('message',msg)
            this.calculateShowTime(msg)
            this.messages.push(msg)
            this.msg = ''
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
    min-height: 500px;
    background-color: white
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