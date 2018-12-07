var socketio = require('socket.io')
var io

var nickNames = {}
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
        handleMessageBroadCasting(socket,nickNames)
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
      socket.broadcast.to(room).emit('message',{text:nickNames[socket.id] + 'has joined' + room + '.'})
      var usersInRoom =  io.sockets.in(room).clients(function(error, clients){
            if (error) throw error;
         console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
      });
  
      if(usersInRoom.length > 1){
          var usersInRoomSummary = 'Users currently in' + room + ':'
          for(var index in usersInRoom){
              var userSockedId = usersInRoom[index].id
              if(userSockedId != socket.id){
                  if(index > 0){
                      usersInRoomSummary += ', '
                  }
                  usersInRoomSummary += nickNames[userSockedId]
              }
          }
          usersInRoomSummary += '.'
          socket.emit('message',{text:usersInRoomSummary})
      }
}

function handleMessageBroadCasting(socket) {
    socket.on('message',function (message) {
        console.log('receive message:'+message.room)
        socket.broadcast.to(message.room).emit('message',{text:nickNames[socket.id]+':'+message.text})
    })
}
    
function handleClientDisconnection(socket) {
    socket.on('disconnect',function () {
     
         nickNames[socket.id] = null
     })
}