var socketio = require('socket.io')
var io
const Chat = require('../model/chat')
var currentRoom = {}
//怎么判断对方有没有收到信息，可以这样试试，就是看这个room里有几个session如果只有一个，那肯定就是自己了，那对方应该是没有
//收到信息，如果有两个，那就是收到信息了
exports.listen = function(server){
    io = socketio.listen(server)
    io.set('log level',1)
    io.sockets.on('connection',function(socket){
        console.log('a connection occor,the socket id=' + socket.id)
        console.log(socket.handshake.query)
        let room = socket.handshake.query.room_id
        if(currentRoom[room] == null){ //当前room有多少个socket连接
            currentRoom[room] = []
        }
        currentRoom[room].push(socket.id)
        joinRoom(socket,room)
        handleMessageBroadCasting(socket)
        //这里是用于心跳包
        socket.on('rooms',function(){
            socket.emit('rooms',io.sockets.adapter.rooms)
        })
        handleClientDisconnection(socket)
    })

}


function joinRoom(socket,room) {
      socket.join(room)
      socket.emit('joinResult',{room:room})
}

async function handleMessageBroadCasting(socket) {
    socket.on('message',async function (message) {
        console.log('receive message:'+message.room)
        let newMsg = {room:message.room,sender_id:message.sender_id,text:message.text,type:1,time:(new Date()).getTime()}
        let receive_status = 0
        if(currentRoom[newMsg.room].length >1){ //对面有收到
            receive_status = 1
        }
        let chatInfo = new Chat(0,1,newMsg.sender_id,message.receive_id,newMsg.time,newMsg.room,receive_status,newMsg.text)
        let id =  await Chat.save(chatInfo)
        
        socket.broadcast.to(message.room).emit('message',newMsg)
    })
}
    
function handleClientDisconnection(socket) {
    socket.on('disconnect',function () {
         console.log('socket disconnect')
         for(let key in currentRoom){
             let index = currentRoom[key].findIndex(t=>{
                 return t == socket.id
             })
             if(index >= 0){
                currentRoom[key].splice(index,1)
                break
             }
         }
     })
}