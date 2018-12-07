var socketio = require('socket.io')
var io

var currentRoom = {}

exports.listen = function(server){
    io = socketio.listen(server)
    io.set('log level',1)
    io.sockets.on('connection',function(socket){
        console.log('a connection occor,the socket id=' + socket.id)
        console.log(socket.handshake.query)
        let room = socket.handshake.query.room_id
        currentRoom[socket.id] = room
       
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

function handleMessageBroadCasting(socket) {
    socket.on('message',function (message) {
        console.log('receive message:'+message.room)
        socket.broadcast.to(message.room).emit('message',{room:message.room,sender_id:message.sender_id,text:message.text,type:1,time:(new Date()).getTime()})
    })
}
    
function handleClientDisconnection(socket) {
    socket.on('disconnect',function () {
        
         
     })
}