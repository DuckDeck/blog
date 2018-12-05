<template>
     <div class="container" style="width:600px">   
        <div class="chatHeader"> <el-button @click="goBack">返回</el-button> {{userInfo.user_real_name}}</div>
        <div class="chatContent"></div>
        <div class="chatSender">
            <div style="padding:5px;font-size:20px;color:#c71585;border-top:1px solid #c71585"><i class="fa fa-smile-o"></i> <i class="fa fa-file-image-o"></i></div>
            <div style="display:flex;padding:5px"> <el-input></el-input>  <el-button style="margin-left:20px">发送</el-button></div>
           
        </div>
     </div> 
</template>

<script>
import {getUserInfo} from '../../store/service'
import {Chat} from '../../tool/chat'
import io from 'socket.io-client';
//todo comment sort feature
  export default {
    data() {
      return {
          userInfo:{},
          userId:0,
          chat:null,
          socket:null,
      }
    },
    async mounted(){
       
         this.socket = io.connect('http://127.0.0.1:3000')
         this.chat =new Chat(this.socket)
        
         this.userId = this.$route.params.id
         this.getTargetUserInfo(this.userId)
        this.socket.on('connect',function (soc) {
            console.log('socket connect success')
        })
        // this.socket.on('disconnect',function (soc) {
        //     console.log('socket connect success')
        // })
         this.socket.on('joinResult',function (result) {
            //$('#room').text(result.room) //这应该写错了
            console.log(result)
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
       }
    },

    computed:{    
    },
    destroyed(){
        
    }
  }
</script>
<style >
.chatHeader{
     background: #eeeeee;
    font-size: 20px;
    padding: 20px;
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
</style>